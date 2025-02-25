const hre = require("hardhat");

async function main() {
  try {
    // Get the contract factory
    console.log("Getting contract factory...");
    const PokemonCard = await hre.ethers.getContractFactory("PokemonCard");
    
    // Deploy PokemonCard
    console.log("Deploying PokemonCard...");
    const pokemonCard = await PokemonCard.deploy();
    await pokemonCard.waitForDeployment();
    
    // Get and log PokemonCard details
    const pokemonCardAddress = await pokemonCard.getAddress();
    console.log("PokemonCard deployed to:", pokemonCardAddress);
    const owner = await pokemonCard.owner();
    console.log("Contract owner:", owner);

    // Get the contract factory for PokemonTrade
    console.log("Getting contract factory for PokemonTrade...");
    const PokemonTrade = await hre.ethers.getContractFactory("PokemonTrade");

    // Deploy PokemonTrade with both required constructor arguments
    console.log("Deploying PokemonTrade...");
    const pokemonTrade = await PokemonTrade.deploy(
      pokemonCardAddress, // _nftContract
      pokemonCardAddress  // _pokemonCardAddress
    );
    await pokemonTrade.waitForDeployment();

    // Get and log PokemonTrade details
    const pokemonTradeAddress = await pokemonTrade.getAddress();
    console.log("PokemonTrade deployed to:", pokemonTradeAddress);

    // Set approval for PokemonTrade to manage all tokens
    await pokemonCard.setApprovalForAll(pokemonTradeAddress, true);
    console.log("Approval set for PokemonTrade contract");

  } catch (error) {
    console.error("Deployment error:", error);
    console.error("Error details:", error.message);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 