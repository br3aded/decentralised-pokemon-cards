# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
```

make sure node.js is installed

ensure hardhat is installed locally in the project directory with `npm install --save-dev hardhat`

To run project

`npx hardhat node`

`npx hardhat run scripts/deploy.js --network localhost`

`npm run dev`


for metamask wallet connect to local hardhat network using

     Network Name: Hardhat Local
     
     New RPC URL: http://127.0.0.1:8545/
     
     Chain ID: 31337
     
     Currency Symbol: ETH

to ensure you are on the owner address import the private key into metamask from the node console account 0 with the private key given

# Pokemon Card NFT Trading

This project is a decentralized application (dApp) that allows users to mint, trade, and auction Pokemon cards as NFTs (Non-Fungible Tokens) on the Ethereum blockchain. The application is built using React, Ethers.js, and Hardhat.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Contract Deployment](#contract-deployment)
- [Application Structure](#application-structure)
- [Usage](#usage)
- [Technical Documentation](#technical-documentation)
- [Contributing](#contributing)
- [License](#license)

## Features

- Mint new Pokemon cards as NFTs.
- View owned Pokemon cards.
- List cards for sale and manage sales.
- Create and participate in auctions for Pokemon cards.
- Connect to MetaMask for wallet integration.
- Responsive design for a seamless user experience.

## Technologies Used

- **React**: Frontend library for building user interfaces.
- **Ethers.js**: Library for interacting with the Ethereum blockchain.
- **Hardhat**: Development environment for Ethereum software.
- **IPFS**: InterPlanetary File System for storing NFT metadata and images.
- **Solidity**: Programming language for writing smart contracts.

## Setup Instructions

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or later)
- npm (Node Package Manager)
- MetaMask browser extension

### Clone the Repository


### Install Dependencies

Navigate to the project directory and install the required dependencies:

### Set Up Hardhat

1. Navigate to the `hardhat` directory:

   ```bash
   cd hardhat
   ```

2. Install Hardhat dependencies:

   ```bash
   npm install
   ```

3. Compile the smart contracts:

   ```bash
   npx hardhat compile
   ```

### Deploy Contracts

`npx hardhat run scripts/deploy.js --network localhost`


### Start the Application

`npm run dev`

Open your browser and navigate to `http://localhost:5173`.



## Usage

1. **Connect Wallet**: Click the "Connect Wallet" button to connect your MetaMask wallet.
2. **Mint New Card**: Fill out the form to mint a new Pokemon card.
3. **View Cards**: Your minted cards will be displayed in the "Your Pokemon Cards" section.
4. **List for Sale**: Click "Sell Card" to list your card for sale.
5. **Create Auction**: Click "Create Auction" to auction your card.
6. **Participate in Auctions**: View active auctions and place bids on cards.

## Technical Documentation

### Smart Contracts

#### PokemonCard.sol

- **mintCard**: Function to mint a new Pokemon card.
- **getPokemonAttributes**: Function to retrieve attributes of a Pokemon card.
- **ownerOf**: Function to get the owner of a specific token.

#### PokemonTrade.sol

- **listCard**: Function to list a card for sale.
- **getSale**: Function to retrieve sale details for a specific token.
- **createAuction**: Function to create an auction for a card.

### Frontend Components

#### PokemonInterface.jsx

- **State Management**: Uses React hooks to manage state for account, cards, sales, and auctions.
- **Ethers.js Integration**: Interacts with smart contracts using Ethers.js.
- **IPFS Integration**: Fetches metadata from IPFS for each Pokemon card.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.