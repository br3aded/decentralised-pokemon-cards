# Sample Hardhat Project

This project is a decentralized application (dApp) that enables users to mint, trade, and auction Pokemon cards as NFTs (Non-Fungible Tokens) on the Ethereum blockchain. The application is built using React, Ethers.js, and Hardhat.


## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Smart Contract Deployment](#contract-deployment)
- [Application Structure](#application-structure)
- [Usage](#usage)
- [Technical Documentation](#technical-documentation)
- [Contribution to the Project](#contribution-to-the-project)
- [Contributing](#contributing)
- [Future Improvements](#future-improvements)
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

git clone https://github.com/br3aded/decentralised-pokemon-cards.git
cd decentralised-pokemon-cards


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

### Smart Contract Deployment

To deploy the smart contracts locally:
`npx hardhat node`
`npx hardhat run scripts/deploy.js --network localhost`

Connect MetaMask to Local Hardhat Network:

-Open MetaMask and go to Settings > Networks.

-Click Add Network and enter the following details:

-Network Name: Hardhat Local

-New RPC URL: http://127.0.0.1:8545/

-Chain ID: 31337

-Currency Symbol: ETH

-Import the private key from Account 0 of the Hardhat node console.




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
- **transferFrom**: Transfers ownership of a token from one address to another.
- **approve**: Approves another address to transfer a specific token on behalf of the owner.
- **setApprovalForAll**: Approves or revokes approval for an operator to manage all tokens of an owner.
- **isApprovedForAll**: Checks if an operator is approved to manage all tokens of an owner.
- **tokenURI**: Retrieves metadata URI for a given token ID.

#### PokemonTrade.sol

- **listCard**: Function to list a card for sale.
- **getSale**: Function to retrieve sale details for a specific token.
- **createAuction**: Function to create an auction for a card.
- **placeBid**: Places a bid on an active auction.
- **endAuction**: Ends an auction and transfers the NFT to the highest bidder.
- **cancelSale**: Cancels a listed sale and returns the card to the owner.
- **withdrawFunds**: Allows the seller to withdraw funds from a completed sale.
- **getAuctionDetails**: Retrieves details of an ongoing auction.

### Frontend Components

#### PokemonInterface.jsx

- **State Management**: Uses React hooks to manage state for account, cards, sales, and auctions.
- **Ethers.js Integration**: Interacts with smart contracts using Ethers.js.
- **Image display**: Fetches image metadata from URI for each Pokemon card.

## Contribution to the Project

This project was developed as a collaborative effort between Kelsey and Ramón, ensuring equitable distribution of work while fostering teamwork and technical understanding.

Ramón was responsible for writing the smart contracts in Solidity and implementing unit tests to ensure their security and functionality. He also set up and configured Hardhat for testing. Moreover, Ramón wrote the documentation.

Kelsey handled the frontend development using React, integrating Ethers.js for blockchain interactions and connecting the UI to the deployed smart contracts. He focused on creating an intuitive user experience and designing the application layout.

We both worked on the Hardhat contract deployment file.

Towards the final stages of development, we both collaborated to refine and optimize the codebase. We worked together to debug issues, improve contract logic, and enhance frontend performance to ensure a seamless user experience.

Regarding the video recording, we recorded a demo on Kelsey's computer and then each added our voice over the video.

Both team members demonstrated a comprehensive understanding of all components, ensuring that knowledge was shared equally. This balanced approach allowed for effective troubleshooting and robust project development.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## Future improvements

We originally developed the ability to store metadata using IPFS (Pinata) but ran out of time displaying it correclty in the front-end. This would be our main future improvement.

## License

This project is licensed under the MIT License.

