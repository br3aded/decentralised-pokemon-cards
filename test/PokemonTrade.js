/*
const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("PokemonTrade", function () {
  async function deployPokemonTradeFixture() {
    // Get signers
    const [owner, user1, user2] = await ethers.getSigners();

    // Deploy PokemonCard first
    const PokemonCard = await ethers.getContractFactory("PokemonCard");
    const pokemonCard = await PokemonCard.deploy();

    // Deploy PokemonTrade
    const PokemonTrade = await ethers.getContractFactory("PokemonTrade");
    const pokemonTrade = await PokemonTrade.deploy(pokemonCard.target,pokemonCard.target);

    return { pokemonCard, pokemonTrade, owner, user1, user2 };
  }

  describe("Deployment", function () {
    it("Should set the correct PokemonCard contract address", async function () {
      const { pokemonTrade, pokemonCard } = await loadFixture(deployPokemonTradeFixture);
      expect(await pokemonTrade.pokemonCardContract()).to.equal(pokemonCard.target);
    });
  });

  describe("Trading", function () {
    it("Should create a trade offer", async function () {
      const { pokemonCard, pokemonTrade, user1, user2 } = await loadFixture(deployPokemonTradeFixture);
      
      // Mint cards for trading
      await pokemonCard.mintCard(user1.address, "Pikachu", "Electric", 100);
      
      // Approve trade contract
      await pokemonCard.connect(user1).approve(pokemonTrade.target, 1);
      
      // Create trade offer
      await expect(pokemonTrade.connect(user1).createTradeOffer(1, user2.address))
        .to.emit(pokemonTrade, "TradeOfferCreated")
        .withArgs(1, user1.address, user2.address);
    });

    it("Should accept a trade offer", async function () {
      const { pokemonCard, pokemonTrade, user1, user2 } = await loadFixture(deployPokemonTradeFixture);
      
      // Mint cards for both users
      await pokemonCard.mintCard(user1.address, "Pikachu", "Electric", 100);
      await pokemonCard.mintCard(user2.address, "Charizard", "Fire", 200);
      
      // Approve trade contract for both cards
      await pokemonCard.connect(user1).approve(pokemonTrade.target, 1);
      await pokemonCard.connect(user2).approve(pokemonTrade.target, 2);
      
      // Create and accept trade
      await pokemonTrade.connect(user1).createTradeOffer(1, user2.address);
      await expect(pokemonTrade.connect(user2).acceptTradeOffer(1, 2))
        .to.emit(pokemonTrade, "TradeCompleted")
        .withArgs(1, 2, user1.address, user2.address);
    });
  });

  describe("Trade Cancellation", function () {
    it("Should cancel a trade offer", async function () {
      const { pokemonCard, pokemonTrade, user1, user2 } = await loadFixture(deployPokemonTradeFixture);
      
      // Mint card
      await pokemonCard.mintCard(user1.address, "Pikachu", "Electric", 100);
      await pokemonCard.connect(user1).approve(pokemonTrade.target, 1);
      
      // Create trade offer
      await pokemonTrade.connect(user1).createTradeOffer(1, user2.address);
      
      // Cancel trade offer
      await expect(pokemonTrade.connect(user1).cancelTradeOffer(1))
        .to.emit(pokemonTrade, "TradeOfferCancelled")
        .withArgs(1, user1.address);
    });
  });
}); 
*/