import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './PokemonInterface.css';

// Define the ABI explicitly
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
      }
    ],
    "name": "mintCard",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

function PokemonInterface() {
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

  // Add these event listeners in a useEffect
  useEffect(() => {
    // Check if already connected
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          // Create provider using ethers v6 syntax
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            setAccount(accounts[0].address);
            const signer = await provider.getSigner();
            
            // Initialize contract
            const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with your contract address
            const pokemonContract = new ethers.Contract(
              contractAddress,
              PokemonCardABI,
              signer
            );
            setContract(pokemonContract);
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

        // Initialize contract
        const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Your contract address
        console.log("Attempting to connect to contract at:", contractAddress);
        
        // Wait for a moment to ensure the network is synced
        await new Promise(resolve => setTimeout(resolve, 1000));

        const pokemonContract = new ethers.Contract(
          contractAddress,
          PokemonCardABI,
          signer
        );
        
        // Test contract connection
        try {
            console.log("Testing contract connection...");
            // Wait for provider to be ready
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
            console.error("Error accessing contract:", error);
            console.error("Error details:", {
                message: error.message,
                code: error.code,
                data: error.data
            });
            alert("Please make sure your Hardhat node is running and try again.");
        }

      } catch (error) {
        console.error("Error connecting wallet:", error);
        console.error("Error details:", error);
        alert("Error connecting wallet. Please check console for details.");
      }
    } else {
      alert("Please install MetaMask!");
    }
  }

  // Add this function to check ownership
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

  // Update the loadCards function to use ERC721Enumerable functions
  async function loadCards() {
    if (!contract || !account) {
      console.log("Contract or account not initialized");
      return;
    }
    
    try {
      console.log("=== LOADING CARDS ===");
      console.log("Loading cards for connected account:", account);
      
      const balance = await contract.balanceOf(account);
      console.log(`Account owns ${balance.toString()} cards`);
      
      const newCards = [];
      
      for (let i = 0; i < balance; i++) {
        const tokenId = await contract.tokenOfOwnerByIndex(account, i);
        console.log(`\nProcessing token ID: ${tokenId}`);
        
        const attributes = await contract.getPokemonAttributes(tokenId);
        console.log("Raw attributes from contract:", attributes);
        console.log("Attack value from contract:", attributes.attack.toString());
        console.log("Attack value type:", typeof attributes.attack);
        
        // Try different conversion methods
        const attackBN = attributes.attack;
        const attackString = attributes.attack.toString();
        const attackNumber = Number(attributes.attack);
        
        console.log("Attack conversions:", {
          original: attackBN,
          asString: attackString,
          asNumber: attackNumber
        });
        
        newCards.push({
          tokenId: tokenId.toString(),
          name: attributes.name,
          primaryType: attributes.primaryType,
          secondaryType: attributes.secondaryType,
          attack: attackNumber,
          defense: Number(attributes.defense)
        });
      }

      console.log("\nFinal cards array:", newCards);
      setCards(newCards);
      
    } catch (error) {
      console.error("Error loading cards:", error);
    }
  }

  // Add this function to handle form submission
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
        defense: newCardDefense
      });

      const tx = await contract.mintCard(
        account,
        newCardName,
        newCardPrimaryType,
        newCardSecondaryType,
        newCardAttack,
        newCardDefense
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
      
    } catch (error) {
      console.error("Error minting card:", error);
    }
  };

  // Add this function to handle name input validation
  const handleNameChange = (e) => {
    // Only allow letters and spaces
    const value = e.target.value;
    if (value === '' || /^[A-Za-z\s]+$/.test(value)) {
      setNewCardName(value);
    }
  };

  // Update the name input in your mintForm
  const mintForm = (
    <form onSubmit={handleMintSubmit} className="mint-form">
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
          <button type="button" onClick={() => setNewCardAttack(Math.min(100, newCardAttack + 10))}>+10</button>
        </div>
      </div>

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
          <button type="button" onClick={() => setNewCardDefense(Math.min(100, newCardDefense + 10))}>+10</button>
        </div>
      </div>

      <button type="submit" className="mint-button">Mint Pokemon Card</button>
    </form>
  );

  // Add some CSS for styling
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
  `;

  useEffect(() => {
    if (account) {
      loadCards();
    }
  }, [account]);

  // Add this useEffect to log state changes
  useEffect(() => {
    console.log("Account changed:", account);
    console.log("Contract instance:", contract ? "Yes" : "No");
    console.log("Is owner:", isOwner);
  }, [account, contract, isOwner]);

  // Add this function to get the owner address
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

  // Add this useEffect to get the owner address when contract is initialized
  useEffect(() => {
    if (contract) {
      getOwnerAddress();
    }
  }, [contract]);

  // Also update the useEffect that checks ownership on contract initialization
  useEffect(() => {
    if (contract && account) {
      checkOwnership();
    }
  }, [contract, account]);

  return (
    <div className="container">
      <h1>Pokemon Card NFT Trading</h1>
      
      {!account ? (
        <div>
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
          
          <div className="action-buttons">
            <button onClick={checkOwnership}>Check Ownership</button>
            <button onClick={getOwnerAddress}>Refresh Owner Address</button>
            <button onClick={loadCards}>Refresh Cards</button>
          </div>

          {/* Only show mint form if user is owner */}
          {isOwner && (
            <div>
              <h2>Mint New Pokemon Card</h2>
              {mintForm}
            </div>
          )}
          
          <h2>Your Pokemon Cards</h2>
          <div className="cards-grid">
            {cards.map((card) => (
              <div key={card.tokenId} className="card">
                <h3>{card.name}</h3>
                <p>Primary Type: {card.primaryType}</p>
                <p>Secondary Type: {card.secondaryType !== 'none' ? card.secondaryType : 'None'}</p>
                <p>Attack: {card.attack}</p>
                <p>Defense: {card.defense}</p>
                <p>Token ID: {card.tokenId}</p>
              </div>
            ))}
            {cards.length === 0 && (
              <p>No cards found. Mint some cards to get started!</p>
            )}
          </div>

          <h2>Active Auctions</h2>
          <div className="auctions-grid">
            <p>No active auctions found</p>
          </div>
        </div>
      )}
      <style>{styles}</style>
    </div>
  );
}

export default PokemonInterface; 