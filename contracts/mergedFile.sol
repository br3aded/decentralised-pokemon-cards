// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract PokemonCard is ERC721Enumerable, Ownable {
    struct PokemonAttributes {
        string name;
        string pType;
        uint256 attack;
        uint256 defense;
    }

    mapping(uint256 => PokemonAttributes) public pokemonAttributes;

    uint256 public nextTokenId;

    // Pass required arguments to base contracts
    constructor() ERC721("PokemonCard", "PKMN") Ownable(msg.sender) {}

    function mintCard(
        address to,
        string memory name,
        string memory _type,
        uint256 attack,
        uint256 defense
    ) external onlyOwner {
        uint256 tokenId = nextTokenId;
        pokemonAttributes[tokenId] = PokemonAttributes(name, _type, attack, defense);
        _safeMint(to, tokenId);
        nextTokenId++;
    }

    function getPokemonAttributes(uint256 tokenId)
        external
        view
        returns (PokemonAttributes memory)
    {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        return pokemonAttributes[tokenId];
    }
}

contract PokemonTrade is ReentrancyGuard {
    struct Sale {
        uint256 price;
        address seller;
    }

    mapping(uint256 => Sale) public sales;

    PokemonCard public nftContract;

    event CardListed(uint256 tokenId, uint256 price, address seller);
    event CardSold(uint256 tokenId, address buyer, uint256 price);

    constructor(address _nftContract) {
        nftContract = PokemonCard(_nftContract);
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

        payable(seller).transfer(sale.price);
        nftContract.safeTransferFrom(seller, msg.sender, tokenId);

        emit CardSold(tokenId, msg.sender, sale.price);
    }
}
