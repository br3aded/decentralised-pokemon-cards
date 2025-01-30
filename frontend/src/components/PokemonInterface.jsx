import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import PokemonCard from '../../../artifacts/contracts/PokemonCard.sol/PokemonCard.json';

function PokemonInterface() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [cards, setCards] = useState([]);

  // Connect to MetaMask
  async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);

        // Initialize contract
        const contractAddress = "YOUR_POKEMONCARD_ADDRESS";
        const pokemonContract = new ethers.Contract(
          contractAddress,
          PokemonCard.abi,
          signer
        );
        setContract(pokemonContract);
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    }
  }

  // Mint new card
  async function mintCard() {
    if (!contract) return;
    try {
      const tx = await contract.mintCard(
        account,
        "Pikachu",
        "Electric",
        100,
        50
      );
      await tx.wait();
      loadCards();
    } catch (error) {
      console.error("Error minting card:", error);
    }
  }

  // Load user's cards
  async function loadCards() {
    if (!contract || !account) return;
    try {
      const balance = await contract.balanceOf(account);
      const newCards = [];
      
      for (let i = 0; i < balance; i++) {
        const tokenId = await contract.tokenOfOwnerByIndex(account, i);
        const attributes = await contract.getPokemonAttributes(tokenId);
        newCards.push({
          tokenId: tokenId.toString(),
          name: attributes.name,
          type: attributes.pType,
          attack: attributes.attack.toString(),
          defense: attributes.defense.toString()
        });
      }
      
      setCards(newCards);
    } catch (error) {
      console.error("Error loading cards:", error);
    }
  }

  useEffect(() => {
    if (account) {
      loadCards();
    }
  }, [account]);

  return (
    <div className="container">
      <h1>Pokemon Card NFT Interface</h1>
      
      {!account ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <div>
          <p>Connected Account: {account}</p>
          <button onClick={mintCard}>Mint New Card</button>
          
          <h2>Your Pokemon Cards</h2>
          <div className="cards-grid">
            {cards.map((card) => (
              <div key={card.tokenId} className="card">
                <h3>{card.name}</h3>
                <p>Type: {card.type}</p>
                <p>Attack: {card.attack}</p>
                <p>Defense: {card.defense}</p>
                <p>Token ID: {card.tokenId}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PokemonInterface; 