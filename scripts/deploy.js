const hre = require("hardhat");
const axios = require("axios");

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

    // Example IPFS links for the NFTs
    const ipfsLinks = [
      "https://gateway.pinata.cloud/ipfs/QmT3WHm5dRHN2KRyqnV469mbDVnJxtH3TbV5z89sHFxY2d",
      "https://gateway.pinata.cloud/ipfs/QmURYmYE3y18UvbS5YPyAjRv6wnPEcXUywvVAT9ktf2z7T"
      // Add more IPFS links as needed
    ];

    // Mint cards using the IPFS metadata
    for (const ipfsLink of ipfsLinks) {
      const response = await axios.get(ipfsLink.replace("ipfs://", "https://ipfs.io/ipfs/"));
      const metadata = response.data;

      // Extract attributes from the metadata
      const name = metadata.name;
      const attributes = metadata.attributes || [];

      // Initialize variables for attributes
      let primaryType, secondaryType, attack, defense;

      // Loop through attributes to find the required values
      for (const attribute of attributes) {
        if (attribute.trait_type === 'Primary Type') {
          primaryType = attribute.value;
        } else if (attribute.trait_type === 'Secondary Type') {
          secondaryType = attribute.value;
        } else if (attribute.trait_type === 'Attack') {
          attack = attribute.value;
        } else if (attribute.trait_type === 'Defense') {
          defense = attribute.value;
        }
      }
      // Check if all required attributes are defined
      if (!name || !primaryType || !secondaryType || attack === undefined || defense === undefined) {
        console.error("Missing required metadata attributes for minting:", metadata);
        console.log(name, primaryType, secondaryType, attack, defense);
        continue; // Skip this iteration if any required attribute is missing
      }

      // Call the mint function
      console.log(`Minting card for ${name}...`);
      const tx = await pokemonCard.mintCard(
        owner, 
        name,
        primaryType,
        secondaryType,
        attack,
        defense,
        ipfsLink
      );
      await tx.wait();
      console.log(`Minted card for ${name} with IPFS link: ${ipfsLink} to ${owner}`);
    }

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