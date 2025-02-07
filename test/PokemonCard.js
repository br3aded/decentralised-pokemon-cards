const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("PokemonCard", function () {
  async function deployPokemonCardFixture() {
    const [owner, user1, user2] = await ethers.getSigners();

    const PokemonCard = await ethers.getContractFactory("PokemonCard");
    const pokemonCard = await PokemonCard.deploy();

    return { pokemonCard, owner, user1, user2 };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { pokemonCard, owner } = await loadFixture(deployPokemonCardFixture);
      expect(await pokemonCard.owner()).to.equal(owner.address);
    });

    it("Should have correct name and symbol", async function () {
      const { pokemonCard } = await loadFixture(deployPokemonCardFixture);
      expect(await pokemonCard.name()).to.equal("PokemonCard");
      expect(await pokemonCard.symbol()).to.equal("PKMN");
    });

    it("Should start with token ID 0", async function () {
      const { pokemonCard } = await loadFixture(deployPokemonCardFixture);
      expect(await pokemonCard.getNextTokenId()).to.equal(0);
    });
  });

  describe("Minting", function () {
    it("Should mint a new card", async function () {
      const { pokemonCard, owner, user1 } = await loadFixture(deployPokemonCardFixture);
      
      await pokemonCard.mintCard(
        user1.address,
        "Pikachu",
        "Electric",
        "None",
        100,
        80
      );

      expect(await pokemonCard.ownerOf(0)).to.equal(user1.address);
      expect(await pokemonCard.getNextTokenId()).to.equal(1);
    });

    it("Should store correct pokemon attributes", async function () {
      const { pokemonCard, user1 } = await loadFixture(deployPokemonCardFixture);
      
      await pokemonCard.mintCard(
        user1.address,
        "Charizard",
        "Fire",
        "Flying",
        200,
        150
      );

      const attributes = await pokemonCard.getPokemonAttributes(0);
      expect(attributes.name).to.equal("Charizard");
      expect(attributes.primaryType).to.equal("Fire");
      expect(attributes.secondaryType).to.equal("Flying");
      expect(attributes.attack).to.equal(200);
      expect(attributes.defense).to.equal(150);
    });

    it("Should only allow owner to mint", async function () {
      const { pokemonCard, user1 } = await loadFixture(deployPokemonCardFixture);
      
      await expect(pokemonCard.connect(user1).mintCard(
        user1.address,
        "Pikachu",
        "Electric",
        "None",
        100,
        80
      )).to.be.revertedWithCustomError(pokemonCard, "OwnableUnauthorizedAccount");
    });
  });

  describe("Card Properties", function () {
    it("Should revert when querying non-existent token", async function () {
      const { pokemonCard } = await loadFixture(deployPokemonCardFixture);
      
      await expect(pokemonCard.getPokemonAttributes(999))
        .to.be.revertedWithCustomError(pokemonCard, "ERC721NonexistentToken")
        .withArgs(999);
    });
  });
}); 