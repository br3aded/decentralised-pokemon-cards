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

    struct Auction {
        uint256 startingPrice;
        uint256 highestBid;
        address highestBidder;
        address seller;
        uint256 endTime;
        bool active;
    }

    mapping(uint256 => Sale) public sales;
    mapping(uint256 => Auction) public auctions;
    mapping(address => mapping(uint256 => uint256)) public pendingReturns;

    IPokemonCard public nftContract;
    PokemonCard public pokemonCard;

    event CardListed(uint256 tokenId, uint256 price, address seller);
    event CardSold(uint256 tokenId, address buyer, uint256 price);
    event AuctionCreated(uint256 tokenId, uint256 startingPrice, uint256 duration, address seller);
    event BidPlaced(uint256 tokenId, address bidder, uint256 amount);
    event AuctionEnded(uint256 tokenId, address winner, uint256 amount);

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

        auctions[tokenId] = Auction({
            startingPrice: startingPrice,
            highestBid: 0,
            highestBidder: address(0),
            seller: msg.sender,
            endTime: block.timestamp + duration,
            active: true
        });

        emit AuctionCreated(tokenId, startingPrice, duration, msg.sender);
    }

    function placeBid(uint256 tokenId) external payable nonReentrant {
        Auction storage auction = auctions[tokenId];
        require(auction.active, "Auction does not exist or has ended");
        require(block.timestamp < auction.endTime, "Auction has ended");
        require(msg.value > auction.highestBid && msg.value >= auction.startingPrice, "Bid too low");

        if (auction.highestBidder != address(0)) {
            // Refund the previous highest bidder
            pendingReturns[auction.highestBidder][tokenId] += auction.highestBid;
        }

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

            emit AuctionEnded(tokenId, auction.highestBidder, auction.highestBid);
        }
    }

    function withdrawBid(uint256 tokenId) external nonReentrant {
        uint256 amount = pendingReturns[msg.sender][tokenId];
        require(amount > 0, "No funds to withdraw");

        pendingReturns[msg.sender][tokenId] = 0;
        payable(msg.sender).transfer(amount);
    }
}
