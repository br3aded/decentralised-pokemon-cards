// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Import the ERC721 contract from OpenZeppelin
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

// Inherit from ERC721, ERC721Enumerable, and ERC721URIStorage
contract PokemonCard is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    struct PokemonAttributes {
        string name;        // Name of the Pokémon
        string primaryType; // Primary type (e.g., Fire, Water, Electric)
        string secondaryType; // Secondary type
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

    // Required override for ERC721Enumerable
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }


    // Mint a new Pokémon card with specific attributes
    function mintCard(
        address to,
        string memory name,
        string memory _primaryType,
        string memory _secondaryType,
        uint256 attack,
        uint256 defense,
        string memory ipfsLink
    ) external onlyOwner {
        uint256 tokenId = nextTokenId;

        // Create the Pokémon card
        pokemonAttributes[tokenId] = PokemonAttributes(
            name,
            _primaryType,
            _secondaryType,
            attack,
            defense
        );
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, ipfsLink);

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

    function getNextTokenId() external view returns (uint256) {
    return nextTokenId;
}

    // Override tokenURI function to return the URI for a given tokenId
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}
