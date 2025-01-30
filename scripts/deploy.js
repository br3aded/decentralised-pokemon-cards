async function main() {
  // Deploy PokemonCard contract
  const PokemonCard = await ethers.getContractFactory("contracts/PokemonCard.sol:PokemonCard");
  const pokemonCard = await PokemonCard.deploy();
  await pokemonCard.waitForDeployment();
  console.log("PokemonCard deployed to:", await pokemonCard.getAddress());

  // Deploy PokemonTrade contract with PokemonCard address
  const PokemonTrade = await ethers.getContractFactory("contracts/PokemonTrade.sol:PokemonTrade");
  const pokemonTrade = await PokemonTrade.deploy(await pokemonCard.getAddress());
  await pokemonTrade.waitForDeployment();
  console.log("PokemonTrade deployed to:", await pokemonTrade.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 