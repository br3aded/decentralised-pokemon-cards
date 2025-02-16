//imports
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './PokemonInterface.css';

// define ABI used to interact with smart contracts for PokemonCard.sol 
const PokemonCardABI = [
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "tokenOfOwnerByIndex",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "getPokemonAttributes",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "primaryType",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "secondaryType",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "attack",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "defense",
            "type": "uint256"
          }
        ],
        "internalType": "struct PokemonCard.PokemonAttributes",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_primaryType",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_secondaryType",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "attack",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "defense",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "tokenURI",
        "type": "string"
      }
    ],
    "name": "mintCard",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "ownerOf",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getNextTokenId",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
        {
            "internalType": "address",
            "name": "to",
            "type": "address"
        },
        {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
        }
    ],
    "name": "approve",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "tokenURI",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// define ABI used to interact with smart contracts for PokemonTrade.sol
const PokemonTradeABI = [
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            }
        ],
        "name": "listCard",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "getSale",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "price",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "seller",
                        "type": "address"
                    }
                ],
                "internalType": "struct PokemonTrade.Sale",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "removeCardFromSale",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "minimumPriceInEth",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "endTime",
              "type": "uint256"
          }
      ],
      "name": "createAuction",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
        "inputs": [],
        "name": "getNextTokenId",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "getAuction",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "startingPrice",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "highestBid",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "highestBidder",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "seller",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "endTime",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "active",
                        "type": "bool"
                    },
                    {
                        "components": [
                            {
                                "internalType": "address",
                                "name": "bidder",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "amount",
                                "type": "uint256"
                            }
                        ],
                        "internalType": "struct PokemonTrade.Bid[]",
                        "name": "bids",
                        "type": "tuple[]"
                    }
                ],
                "internalType": "struct PokemonTrade.Auction",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getTotalAuctionTokens",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "tokenId", 
              "type": "uint256"
          }
      ],
      "name": "buyCard",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
          }
      ],
      "name": "endAuction",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
          {
              "internalType": "address",
              "name": "to",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
          }
      ],
      "name": "approve",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "winner",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "AuctionEnded",
        "type": "event"
    },
    {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
          }
      ],
      "name": "placeBid",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
  }
    // Add other functions as needed
];

// PokemonInterface component
function PokemonInterface() {
  //define state variables
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [cards, setCards] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [ownerAddress, setOwnerAddress] = useState('');
  const [newCardName, setNewCardName] = useState('');
  const [newCardPrimaryType, setNewCardPrimaryType] = useState('fire');
  const [newCardSecondaryType, setNewCardSecondaryType] = useState('none');
  const [newCardAttack, setNewCardAttack] = useState(50);
  const [newCardDefense, setNewCardDefense] = useState(50);
  const [newCardImageURI, setNewCardImageURI] = useState('');
  const [showSellPopup, setShowSellPopup] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [price, setPrice] = useState('');
  const [tradeContract, setTradeContract] = useState(null);
  const [yourSales, setYourSales] = useState([]);
  const [allSales, setAllSales] = useState([]);
  const [activeAuctions, setActiveAuctions] = useState([]);
  const [showAuctionPopup, setShowAuctionPopup] = useState(false);
  const [auctionMinimumPrice, setAuctionMinimumPrice] = useState('');
  const [auctionDuration, setAuctionDuration] = useState('');
  const [yourAuctions, setYourAuctions] = useState([]);
  const [auctionEndTime, setAuctionEndTime] = useState('');
  const [showBidPopup, setShowBidPopup] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [yourBids, setYourBids] = useState([]);

  //used when loading page to check connection
  useEffect(() => {
    // Check if already connected
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            setAccount(accounts[0].address);
            const signer = await provider.getSigner();
            
            // Initialize PokemonCard contract
            const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Your PokemonCard address
            const pokemonContract = new ethers.Contract(
                contractAddress,
                PokemonCardABI,
                signer
            );
            setContract(pokemonContract);

            // Initialize PokemonTrade contract
            const tradeContractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // Your PokemonTrade address
            const pokemonTradeContract = new ethers.Contract(
                tradeContractAddress,
                PokemonTradeABI,
                signer
            );
            setTradeContract(pokemonTradeContract); // Set the trade contract
            console.log("Trade contract initialized:", pokemonTradeContract);
          }
        } catch (error) {
          console.error("Error checking connection:", error);
        }
      }
    };

    checkConnection();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0].address);
        } else {
          setAccount('');
          setContract(null);
        }
      });

      // Listen for chain changes
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    // Cleanup listeners
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, []);

  // Update connectWallet function
  async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // First check if we're connected to the right network
        const provider = new ethers.BrowserProvider(window.ethereum);
        
        // Wait for the network to be ready and get the latest block
        const network = await provider.getNetwork();
        const block = await provider.getBlock('latest');
        console.log("Current network:", network);
        console.log("Latest block:", block?.number);

        // Request account access
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        
        const signer = await provider.getSigner();
        setAccount(accounts[0]);

        // Initialize PokemonCard contract
        const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Your PokemonCard address
        const pokemonContract = new ethers.Contract(
            contractAddress,
            PokemonCardABI,
            signer
        );
        setContract(pokemonContract);

        // Initialize PokemonTrade contract
        const tradeContractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // Your PokemonTrade address
        const pokemonTradeContract = new ethers.Contract(
            tradeContractAddress,
            PokemonTradeABI,
            signer
        );
        setTradeContract(pokemonTradeContract); // Set the trade contract
        console.log("Trade contract initialized:", pokemonTradeContract);

        // Test contract connection
        console.log("Testing contract connection...");
        await provider.ready;
        
        const ownerAddress = await pokemonContract.owner();
        console.log("Successfully connected to contract!");
        console.log("Contract owner address:", ownerAddress);
        setOwnerAddress(ownerAddress);
        setContract(pokemonContract);
        
        // Check if connected account is owner
        const isOwnerCheck = ownerAddress.toLowerCase() === accounts[0].toLowerCase();
        setIsOwner(isOwnerCheck);
        console.log("Is connected account owner?", isOwnerCheck);
      } catch (error) {
        console.error("Error connecting wallet:", error);
        alert("Error connecting wallet. Please check console for details.");
      }
    } else {
      alert("Please install MetaMask!");
    }
  }

  //Function to check is connected wallet is owner of PokemonCard contract
  async function checkOwnership() {
    if (!contract) {
      console.log("No contract instance available");
      return false;
    }
    try {
      console.log("=== CHECKING OWNERSHIP ===");
      console.log("Current account:", account);
      
      const owner = await contract.owner();
      console.log("Contract owner:", owner);
      
      // Convert both addresses to lowercase for comparison
      const isOwnerCheck = owner.toLowerCase() === account.toLowerCase();
      console.log("Is owner?", isOwnerCheck);
      
      setIsOwner(isOwnerCheck);
      setOwnerAddress(owner);
      
      return isOwnerCheck;
    } catch (error) {
      console.error("Error checking ownership:", error);
      console.error("Error details:", {
        message: error.message,
        code: error.code,
        data: error.data
      });
      setIsOwner(false);
      return false;
    }
  }

  //function used to load cards for conneted account
  const loadCards = async () => {
    if (!contract) {
        console.error("Contract is not initialized.");
        return;
    }

    try {
        const cardsTemp = [];
        const totalCards = await contract.getNextTokenId(); 

        for (let tokenId = 0; tokenId < totalCards; tokenId++) {
            try {
                const owner = await contract.ownerOf(tokenId); // Get the owner of the card
                if (owner.toLowerCase() === account.toLowerCase()) { // Check if the owner matches the current account
                    const attributes = await contract.getPokemonAttributes(tokenId);//get all attributes
                    const tokenURI = await contract.tokenURI(tokenId); // Fetch the token URI
                    const response = await axios.get(tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")); // Fetch metadata from IPFS
                    console.log("Metadata response:", response.data); // Log the response
                    const metadata = response.data; // Get the metadata
                    const isOnSale = await tradeContract.getSale(tokenId); // Check if the card is on sale

                    cardsTemp.push({
                      tokenId,
                      name: metadata.name,
                      primaryType: metadata.attributes[0].value, // Assuming primary type is the first attribute
                      secondaryType: metadata.attributes[1].value, // Assuming secondary type is the second attribute
                      attack: metadata.attributes[2].value, // Assuming attack is the third attribute
                      defense: metadata.attributes[3].value, // Assuming defense is the fourth attribute
                      owner,
                      onSale: isOnSale.price > 0, // Check if the price is greater than 0
                      imageUrl: metadata.image // Add the image URL to the card data
                    });
                }
            } catch (error) {
                console.error("Error fetching card attributes or ownership:", error);
            }
        }

        setCards(cardsTemp); // Update state with fetched cards
    } catch (error) {
        console.error("Error loading cards:", error);
    }
  };

  // Add this function to handle form submission for minting new card
  const handleMintSubmit = async (e) => {
    e.preventDefault();
    if (!contract || !account) return;

    try {
      console.log("=== MINTING PROCESS ===");
      console.log("Minting new card with values:", {
        name: newCardName,
        primaryType: newCardPrimaryType,
        secondaryType: newCardSecondaryType,
        attack: newCardAttack,
        defense: newCardDefense,
        imageURI: newCardImageURI
      });

      //use mintCard contract with variables from form to create a new nft
      const tx = await contract.mintCard(
        account,
        newCardName,
        newCardPrimaryType,
        newCardSecondaryType,
        newCardAttack,
        newCardDefense,
        newCardImageURI
      );

      console.log("Mint transaction:", tx);
      const receipt = await tx.wait();
      console.log("Mint receipt:", receipt);
      console.log("Card minted successfully!");
      
      // Load the cards immediately after minting
      console.log("=== LOADING CARDS AFTER MINT ===");
      await loadCards();
      
      // Reset form
      setNewCardName('');
      setNewCardPrimaryType('fire');
      setNewCardSecondaryType('none');
      setNewCardAttack(50);
      setNewCardDefense(50);
      setNewCardImageURI('');
      
    } catch (error) {
      console.error("Error minting card:", error);
    }
  };

  //function to handle name input validation
  const handleNameChange = (e) => {
    // Only allow letters and spaces
    const value = e.target.value;
    if (value === '' || /^[A-Za-z\s]+$/.test(value)) {
      setNewCardName(value);
    }
  };

  //javascript to create mint form
  const mintForm = (
    <form onSubmit={handleMintSubmit} className="mint-form">
      {/* Component for handling pokemon name */}
      <div className="form-group">
        <label htmlFor="cardName">Pokemon Name:</label>
        <input
          type="text"
          id="cardName"
          value={newCardName}
          onChange={handleNameChange}
          required
          placeholder="Enter Pokemon name"
          pattern="[A-Za-z\s]+"
          title="Only letters and spaces allowed"
          maxLength="20"
        />
      </div>
      
      {/* Component for handling primary pokemon type */}
      <div className="form-group">
        <label htmlFor="cardPrimaryType">Primary Type:</label>
        <select
          id="cardPrimaryType"
          value={newCardPrimaryType}
          onChange={(e) => setNewCardPrimaryType(e.target.value)}
        >
          <option value="Fire">Fire</option>
          <option value="Water">Water</option>
          <option value="Grass">Grass</option>
          <option value="Electric">Electric</option>
          <option value="Ice">Ice</option>
          <option value="Fighting">Fighting</option>
          <option value="Poison">Poison</option>
          <option value="Ground">Ground</option>
          <option value="Flying">Flying</option>
          <option value="Psychic">Psychic</option>
          <option value="Bug">Bug</option>
          <option value="Rock">Rock</option>
          <option value="Ghost">Ghost</option>
          <option value="Dragon">Dragon</option>
          <option value="Dark">Dark</option>
          <option value="Steel">Steel</option>
          <option value="Fairy">Fairy</option>
        </select>
      </div>

      {/* Component for handling secondary pokemon type */}
      <div className="form-group">
        <label htmlFor="cardSecondaryType">Secondary Type:</label>
        <select
          id="cardSecondaryType"
          value={newCardSecondaryType}
          onChange={(e) => setNewCardSecondaryType(e.target.value)}
        >
          <option value="none">None</option>
          <option value="Fire">Fire</option>
          <option value="Water">Water</option>
          <option value="Grass">Grass</option>
          <option value="Electric">Electric</option>
          <option value="Ice">Ice</option>
          <option value="Fighting">Fighting</option>
          <option value="Poison">Poison</option>
          <option value="Ground">Ground</option>
          <option value="Flying">Flying</option>
          <option value="Psychic">Psychic</option>
          <option value="Bug">Bug</option>
          <option value="Rock">Rock</option>
          <option value="Ghost">Ghost</option>
          <option value="Dragon">Dragon</option>
          <option value="Dark">Dark</option>
          <option value="Steel">Steel</option>
          <option value="Fairy">Fairy</option>
        </select>
      </div>

      {/* New Component for handling image URI */}
      <div className="form-group">
        <label htmlFor="cardImageURI">Image URI:</label>
        <input
          type="text"
          id="cardImageURI"
          value={newCardImageURI}
          onChange={(e) => setNewCardImageURI(e.target.value)}
          required
          placeholder="Enter image URI"
        />
      </div>

      {/* Component for handling pokemon attack stat between 0 - 150 */}
      <div className="form-group">
        <label htmlFor="cardAttack">Attack Points:</label>
        <div className="number-input">
          <button type="button" onClick={() => setNewCardAttack(Math.max(0, newCardAttack - 10))}>-10</button>
          <input
            type="number"
            id="cardAttack"
            value={newCardAttack}
            onChange={(e) => setNewCardAttack(Number(e.target.value))}
            min="0"
            max="150"
            step="10"
          />
          <button type="button" onClick={() => setNewCardAttack(Math.min(150, newCardAttack + 10))}>+10</button>
        </div>
      </div>

      {/* Component for handling pokemon defence stat between 0 - 150 */}
      <div className="form-group">
        <label htmlFor="cardDefense">Defense Points:</label>
        <div className="number-input">
          <button type="button" onClick={() => setNewCardDefense(Math.max(0, newCardDefense - 10))}>-10</button>
          <input
            type="number"
            id="cardDefense"
            value={newCardDefense}
            onChange={(e) => setNewCardDefense(Number(e.target.value))}
            min="0"
            max="150"
            step="10"
          />
          <button type="button" onClick={() => setNewCardDefense(Math.min(150, newCardDefense + 10))}>+10</button>
        </div>
      </div>

      <button type="submit" className="mint-button">Mint Pokemon Card</button>
    </form>
  );

  // Adds some CSS for styling
  const styles = `
    .mint-form {
      max-width: 400px;
      margin: 20px auto;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 8px;
    }

    .form-group {
      margin-bottom: 15px;
    }

    .form-group label {
      display: block;
      margin-bottom: 5px;
    }

    .form-group input,
    .form-group select {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .number-input {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .number-input button {
      padding: 5px 10px;
      background: #f0f0f0;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
    }

    .number-input input {
      width: 80px;
      text-align: center;
    }

    .mint-button {
      width: 100%;
      padding: 10px;
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .mint-button:hover {
      background: #45a049;
    }

    .active-sales-container {
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 15px;
      margin: 20px 0;
      background-color: #f9f9f9;
    }

    .active-sales-grid {
      /* Additional styles for the grid can be added here */
    }

    .your-sales-container,
    .all-sales-container {
        border: 1px solid #ddd; /* Border color */
        border-radius: 8px; /* Rounded corners */
        padding: 10px; /* Padding inside the box */
        margin: 10px 0; /* Margin above and below the box */
        background-color: #f9f9f9; /* Light background color */
    }

    .your-sales-grid,
    .all-sales-grid {
        /* Additional styles for the grid can be added here */
    }

    .your-auctions-container,
    .all-auctions-container {
        border: 1px solid #ddd; /* Border color */
        border-radius: 8px; /* Rounded corners */
        padding: 10px; /* Padding inside the box */
        margin: 10px 0; /* Margin above and below the box */
        background-color: #f9f9f9; /* Light background color */
    }

    .your-auctions-grid,
    .all-auctions-grid {
        /* Additional styles for the grid can be added here */
    }

    .refresh-button {
        padding: 10px; /* Padding for the button */
        background-color: #FF0000 !important; /* Pokemon Red */
        color: white; /* Button text color */
        border: none; /* No border */
        border-radius: 4px; /* Rounded corners */
        cursor: pointer; /* Pointer cursor on hover */
        transition: background-color 0.2s; /* Smooth transition for hover effect */
    }

    .refresh-button:hover {
        background-color: #CC0000 !important; /* Darker Pokemon Red */
    }

    .header-container {
        display: flex; /* Use flexbox for alignment */
        justify-content: space-between; /* Space between heading and button */
        align-items: center; /* Center items vertically */
        margin-bottom: 10px; /* Space below the header */
    }

    .card-buttons {
        display: flex; /* Use flexbox for button alignment */
        gap: 5px; /* Space between buttons */
        margin-top: 10px; /* Space above the buttons */
        flex-wrap: wrap; /* Allow buttons to wrap if necessary */
    }

    .action-button {
        padding: 5px 10px; /* Padding for the button */
        background-color: #FF0000 !important; /* Pokemon Red */
        color: white; /* Button text color */
        border: none; /* No border */
        border-radius: 4px; /* Rounded corners */
        cursor: pointer; /* Pointer cursor on hover */
        flex: 1; /* Allow buttons to grow equally */
        min-width: 80px; /* Minimum width for buttons */
        max-width: 100px; /* Maximum width for buttons */
    }

    .action-button:hover {
        background-color: #CC0000 !important; /* Darker Pokemon Red */
    }

    .card {
        display: flex; /* Use flexbox for card layout */
        flex-direction: column; /* Stack elements vertically */
        padding: 10px; /* Padding inside the card */
        border: 1px solid #ddd; /* Border for the card */
        border-radius: 8px; /* Rounded corners */
        margin: 10px; /* Margin around the card */
        max-width: 200px; /* Set a maximum width for the card */
    }

    .popup {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .popup-content {
      background-color: white;
      padding: 20px;
      border-radius: 8px;
      max-width: 400px;
      width: 100%;
    }

    .popup-buttons {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
    }

    .listed-for-sale {
        color: red; /* Set text color to red */
        border: 1px solid red; /* Set border color to red */
        padding: 5px; /* Add some padding */
        border-radius: 4px; /* Optional: round the corners */
        display: inline-block; /* Make the box fit the text */
        margin-top: 5px; /* Optional: add some space above */
    }

    .your-bids-container {
        border: 1px solid #ddd; /* Light gray border */
        border-radius: 8px; /* Rounded corners */
        padding: 20px; /* Inner padding */
        margin: 20px 0; /* Space above and below */
        background-color: #f9f9f9; /* Light background color */
    }

    .listed-for-sale, .listed-for-auction {
        color: red;
        border: 1px solid red;
        padding: 5px;
        border-radius: 4px;
        display: inline-block;
        margin-top: 5px;
        text-align: center;
        width: 100%;
        box-sizing: border-box;
    }

    .active-auctions-container {
        border: 1px solid #ddd; /* Light gray border */
        border-radius: 8px; /* Rounded corners */
        padding: 20px; /* Inner padding */
        margin: 10px 0; /* Margin above and below */
        background-color: #f9f9f9; /* Light background color */
    }

    .active-auctions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 20px;
        padding: 10px;
    }

    .your-bids-container {
        border: 1px solid #ddd; /* Light gray border */
        border-radius: 8px; /* Rounded corners */
        padding: 20px; /* Inner padding */
        margin: 10px 0; /* Margin above and below */
        background-color: #f9f9f9; /* Light background color */
    }

    .your-bids-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 20px;
        padding: 10px;
    }

    .popup-content input[type="datetime-local"] {
        width: 100%;
        padding: 8px;
        margin-top: 5px;
        margin-bottom: 15px;
        border: 1px solid #ddd;
        border-radius: 4px;
        box-sizing: border-box;
    }

    .popup-content label {
        display: block;
        margin-bottom: 15px;
    }
  `;

  useEffect(() => {
    if (account) {
      loadCards();
    }
  }, [account]);

  //useEffect to log state changes for debug
  useEffect(() => {
    console.log("Account:", account);
    console.log("Contract instance:", contract ? "Yes" : "No");
    console.log("Trade Contract instance:", tradeContract ? "Yes" : "No");
  }, [account, contract, tradeContract]);

  //function to get the owner address
  async function getOwnerAddress() {
    if (!contract) return;
    try {
      const owner = await contract.owner();
      setOwnerAddress(owner);
      console.log('Owner address:', owner);
    } catch (error) {
      console.error("Error getting owner address:", error);
    }
  }

  //useEffect to get the owner address when contract is initialized
  useEffect(() => {
    if (contract) {
      getOwnerAddress();
    }
  }, [contract]);

  //useEffect that checks ownership on contract initialization
  useEffect(() => {
    if (contract && account) {
      checkOwnership();
    }
  }, [contract, account]);

  //function to handle selling a card popup
  const handleSellCard = (card) => {
    setSelectedCard(card);
    setShowSellPopup(true);
  };

  //function to handle selling a card popup
  const handleClosePopup = () => {
    setShowSellPopup(false);
    setSelectedCard(null);
    setPrice('');
  };

  //function used to handle listing set price sales
  const handleListCard = async () => {
    // Validate the price input
    if (parseFloat(price) <= 0) {
        alert("Please enter a valid price greater than 0 ETH.");
        return; // Exit the function if the price is invalid
    }

    if (!tradeContract) {
        alert("Trade contract is not initialized. Please connect your wallet.");
        return; // Exit if the contract is not initialized
    }

    try {

        // Check if the user is the owner of the card using the PokemonCard contract
        const owner = await contract.ownerOf(selectedCard.tokenId);
        console.log("Card Owner:", owner);
        console.log("Current User:", account);

        if (owner.toLowerCase() !== account.toLowerCase()) {
            alert("You do not own this card.");
            return; // Exit if the user does not own the card
        }

        // Log the details of the sale before listing
        console.log(`Attempting to list card with Token ID: ${selectedCard.tokenId} for ${price} ETH`);

        // Call the listCard function from the trade contract
        const tx = await tradeContract.listCard(selectedCard.tokenId, price);
        const receipt = await tx.wait(); // Wait for the transaction to be mined

        // Log success message after the transaction is confirmed
        console.log(`Successfully listed ${selectedCard?.name} (Token ID: ${selectedCard.tokenId}) for ${price} ETH`);

        // Update the card state to reflect that it is on sale
        setCards(prevCards => 
            prevCards.map(card => 
                card.tokenId === selectedCard.tokenId ? { ...card, onSale: true } : card
            )
        );

        handleClosePopup(); // Close the popup after listing
    } catch (error) {
        console.error("Error listing card:", error);
        alert("Failed to list the card. Please check the console for details.");
    }
  };

  //function used to load the active card sales in the all sales component
  const loadActiveSales = async () => {
    if (!tradeContract) {
        console.error("Trade contract is not initialized.");
        return;
    }

    try {
        // Initialize temporary arrays to store sales for different components
        // Your sales will be displayed in the "Your Sales" component and are started by the connected wallet
        const yourSalesTemp = [];
        // All active sales will be displayed in the "All Active Sales" component and include all sales on the marketplace that arent in "Your Sales"
        const allSalesTemp = [];
        const activeSalesCount = await contract.getNextTokenId(); // Get the next token ID

        for (let tokenId = 0; tokenId < activeSalesCount; tokenId++) {
            try {
                const sale = await tradeContract.getSale(tokenId);
                if (sale.price > 0) { // Check if the card is listed for sale
                    // Fetch attributes for the tokenId
                    const attributes = await contract.getPokemonAttributes(tokenId);
                    
                    // Check if the current user is the seller
                    if (sale.seller.toLowerCase() === account.toLowerCase()) {
                        yourSalesTemp.push({
                            tokenId,
                            price: sale.price,
                            seller: sale.seller,
                            name: attributes.name,
                            primaryType: attributes.primaryType,
                            secondaryType: attributes.secondaryType,
                            attack: attributes.attack,
                            defense: attributes.defense,
                        });
                    } else {
                        allSalesTemp.push({
                            tokenId,
                            price: sale.price,
                            seller: sale.seller,
                            name: attributes.name,
                            primaryType: attributes.primaryType,
                            secondaryType: attributes.secondaryType,
                            attack: attributes.attack,
                            defense: attributes.defense,
                        });
                    }
                }
            } catch (error) {
                // Ignore errors for token IDs that do not exist
            }
        }

        setYourSales(yourSalesTemp); // Update state with user's sales
        setAllSales(allSalesTemp); // Update state with all active sales

        // Log the active sales for verification
        console.log("Your Sales:", yourSalesTemp);
        console.log("All Active Sales:", allSalesTemp);
    } catch (error) {
        console.error("Error loading active sales:", error);
    }
  };

  useEffect(() => {
    loadActiveSales(); // Load active sales when the component mounts
  }, [tradeContract]); // Run when tradeContract is set

  //function to handle removing a card from sale by the seller
  async function handleRemoveFromSale(tokenId) {
    if (!tradeContract) {
        alert("Trade contract is not initialized. Please connect your wallet.");
        return;
    }

    try {
        const tx = await tradeContract.removeCardFromSale(tokenId); //use removeCardFromSale function from trade contract
        await tx.wait(); // Wait for the transaction to be mined
        console.log(`Card with Token ID ${tokenId} removed from sale successfully!`);

        // Optionally, refresh the sales data after removal
        loadActiveSales();
    } catch (error) {
        console.error("Error removing card from sale:", error);
        alert("Failed to remove the card from sale. Please check the console for details.");
    }
  }

  // Function to handle buying a card
  async function handleBuyCard(tokenId) {
    if (!tradeContract) {
        alert("Trade contract is not initialized. Please connect your wallet.");
        return;
    }

    try {
        console.log("Retrieving sale information for token ID:", tokenId);
        const sale = await tradeContract.getSale(tokenId); // Get the sale details
        console.log("Sale details:", sale);
        
        const priceInWei = sale.price; // Get the price in Wei
        console.log(`Attempting to buy card with Token ID: ${tokenId} for ${priceInWei} Wei`);

        //log for debug
        console.log("Transaction details:", {
            tokenId,
            value: priceInWei,
            gasLimit: 1000000
        });

        // Call the buyCard function from the trade contract
        const tx = await tradeContract.buyCard(tokenId, {
            value: priceInWei, // Send the price as value
            gasLimit: 1000000 // Increase gas limit
        });

        await tx.wait(); // Wait for the transaction to be mined
        console.log(`Card with Token ID ${tokenId} purchased successfully!`);

        // Optionally, refresh the sales data after purchase
        loadActiveSales();
    } catch (error) {
        console.error("Error purchasing card:", error);
        alert("Failed to purchase the card. Please check the console for details.");
    }
  }

  // Function to handle creating an auction
  async function handleCreateAuction() {
    if (!selectedCard || !tradeContract) return;

    // Validate inputs
    const minPrice = parseFloat(auctionMinimumPrice);
    if (isNaN(minPrice) || minPrice <= 0) {
        alert("Please enter a valid minimum price greater than 0 ETH.");
        return;
    }

    if (!auctionEndTime) {
        alert("Please select an end time.");
        return;
    }

    // Check if the user is the owner of the card
    try {
        const owner = await contract.ownerOf(selectedCard.tokenId);
        if (owner.toLowerCase() !== account.toLowerCase()) {
            alert("You do not own this card.");
            return;
        }

        // Convert end time to Unix timestamp (seconds)
        const endTimestamp = Math.floor(new Date(auctionEndTime).getTime() / 1000);
        const currentTime = Math.floor(Date.now() / 1000);

        // Check if the end time is in the future
        if (endTimestamp <= currentTime) {
            alert("End time must be in the future.");
            return;
        }

        // First, approve the trade contract to transfer the NFT
        // This is required to transfer the NFT to the auction contract
        console.log("Approving NFT transfer...");
        const approveTx = await contract.approve(tradeContract.target, selectedCard.tokenId);
        await approveTx.wait();
        console.log("NFT transfer approved");

        //console log for debug
        console.log("Creating auction with parameters:", {
            tokenId: selectedCard.tokenId,
            priceInWei: minPrice.toString(),
            endTimestamp,
        });

        // Call the createAuction function from the trade contract
        const tx = await tradeContract.createAuction(
            selectedCard.tokenId,
            minPrice,
            endTimestamp,
            { gasLimit: 500000 }
        );

        // Wait for the transaction to be mined
        await tx.wait();
        console.log(`Auction created for Token ID ${selectedCard.tokenId} with a starting price of ${auctionMinimumPrice} ETH, ending at ${new Date(endTimestamp * 1000).toLocaleString()}`);
        
        loadActiveAuctions();
        setShowAuctionPopup(false);
    } catch (error) {
        console.error("Error creating auction:", error);
        alert("Failed to create auction. Please check the console for details.");
    }
}
  //function to load active auctions for the "All Active Auctions" component
  const loadActiveAuctions = async () => {
    if (!tradeContract) return;

    try {
        //variables to store the auctions split by your auctions and active auctions similar to sales
        const yourAuctionsTemp = [];
        const activeAuctionsTemp = [];
        const totalTokens = await contract.getNextTokenId();

        //functionality for loading all active auctions
        const auctionPromises = [];
        for (let tokenId = 0; tokenId < totalTokens; tokenId++) {
            auctionPromises.push(
                tradeContract.getAuction(tokenId)
                    .then(async (auction) => {
                        // Only process if auction exists, has a seller, and is active
                        if (auction && 
                            auction.seller !== '0x0000000000000000000000000000000000000000' && 
                            auction.active && 
                            Number(auction.endTime) > Math.floor(Date.now() / 1000)) {  // Check if not ended
                            try {
                                const cardAttributes = await contract.getPokemonAttributes(tokenId);
                                const auctionDetails = {
                                    tokenId,
                                    startingPrice: auction.startingPrice,
                                    highestBid: auction.highestBid,
                                    highestBidder: auction.highestBidder,
                                    seller: auction.seller,
                                    endTime: auction.endTime,
                                    active: auction.active,
                                    name: cardAttributes.name,
                                    bids: auction.bids
                                };
                                return { success: true, auction: auctionDetails };
                            } catch (error) {
                                return { success: false };
                            }
                        }
                        return { success: false };
                    })
                    .catch(() => {
                        return { success: false };
                    })
            );
        }

        //filter auctions in your auctions and active auctions
        const results = await Promise.allSettled(auctionPromises);
        results.forEach((result) => {
            if (result.status === 'fulfilled' && result.value.success) {
                const auctionDetails = result.value.auction;
                if (auctionDetails.seller.toLowerCase() === account.toLowerCase()) {
                    yourAuctionsTemp.push(auctionDetails);
                } else if (!auctionDetails.bids.some(bid => 
                    bid.bidder.toLowerCase() === account.toLowerCase()
                )) {
                    activeAuctionsTemp.push(auctionDetails);
                }
            }
        });

        setYourAuctions(yourAuctionsTemp);
        setActiveAuctions(activeAuctionsTemp);

    } catch (error) {
        console.error("Error loading active auctions:", error);
    }
};

  // Call loadActiveAuctions in useEffect
  useEffect(() => {
    loadActiveAuctions(); // Load active auctions when the component mounts
  }, [tradeContract]); // Run when tradeContract is set

  //function to convert from wei to ether
  const formatBigNumber = (value) => {
    if (!value) return "0";
    // Convert BigInt to string, then to number and divide by 1e18
    return (Number(value.toString()) / 1e18).toString();
  };

// function for checking ending auctions
const checkEndingAuctions = async () => {
    if (!tradeContract) return;

    try {
        // Log a message for debugging
        console.log("Checking for ending auctions...");
        const totalTokens = await contract.getNextTokenId();
        const currentTime = Math.floor(Date.now() / 1000);

        // Loop through all tokens to check for ending auctions
        for (let tokenId = 0; tokenId < totalTokens; tokenId++) {
            try {
                const auction = await tradeContract.getAuction(tokenId);
                
                // Check if auction is active and has ended
                if (auction.active && Number(auction.endTime) <= currentTime) {
                    console.log(`Ending auction for token ${tokenId}`);
                    // Call the endAuction function from the trade contract
                    const tx = await tradeContract.endAuction(tokenId);
                    await tx.wait();
                    console.log(`Successfully ended auction for token ${tokenId}`);
                    await loadCards();
                }
            } catch (error) {
                // Skip if no auction exists for this token
                continue;
            }
        }

        // Refresh the auctions display
        await loadActiveAuctions();
        await loadYourBids();

    } catch (error) {
        console.error("Error checking ending auctions:", error);
    }
};

//used to check ending auctions on component mount and every minute
useEffect(() => {
    if (!tradeContract) return;

    // Check immediately on component mount
    checkEndingAuctions();

    // Set up interval for checking (every minute)
    const interval = setInterval(() => {
        checkEndingAuctions();
    }, 60000); // Check every minute

    // Clean up interval on unmount
    return () => clearInterval(interval);
}, [tradeContract]); // Only re-run when tradeContract changes

//function to handle placing bids
const handlePlaceBid = async () => {
    if (!selectedAuction || !tradeContract) return;

    try {
        // Get current auction state to ensure bid is valid
        const currentAuction = await tradeContract.getAuction(selectedAuction.tokenId);
        
        // Convert bid amount to Wei
        const bidAmountWei = BigInt(Math.floor(parseFloat(bidAmount) * 1e18));
        
        // Keep values as BigInt for comparison
        const currentHighestBid = BigInt(currentAuction.highestBid);
        const startingPrice = BigInt(currentAuction.startingPrice);
        
        // Validate bid amount
        if (bidAmountWei <= currentHighestBid) {
            const currentHighestBidEth = Number(currentHighestBid) / 1e18;
            alert(`Bid must be higher than the current highest bid (${currentHighestBidEth} ETH)`);
            return;
        }
        
        // Validate bid amount against starting price
        if (bidAmountWei < startingPrice) {
            const startingPriceEth = Number(startingPrice) / 1e18;
            alert(`Bid must be at least the starting price (${startingPriceEth} ETH)`);
            return;
        }

        // Log the bid details for debugging
        console.log("Placing bid with parameters:", {
            tokenId: selectedAuction.tokenId,
            bidAmount: bidAmountWei.toString(),
            currentHighestBid: currentHighestBid.toString(),
            startingPrice: startingPrice.toString()
        });

        // Call the placeBid function from the trade contract
        const tx = await tradeContract.placeBid(selectedAuction.tokenId, {
            value: bidAmountWei,
            gasLimit: 500000
        });

        await tx.wait();
        await loadActiveAuctions();
        await loadYourBids();
        setShowBidPopup(false);
        setBidAmount('');
        setSelectedAuction(null);
    } catch (error) {
        console.error("Error placing bid:", error);
        alert("Failed to place bid: " + (error.reason || error.message));
    }
};

//function to load your bids, this all auctions that the connect wallet has bid on , they will no longer display in active auctions
const loadYourBids = async () => {
    if (!tradeContract || !account) return;

    try {
        const totalTokens = await contract.getNextTokenId();
        const yourBidsTemp = [];

        for (let tokenId = 0; tokenId < totalTokens; tokenId++) {
            try {
                const auction = await tradeContract.getAuction(tokenId);
                
                // Only process active auctions that haven't ended
                if (auction.active && 
                    Number(auction.endTime) > Math.floor(Date.now() / 1000) &&
                    auction.bids.some(bid => bid.bidder.toLowerCase() === account.toLowerCase())) {
                    const cardAttributes = await contract.getPokemonAttributes(tokenId);
                    //add the auction to the yourBidsTemp array 
                    yourBidsTemp.push({
                        tokenId,
                        startingPrice: auction.startingPrice,
                        highestBid: auction.highestBid,
                        highestBidder: auction.highestBidder,
                        seller: auction.seller,
                        endTime: auction.endTime,
                        active: auction.active,
                        name: cardAttributes.name,
                        yourBid: auction.bids.find(bid => 
                            bid.bidder.toLowerCase() === account.toLowerCase()
                        ).amount
                    });
                }
            } catch (error) {
                // Silently continue if auction doesn't exist
                continue;
            }
        }

        setYourBids(yourBidsTemp);
    } catch (error) {
        console.error("Error loading your bids:", error);
    }
};

//useEffect to load your bids when the tradeContract is set
useEffect(() => {
    if (tradeContract && account) {
        loadYourBids();
    }
}, [tradeContract, account]);

// Add this useEffect to listen for Transfer events
useEffect(() => {
  const listenForTransferEvents = async () => {
    if (tradeContract) {
      tradeContract.on("Transfer", (from, to, tokenId) => {
        console.log(`NFT with Token ID ${tokenId} transferred from ${from} to ${to}`);
        // Call loadCards to refresh the state
        loadCards();
      });
    }
  };

  listenForTransferEvents();

  // Cleanup listener on unmount
  return () => {
    if (tradeContract) {
      tradeContract.off("Transfer");
    }
  };
}, [tradeContract]);

  //front end display
  return (
    // Main container for the application
    <div className="container">
      <h1>Pokemon Card NFT Trading</h1>
      {/* front page when connecting without a connected wallet*/}
      {!account ? (
        <div className="connect-wallet-container">
          <button onClick={connectWallet}>Connect Wallet</button>
          <p>Please connect your wallet to continue</p>
        </div>
      ) : (
        <div>
          <div className="account-info">
            <p>Connected Account: {account}</p>
            <p className={isOwner ? "status-owner" : "status-not-owner"}>
              {isOwner ? "Owner" : "Not Owner"}
            </p>
          </div>
          {/*buttons for checking ownership , refreshing owner and refreshing your cards*/}
          <div className="action-buttons">
            <button onClick={checkOwnership}>Check Ownership</button>
            <button onClick={getOwnerAddress}>Refresh Owner Address</button>
            <button onClick={loadCards}>Refresh Cards</button>
          </div>

          {/*Form for minting new cards*/}
          {isOwner && (
            <div>
              <h2>Mint New Pokemon Card</h2>
              {mintForm}
            </div>
          )}
          
          {/*Container for your cards*/}
          <div className="cards-container">
            <div className="header-container">
              <h2>Your Pokemon Cards</h2>
              <button className="refresh-button" onClick={loadCards}>Refresh</button>
            </div>
            <div className="cards-grid">
              {cards.map((card) => (
                <div key={card.tokenId} className="card">
                  <img src={card.imageUrl} alt={card.name} />
                  <h3>{card.name}</h3>
                  <p>Primary Type: {card.primaryType}</p>
                  <p>Secondary Type: {card.secondaryType !== 'none' ? card.secondaryType : 'None'}</p>
                  <p>Attack: {Number(card.attack)}</p>
                  <p>Defense: {Number(card.defense)}</p>
                  <p>Token ID: {card.tokenId}</p>
                  {/*Funtionality for buttons for on each card for fixed and auction sales */}
                  <div className="card-buttons">
                    {card.onSale ? (
                        <p className="listed-for-sale">Listed for Sale</p>
                    ) : (
                        <>
                            {activeAuctions.some(auction => auction.tokenId === card.tokenId) || 
                             yourAuctions.some(auction => auction.tokenId === card.tokenId) ? (
                                <p className="listed-for-sale">Card on Auction</p>
                            ) : (
                                <>
                                    <button className="action-button" onClick={() => handleSellCard(card)}>Sell Card</button>
                                    <button className="action-button" onClick={() => { setSelectedCard(card); setShowAuctionPopup(true); }}>Create Auction</button>
                                </>
                            )}
                        </>
                    )}
                  </div>
                </div>
              ))}
              {cards.length === 0 && (
                <p>No cards found. Mint some cards to get started!</p>
              )}
            </div>
          </div>

          {/* Popup for Selling Card */}
          {showSellPopup && (
            <div className="popup">
              <div className="popup-content">
                <h3>List {selectedCard?.name} for Sale</h3>
                <p>Token ID: {selectedCard?.tokenId}</p>
                <p>Price (ETH):</p>
                <input 
                  type="number" 
                  value={price} 
                  onChange={(e) => setPrice(e.target.value)} 
                  placeholder="Enter price in ETH" 
                  min="0"
                  step="0.01"
                />
                <div className="popup-buttons">
                  <button className="action-button" onClick={handleListCard}>List Card</button>
                  <button className="action-button" onClick={handleClosePopup}>Close</button>
                </div>
              </div>
            </div>
          )}

          <div className="active-sales-container">
            <div className="header-container">
                <h2>Active Sales</h2>
                <button className="refresh-button" onClick={loadActiveSales}>Refresh</button>
            </div>
            
            {/* Your Sales Section */}
            <div className="your-sales-container">
                <h3>Your Sales</h3>
                <div className="your-sales-grid">
                    {yourSales.length > 0 ? (
                        yourSales.map((sale) => (
                            <div key={sale.tokenId} className="card">
                                <h3>Name: {sale.name}</h3>
                                <p>Token ID: {sale.tokenId}</p>
                                <p>Price: {Number(sale.price) / 1e18} ETH</p> {/* Convert Wei to Ether */}
                                <p>Seller: {sale.seller}</p>
                                <p>Primary Type: {sale.primaryType}</p>
                                <p>Secondary Type: {sale.secondaryType}</p>
                                <p>Attack: {Number(sale.attack)}</p>
                                <p>Defense: {Number(sale.defense)}</p>
                                <button className="action-button" onClick={() => handleRemoveFromSale(sale.tokenId)}>Remove from Sale</button>
                            </div>
                        ))
                    ) : (
                        <p>No sales found on your account.</p> // Message when there are no sales listed by the account
                    )}
                </div>
            </div>

            {/* All Sales Section */}
            <div className="all-sales-container">
                <h3>All Sales</h3>
                <div className="all-sales-grid">
                    {allSales.length > 0 ? (
                        allSales.map((sale) => (
                            <div key={sale.tokenId} className="card">
                                <h3>Name: {sale.name}</h3>
                                <p>Token ID: {sale.tokenId}</p>
                                <p>Price: {Number(sale.price) / 1e18} ETH</p> {/* Convert Wei to Ether */}
                                <p>Seller: {sale.seller}</p>
                                <button className="action-button" onClick={() => handleBuyCard(sale.tokenId)}>Buy Card</button>
                            </div>
                        ))
                    ) : (
                        <p>No active sales found.</p> // Message when there are no active sales
                    )}
                </div>
            </div>
          </div>

          <div className="auctions-container">
            <div className="header-container">
              <h2>Active Auctions</h2>
              <button className="refresh-button" onClick={loadActiveAuctions}>Refresh</button>
            </div>
            
            {/* Your Auctions Section */}
            <div className="your-auctions-container">
              <h3>Your Auctions</h3>
              <div className="your-auctions-grid">
                {yourAuctions.length > 0 ? (
                    yourAuctions.map((auction) => (
                        <div key={auction.tokenId} className="card">
                            <h3>Token ID: {auction.tokenId}</h3>
                            <p>Name: {auction.name}</p>
                            <p>Starting Price: {formatBigNumber(auction.startingPrice)} ETH</p>
                            <p>Highest Bid: {formatBigNumber(auction.highestBid)} ETH</p>
                            <p>Ends At: {new Date(Number(auction.endTime) * 1000).toLocaleString()}</p>
                        </div>
                    ))
                ) : (
                    <p>No auctions found for your account.</p>
                )}
              </div>
            </div>

            {/* Your Bids Section */}
            <div className="your-bids-container">
                <h3>Your Bids</h3>
                <div className="your-bids-grid">
                    {yourBids.length > 0 ? (
                        yourBids.map((auction) => (
                            <div key={auction.tokenId} className="card">
                                <h3>Token ID: {auction.tokenId}</h3>
                                <p>Name: {auction.name}</p>
                                <p>Your Bid: {Number(auction.yourBid.toString()) / 1e18} ETH</p>
                                <p>Current Highest Bid: {Number(auction.highestBid.toString()) / 1e18} ETH</p>
                                <p>Ends At: {new Date(Number(auction.endTime) * 1000).toLocaleString()}</p>
                                {auction.highestBidder.toLowerCase() === account.toLowerCase() ? (
                                    <p className="highest-bidder">You are the highest bidder!</p>
                                ) : (
                                    <>
                                        <p className="outbid">You have been outbid</p>
                                        <button 
                                            className="action-button" 
                                            style={{ marginTop: '10px' }}
                                            onClick={() => {
                                                setSelectedAuction(auction);
                                                setShowBidPopup(true);
                                            }}
                                        >
                                            Place New Bid
                                        </button>
                                    </>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No active bids found.</p>
                    )}
                </div>
            </div>

            {/* Active Auctions Section */}
            <div className="active-auctions-container">
                <h3>All Auctions</h3>
                <div className="active-auctions-grid">
                    {activeAuctions.length > 0 ? (
                        activeAuctions.map((auction) => (
                            <div key={auction.tokenId} className="card">
                                <h3>Token ID: {auction.tokenId}</h3>
                                <p>Starting Price: {Number(auction.startingPrice.toString())/ 1e18} ETH</p>
                                <p>Highest Bid: {Number(auction.highestBid.toString()) / 1e18} ETH</p>
                                <p>Ends At: {new Date(Number(auction.endTime) * 1000).toLocaleString()}</p>
                                <button 
                                    className="action-button" 
                                    style={{ marginTop: '10px' }}
                                    onClick={() => {
                                        setSelectedAuction(auction);
                                        setShowBidPopup(true);
                                    }}
                                >
                                    Make Bid
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No active auctions found.</p>
                    )}
                </div>
            </div>
          </div>
          {/* Popup for Auctioning Cards */}
          {showAuctionPopup && (
            <div className="popup">
                <div className="popup-content">
                    <h3>Create Auction for {selectedCard?.name}</h3>
                    <p>Token ID: {selectedCard?.tokenId}</p>
                    <label>
                        Minimum Price (ETH):
                        <input 
                            type="number" 
                            value={auctionMinimumPrice} 
                            onChange={(e) => setAuctionMinimumPrice(e.target.value)} 
                            placeholder="Enter minimum price in ETH"
                            min="0"
                            step="0.01"
                        />
                    </label>
                    <label>
                        End Time:
                        <input 
                            type="datetime-local"
                            value={auctionEndTime}
                            onChange={(e) => {
                                // Round to nearest minute
                                const date = new Date(e.target.value);
                                date.setSeconds(0, 0);
                                setAuctionEndTime(date.toISOString().slice(0, 16));
                            }}
                            min={new Date(Date.now() + 60000).toISOString().slice(0, 16)}
                            step="60"
                        />
                    </label>
                    <div className="popup-buttons">
                        <button className="action-button" onClick={handleCreateAuction}>Create Auction</button>
                        <button className="action-button" onClick={() => setShowAuctionPopup(false)}>Close</button>
                    </div>
                </div>
            </div>
          )}
          {/*Pop up for placing bids */}
          {showBidPopup && selectedAuction && (
            <div className="popup">
                <div className="popup-content">
                    <h3>Place Bid</h3>
                    <p>Token ID: {selectedAuction.tokenId}</p>
                    <p>Current Highest Bid: {formatBigNumber(selectedAuction.highestBid)} ETH</p>
                    <p>Minimum Bid: {formatBigNumber(selectedAuction.startingPrice)} ETH</p>
                    <label>
                        Your Bid (ETH):
                        <input 
                            type="number" 
                            value={bidAmount} 
                            onChange={(e) => setBidAmount(e.target.value)} 
                            placeholder="Enter bid amount in ETH"
                            min={Math.max(
                                Number(selectedAuction.startingPrice) / 1e18,
                                Number(selectedAuction.highestBid) / 1e18 + 0.0001
                            )}
                            step="0.0001"
                        />
                    </label>
                    <div className="popup-buttons">
                        <button className="action-button" onClick={handlePlaceBid}>Place Bid</button>
                        <button className="action-button" onClick={() => {
                            setShowBidPopup(false);
                            setBidAmount('');
                            setSelectedAuction(null);
                        }}>Close</button>
                    </div>
                </div>
            </div>
          )}
        </div>
      )}
      <style>{styles}</style>
    </div>
  );
}

export default PokemonInterface;