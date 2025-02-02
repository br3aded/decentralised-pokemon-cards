// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./PokemonCard.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IPokemonCard {
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
    function ownerOf(uint256 tokenId) external view returns (address);
}

contract PokemonTrade is ReentrancyGuard {
    struct Sale {
        uint256 price;
        address seller;
    }

    struct Bid {
        address bidder;
        uint256 amount;
    }

    struct Auction {
        uint256 startingPrice;
        uint256 highestBid;
        address highestBidder;
        address seller;
        uint256 endTime;
        bool active;
        Bid[] bids;  // Array to store all bids
    }

    mapping(uint256 => Sale) public sales;
    mapping(uint256 => Auction) public auctions;

    IPokemonCard public nftContract;
    PokemonCard public pokemonCard;

    event CardListed(uint256 tokenId, uint256 price, address seller);
    event CardSold(uint256 tokenId, address buyer, uint256 price);
    event AuctionCreated(uint256 tokenId, uint256 startingPrice, uint256 duration, address seller);
    event BidPlaced(uint256 tokenId, address bidder, uint256 amount);
    event AuctionEnded(uint256 tokenId, address winner, uint256 amount);
    event AuctionCancelled(uint256 tokenId, address seller);
    event BidWithdrawn(uint256 tokenId, address bidder, uint256 amount);

    constructor(address _nftContract, address _pokemonCardAddress) {
        nftContract = IPokemonCard(_nftContract);
        pokemonCard = PokemonCard(_pokemonCardAddress);
    }

    function listCard(uint256 tokenId, uint256 price) external nonReentrant {
        require(price > 0, "Price must be greater than zero");
        require(nftContract.ownerOf(tokenId) == msg.sender, "You do not own this card");

        sales[tokenId] = Sale(price, msg.sender);

        emit CardListed(tokenId, price, msg.sender);
    }

    function buyCard(uint256 tokenId) external payable nonReentrant {
        Sale memory sale = sales[tokenId];
        require(sale.price > 0, "Card is not for sale");
        require(msg.value >= sale.price, "Insufficient payment");

        address seller = sale.seller;

        delete sales[tokenId];

        // Transfer funds and card
        payable(seller).transfer(sale.price);
        nftContract.safeTransferFrom(seller, msg.sender, tokenId);

        emit CardSold(tokenId, msg.sender, sale.price);
    }

    function createAuction(uint256 tokenId, uint256 startingPrice, uint256 duration) external nonReentrant {
        require(startingPrice > 0, "Starting price must be greater than zero");
        require(duration > 0, "Duration must be greater than zero");
        require(nftContract.ownerOf(tokenId) == msg.sender, "You do not own this card");
        require(!auctions[tokenId].active, "Auction already exists for this token");

        Auction storage newAuction = auctions[tokenId];
        newAuction.startingPrice = startingPrice;
        newAuction.highestBid = 0;
        newAuction.highestBidder = address(0);
        newAuction.seller = msg.sender;
        newAuction.endTime = block.timestamp + duration;
        newAuction.active = true;
        // The bids array will be initialized empty by default

        emit AuctionCreated(tokenId, startingPrice, duration, msg.sender);
    }

    function placeBid(uint256 tokenId) external payable nonReentrant {
        Auction storage auction = auctions[tokenId];
        require(auction.active, "Auction does not exist or has ended");
        require(block.timestamp < auction.endTime, "Auction has ended");
        require(msg.value > auction.highestBid && msg.value >= auction.startingPrice, "Bid too low");

        // Store the new bid in the bids array
        auction.bids.push(Bid(msg.sender, msg.value));
        
        // Update highest bid info
        auction.highestBid = msg.value;
        auction.highestBidder = msg.sender;

        emit BidPlaced(tokenId, msg.sender, msg.value);
    }

    function endAuction(uint256 tokenId) external nonReentrant {
        Auction storage auction = auctions[tokenId];
        require(auction.active, "Auction does not exist or has already ended");
        require(block.timestamp >= auction.endTime, "Auction has not ended yet");

        auction.active = false;

        if (auction.highestBidder != address(0)) {
            // Transfer the NFT to the winner
            nftContract.safeTransferFrom(auction.seller, auction.highestBidder, tokenId);
            // Transfer the highest bid to the seller
            payable(auction.seller).transfer(auction.highestBid);

            // Refund all losing bids
            for (uint i = 0; i < auction.bids.length - 1; i++) {
                Bid memory bid = auction.bids[i];
                if (bid.bidder != auction.highestBidder) {
                    payable(bid.bidder).transfer(bid.amount);
                }
            }

            emit AuctionEnded(tokenId, auction.highestBidder, auction.highestBid);
        }
    }

    function cancelAuction(uint256 tokenId) external nonReentrant {
        Auction storage auction = auctions[tokenId];
        require(auction.active, "Auction does not exist or has already ended");
        require(auction.seller == msg.sender, "Only the seller can cancel the auction");
        require(block.timestamp < auction.endTime, "Auction has already ended");

        auction.active = false;

        // If there was a bid, immediately refund the highest bidder
        if (auction.highestBidder != address(0)) {
            payable(auction.highestBidder).transfer(auction.highestBid);
        }

        emit AuctionCancelled(tokenId, msg.sender);
    }

    function withdrawBidEarly(uint256 tokenId) external nonReentrant {
        Auction storage auction = auctions[tokenId];
        require(auction.active, "Auction does not exist or has ended");
        require(auction.highestBidder == msg.sender, "You are not the highest bidder");
        require(block.timestamp < auction.endTime, "Auction has already ended");

        uint256 amount = auction.highestBid;
        
        // Find the previous highest bid
        uint256 previousHighestBid = auction.startingPrice;
        address previousHighestBidder = address(0);
        
        if (auction.bids.length > 1) {
            // Get the second-to-last bid
            Bid memory previousBid = auction.bids[auction.bids.length - 2];
            previousHighestBid = previousBid.amount;
            previousHighestBidder = previousBid.bidder;
        }

        // Update auction state to previous highest bid
        auction.highestBid = previousHighestBid;
        auction.highestBidder = previousHighestBidder;
        
        // Remove the withdrawn bid from the array
        auction.bids.pop();

        // Return the bid amount to the withdrawing bidder
        payable(msg.sender).transfer(amount);

        emit BidWithdrawn(tokenId, msg.sender, amount);
    }

    function getSale(uint256 tokenId) external view returns (Sale memory) {
        return sales[tokenId];
    }
}
