// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PokemonCard is ERC721Enumerable, Ownable {
    struct PokemonAttributes {
        string name;        // Name of the Pokémon
        string pType;        // Type (e.g., Fire, Water, Electric)
        uint256 attack;     // Attack points
        uint256 defense;    // Defense points
        // Pokemon number?
        // Pokemon image?
        // Pokemon description?
        // Pokemon rarity?
        // Pokemon price?
        // Is pokemon shiny?
        // can we have more than one of the same pokemon?
    }

    // Mapping from token ID to Pokémon attributes
    mapping(uint256 => PokemonAttributes) public pokemonAttributes;

    uint256 public nextTokenId;

    // Pass required arguments to base contracts
    constructor() ERC721("PokemonCard", "PKMN") Ownable(msg.sender) {}

    // Mint a new Pokémon card with specific attributes
    function mintCard(
        address to,
        string memory name,
        string memory _type,
        uint256 attack,
        uint256 defense
    ) external onlyOwner {
        uint256 tokenId = nextTokenId;

        // Create the Pokémon card
        pokemonAttributes[tokenId] = PokemonAttributes(name, _type, attack, defense);
        _safeMint(to, tokenId);

        nextTokenId++;
    }

    // Get attributes of a specific Pokémon card
    function getPokemonAttributes(uint256 tokenId)
        external
        view
        returns (PokemonAttributes memory)
    {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        return pokemonAttributes[tokenId];
    }
}
