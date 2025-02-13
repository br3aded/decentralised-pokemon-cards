// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./PokemonCard.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

interface IPokemonCard {
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
    function ownerOf(uint256 tokenId) external view returns (address);
    function approve(address to, uint256 tokenId) external;
}

contract PokemonTrade is ReentrancyGuard, IERC721Receiver {
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

    uint256 public totalAuctionTokens; // Counter for total auction tokens

    event CardListed(uint256 tokenId, uint256 price, address seller);
    event CardSold(uint256 tokenId, address buyer, uint256 price);
    event CardRemovedFromSale(uint256 tokenId, address seller);
    event AuctionCreated(uint256 tokenId, uint256 startingPrice, uint256 duration, address seller);
    event BidPlaced(uint256 tokenId, address bidder, uint256 amount);
    event AuctionEnded(uint256 tokenId, address winner, uint256 amount);
    event AuctionCancelled(uint256 tokenId, address seller);
    event BidWithdrawn(uint256 tokenId, address bidder, uint256 amount);
    event Transfer(address from, address to, uint256 tokenId);

    constructor(address _nftContract, address _pokemonCardAddress) {
        nftContract = IPokemonCard(_nftContract);
        pokemonCard = PokemonCard(_pokemonCardAddress);
    }

    function listCard(uint256 tokenId, uint256 price) external nonReentrant {
        require(price > 0, "Price must be greater than zero");
        require(nftContract.ownerOf(tokenId) == msg.sender, "You do not own this card");

        // Convert price from ETH to wei (1 ETH = 10^18 wei)
        uint256 priceInWei = price * 1 ether;
        
        sales[tokenId] = Sale(priceInWei, msg.sender);

        emit CardListed(tokenId, priceInWei, msg.sender);
    }

    function buyCard(uint256 tokenId) external payable nonReentrant {
        Sale storage sale = sales[tokenId];
        require(sale.price > 0, "Card is not for sale");
        require(sale.seller != address(0), "Invalid seller");
        require(msg.value >= sale.price, "Insufficient payment");

        uint256 price = sale.price;
        address payable seller = payable(sale.seller);  // Make seller payable explicitly

        // First transfer the payment
        seller.transfer(price);  // Transfer before deleting the sale

        // Then delete the sale
        delete sales[tokenId];

        // Then transfer the NFT
        nftContract.safeTransferFrom(seller, msg.sender, tokenId);

        // Return excess payment if any
        uint256 excess = msg.value - price;
        if (excess > 0) {
            payable(msg.sender).transfer(excess);
        }

        emit CardSold(tokenId, msg.sender, price);
    }

    function removeCardFromSale(uint256 tokenId) external nonReentrant {
        Sale memory sale = sales[tokenId];
        require(sale.seller == msg.sender, "Only the seller can remove the card from sale");
        require(sale.price > 0, "Card is not for sale");

        delete sales[tokenId]; // Remove the sale

        emit CardRemovedFromSale(tokenId, msg.sender); // Emit an event for logging
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external override returns (bytes4) {
        // Return the function selector to indicate successful receipt
        return IERC721Receiver.onERC721Received.selector;
    }

    /// @notice Create an auction for a card
    /// @param tokenId The ID of the card to auction
    /// @param minimumPriceInEth Minimum price in ETH (e.g., 1 = 1 ETH)
    /// @param endTime Exact end time in Unix timestamp (must be on minute boundary)
    function createAuction(uint256 tokenId, uint256 minimumPriceInEth, uint256 endTime) external {
        require(nftContract.ownerOf(tokenId) == msg.sender, "You do not own this card");
        require(minimumPriceInEth > 0, "Minimum price must be greater than 0");
        require(endTime > block.timestamp, "End time must be in the future");
        require(endTime % 60 == 0, "End time must be at the start of a minute");

        // Convert price from ETH to wei
        uint256 priceInWei = minimumPriceInEth * 1 ether;

        // Transfer the NFT to this contract immediately
        nftContract.safeTransferFrom(msg.sender, address(this), tokenId);

        Auction storage newAuction = auctions[tokenId];
        newAuction.highestBidder = address(0);
        newAuction.seller = msg.sender;
        newAuction.endTime = endTime;
        newAuction.highestBid = 0;
        newAuction.startingPrice = priceInWei;
        newAuction.active = true;

        totalAuctionTokens++;

        emit AuctionCreated(tokenId, priceInWei, endTime, msg.sender);
    }

    function placeBid(uint256 tokenId) external payable nonReentrant {
        Auction storage auction = auctions[tokenId];
        require(auction.active, "Auction does not exist or has ended");
        require(block.timestamp < auction.endTime, "Auction has ended");
        require(msg.value > auction.highestBid && msg.value >= auction.startingPrice, "Bid too low");

        // If there was a previous bid, refund it immediately
        if (auction.highestBidder != address(0)) {
            payable(auction.highestBidder).transfer(auction.highestBid);
        }

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
            // Transfer funds to seller first
            payable(auction.seller).transfer(auction.highestBid);

            // Transfer NFT to winner
            try nftContract.safeTransferFrom(address(this), auction.highestBidder, tokenId) {
                emit AuctionEnded(tokenId, auction.highestBidder, auction.highestBid);
                emit Transfer(address(this), auction.highestBidder, tokenId);
            } catch {
                revert("Failed to transfer NFT to winner");
            }
        } else {
            // Return NFT to seller if no bids
            try nftContract.safeTransferFrom(address(this), auction.seller, tokenId) {
                emit AuctionEnded(tokenId, address(0), 0);
            } catch {
                revert("Failed to return NFT to seller");
            }
        }

        // Clean up auction data
        delete auctions[tokenId];
        totalAuctionTokens--;
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

    function getAuction(uint256 tokenId) external view returns (Auction memory) {
        require(auctions[tokenId].active, "Auction does not exist or has ended");
        return auctions[tokenId];
    }

    function getTotalAuctionTokens() external view returns (uint256) {
        return totalAuctionTokens;
    }

}
