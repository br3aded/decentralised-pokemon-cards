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
      
      const tokenURI = "https://example.com/pikachu";
      await pokemonCard.mintCard(
        user1.address,
        "Pikachu",
        "Electric",
        "None",
        100,
        80,
        tokenURI
      );

      expect(await pokemonCard.ownerOf(0)).to.equal(user1.address);
      expect(await pokemonCard.getNextTokenId()).to.equal(1);
    });

    it("Should store correct pokemon attributes", async function () {
      const { pokemonCard, user1 } = await loadFixture(deployPokemonCardFixture);
      
      const tokenURI = "https://example.com/charizard";
      await pokemonCard.mintCard(
        user1.address,
        "Charizard",
        "Fire",
        "Flying",
        200,
        150,
        tokenURI
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
      
      const tokenURI = "https://example.com/pikachu";
      await expect(pokemonCard.connect(user1).mintCard(
        user1.address,
        "Pikachu",
        "Electric",
        "None",
        100,
        80,
        tokenURI
      )).to.be.revertedWithCustomError(pokemonCard, "OwnableUnauthorizedAccount");
    });
  });

  describe("Additional Tests", function () {
    let pokemonCard, owner, user1, user2;

    beforeEach(async function () {
      const fixture = await loadFixture(deployPokemonCardFixture);
      pokemonCard = fixture.pokemonCard;
      owner = fixture.owner;
      user1 = fixture.user1;
      user2 = fixture.user2;
    });

    it("Should mint multiple cards and store correct attributes", async function () {
      const tokenURI1 = "https://example.com/pikachu";
      await pokemonCard.mintCard(user1.address, "Pikachu", "Electric", "None", 100, 80, tokenURI1);

      const tokenURI2 = "https://example.com/charizard";
      await pokemonCard.mintCard(user1.address, "Charizard", "Fire", "Flying", 200, 150, tokenURI2);

      const attributes1 = await pokemonCard.getPokemonAttributes(0);
      expect(attributes1.name).to.equal("Pikachu");
      expect(attributes1.primaryType).to.equal("Electric");
      expect(attributes1.attack).to.equal(100);
      expect(attributes1.defense).to.equal(80);

      const attributes2 = await pokemonCard.getPokemonAttributes(1);
      expect(attributes2.name).to.equal("Charizard");
      expect(attributes2.primaryType).to.equal("Fire");
      expect(attributes2.attack).to.equal(200);
      expect(attributes2.defense).to.equal(150);
    });

    it("Should revert when trying to mint a card from a non-owner account", async function () {
      const tokenURI = "https://example.com/pikachu";
      await expect(pokemonCard.connect(user1).mintCard(user1.address, "Pikachu", "Electric", "None", 100, 80, tokenURI))
          .to.be.revertedWithCustomError(pokemonCard, "OwnableUnauthorizedAccount");
    });


    it("Should return the correct next token ID after multiple mints", async function () {
      const tokenURI1 = "https://example.com/pikachu";
      await pokemonCard.mintCard(user1.address, "Pikachu", "Electric", "None", 100, 80, tokenURI1);
      
      const tokenURI2 = "https://example.com/charizard";
      await pokemonCard.mintCard(user1.address, "Charizard", "Fire", "Flying", 200, 150, tokenURI2);

      expect(await pokemonCard.getNextTokenId()).to.equal(2);
    });

    it("Should return the correct token URI for a minted card", async function () {
      const tokenURI = "https://example.com/pikachu";
      await pokemonCard.mintCard(user1.address, "Pikachu", "Electric", "None", 100, 80, tokenURI);

      expect(await pokemonCard.tokenURI(0)).to.equal(tokenURI);
    });
  });
}); 