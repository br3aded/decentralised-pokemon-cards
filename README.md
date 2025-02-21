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

If there are issues with incorrect blocks. Reset the metamask wallet by removing NFTs and resetting the wallet in setting.

Additionally , restarting the node , contract deployment and local host can fix issues. Closing the browser has also shown to fix some issues. 


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
- **buyCard**: Function to buy a listed card. Transfers NFT to new owner and funds to seller.
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

#### PokemonInterface.css
Contains styling for the frontend interface

### Using the Frontend

#### Connecting Account
When navigating to the frontend for the first time the user will be presented with a page allowing them to link there metamask wallet to this webite. Clicking the "Connect Wallet" Button will prompt a metamask login. Once connected the pokemon trading card interface for the connect wallet with display. At the top of the page we display the connect wallet address and wether they are the owner of the PokemonCard contract. This will always be account 0 from the hardhat node. The button "Check Ownership" will check if the owner account is the connect account.

#### Mint New Cards
Only the owner of the PokemonCard Contract can mint new cards. This helps to control the flow of NFTs created. The owner account will be presented with a minting card form with the options to select Pokemon Name , Primary Type, Secondary Type, Attack Points and Defense Points. Pokemon Name is a drop down box containing 900+ pokemon sourced within the pokemon_data.json. The user can select any of these and the other attributes will be automatically changed to match the selected Pokemon. A preview image of the pokemon will also be displayed. The user can change the attributes for a selected Pokemon allwoing for customisation and a large combinations of unqiue NFTs e.g. we can make a charizard that is ice , fighting type with 150 attack and 20 defense. Once the attributes have been filled out clicking the "Mint Pokemon Card" Button will use the mintCard contract to produce a new NFT with connect wallet as the owner. The NFT will also appear in the Metamask wallet.

#### Your Pokemon Cards
The you Pokemon Cards section displays all the cards that the connect wallet is listed as the owner of. This will display the Pokemon image , its assocaited attributes. Each card has two buttons "Sell Card" and "Create Auction". The first will allow the users to list a Pokemon Card at a fixed sale price. This is done through popup allowing them to enter the price in ETH and confirm they want to sell it this then runs the listCard contract. The second allows the user to create an auction. For this they can enter a minimum price and a time for which they want the auction to end. Once this is confirmed the createAuction contract is run. The Pokemon card will be removed from Your Cards as part of this contract we transfer the NFT to the smart contract to prevent the user from declining auctions with prices they don't want. Once a card has been listed it will display text saying "Listed for Sale" and the buttons will be removed.

#### Active Sales
The active sales container has two sections; "Your Sales" and "All Sales". The first section contains only the sales listed by the connected wallet. This displays the attributes of the card and a the button "Remove from Sale" which when clicked will run the cancelSale contract removing the listing. The All Sales section contains sales that the connect account has not listed. We filter out the owners listing to ensure they are not present in this section. This allows users to view all the listed cards their attributes,price and the sellers address are display. Each card in this section also has a button "Buy Card" this will run the buyCard contract which will transfer the NFT to the buyer and the funds to the seller. Once this is carried out sales will be removed from "Active Sales" and the sold card will appear in the new owners "Your Pokemon Cards"

#### Active Auctions
The active auctions container has three sections; "Your Auctions" , "Your Bids" and "All Auctions". The first section contains only the auction listed by the connect wallet. This displays the Pokemon Image , attributes , the starting price and the current highest bid allowing them to check the progress of the auction and the time the auction is set to end. The "All Auctions" section is where all the auctions were auctions not listed by the wallet are first displayed. This again displays all the attribute and auction stats. The user can bid on the auction using the "Make Bid" button. This presents a pop up allowing the user to bid only above the current highest bid and runs the placeBid contract when confirmed. Once the user has bid on an auction it will then be displayed in the "Your Bids" Section allowing them to keep track of there active bids better. If they are the highest bidder it will display text "You are the highest bidder!" or if they have been outbid then can then use the "Make Bid" button again. When a user makes a bid the funds are transferred out of there account to the contract but if they are outbid this is refunded back to them by the placeBid contract and replaced by the new highest bidders funds. To end auctions the frontend checks on the minute every minute to see if any auctions have ended. This will then run the endAuction Contract for the account that listed the auction. If they decline this they lose there NFT as it has been transferred to the contract. This aims to deter against users declining the final price for an auction. Once the auction has ended the NFT will be transferred to the buyer and funds to the seller with the auction no longer displayed in the "Active Auctions" container.

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

Additional attributed could be added to the Pokemon Cards e.g. HP , Attacks , Is it a shiny? allowing for more variety within the NFTs

Unqiue card art could be added using AI generation e.g. water type Charizard. This would motivate users to collect many types of the same card.

Extra functions for Auctions were developed in the trade contract, canceling auctions and bids, but not implemented in the frontend. These could be added in the future.

Funcationality for allowing not owner users to mint there own cards through a curreny system.

## License

This project is licensed under the MIT License.

