const fs = require('fs');
const path = require('path');

try {
    // Create artifacts directory if it doesn't exist
    const artifactsDir = path.join(__dirname, '../src/artifacts/contracts/PokemonCard.sol');
    fs.mkdirSync(artifactsDir, { recursive: true });

    // Check if source file exists
    const sourcePath = path.join(__dirname, '../artifacts/contracts/PokemonCard.sol/PokemonCard.json');
    if (!fs.existsSync(sourcePath)) {
        console.error('Source artifact not found. Please run "npx hardhat compile" first');
        process.exit(1);
    }

    // Copy the PokemonCard artifact
    const destPath = path.join(artifactsDir, 'PokemonCard.json');
    fs.copyFileSync(sourcePath, destPath);
    console.log('Artifacts copied successfully');
    console.log('From:', sourcePath);
    console.log('To:', destPath);
} catch (error) {
    console.error('Error copying artifacts:', error);
    process.exit(1);
} 