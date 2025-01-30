// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

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

    mapping(uint256 => Sale) public sales;

    IPokemonCard public nftContract;

    event CardListed(uint256 tokenId, uint256 price, address seller);
    event CardSold(uint256 tokenId, address buyer, uint256 price);

    constructor(address _nftContract) {
        nftContract = IPokemonCard(_nftContract);
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
}
