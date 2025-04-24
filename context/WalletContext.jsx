"use client"

import { createContext, useState, useContext, useEffect } from 'react';
import { arweave } from '../services/arweaveService';

const WalletContext = createContext(null);

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
  const [wallet, setWallet] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isExtensionWallet, setIsExtensionWallet] = useState(false);

  // Check if wallet is already connected
  useEffect(() => {
    const savedWallet = localStorage.getItem('arweaveWallet');
    if (savedWallet) {
      try {
        const walletData = JSON.parse(savedWallet);
        setWallet(walletData);
        getWalletAddress(walletData);
      } catch (error) {
        console.error('Error loading wallet from storage:', error);
        localStorage.removeItem('arweaveWallet');
      }
    }

    // Check for window.arweaveWallet (Wander/extension wallet)
    checkExtensionWallet();
  }, []);

  // Check for extension wallet
  const checkExtensionWallet = async () => {
    if (window.arweaveWallet) {
      setIsExtensionWallet(true);
    }
  };

  // Connect with extension wallet (Wander)
  const connectExtensionWallet = async () => {
    setLoading(true);
    
    try {
      if (!window.arweaveWallet) {
        throw new Error('Arweave wallet extension not found. Please install Wander wallet.');
      }
      
      await window.arweaveWallet.connect(['ACCESS_ADDRESS', 'SIGN_TRANSACTION']);
      
      const address = await window.arweaveWallet.getActiveAddress();
      setWalletAddress(address);
      
      // Use an object to represent extension wallet
      const extensionWalletObj = { type: 'extension', address };
      setWallet(extensionWalletObj);
      
      // Get balance
      await getWalletBalance(address);
      
      // Save minimal info to localStorage
      localStorage.setItem('arweaveWallet', JSON.stringify(extensionWalletObj));
    } catch (error) {
      console.error('Error connecting extension wallet:', error);
      alert(error.message || 'Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  };

  // Get wallet address from JWK
  const getWalletAddress = async (walletJwk) => {
    try {
      // Handle extension wallet
      if (walletJwk.type === 'extension') {
        setWalletAddress(walletJwk.address);
        getWalletBalance(walletJwk.address);
        return walletJwk.address;
      }
      
      // Handle JWK wallet
      const address = await arweave.wallets.jwkToAddress(walletJwk);
      setWalletAddress(address);
      getWalletBalance(address);
      return address;
    } catch (error) {
      console.error('Error getting wallet address:', error);
      return null;
    }
  };

  // Get wallet balance
  const getWalletBalance = async (address) => {
    if (!address) return 0;
    
    try {
      const balance = await arweave.wallets.getBalance(address);
      // Convert to AR from Winston
      const arBalance = arweave.ar.winstonToAr(balance);
      setBalance(arBalance);
      return arBalance;
    } catch (error) {
      console.error('Error getting wallet balance:', error);
      return 0;
    }
  };

  // Connect wallet from file upload
  const connectWallet = async (event) => {
    setLoading(true);
    try {
      const fileReader = new FileReader();
      fileReader.onload = async (e) => {
        try {
          const jwk = JSON.parse(e.target.result);
          setWallet(jwk);
          const address = await getWalletAddress(jwk);
          if (address) {
            localStorage.setItem('arweaveWallet', JSON.stringify(jwk));
          }
        } catch (error) {
          console.error('Error parsing wallet file:', error);
          alert('Invalid wallet file');
        } finally {
          setLoading(false);
        }
      };
      fileReader.readAsText(event.target.files[0]);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setLoading(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = async () => {
    if (isExtensionWallet && window.arweaveWallet) {
      try {
        // Some wallet extensions have a disconnect method
        if (window.arweaveWallet.disconnect) {
          await window.arweaveWallet.disconnect();
        }
      } catch (error) {
        console.error('Error disconnecting extension wallet:', error);
      }
    }
    
    setWallet(null);
    setWalletAddress('');
    setBalance(0);
    localStorage.removeItem('arweaveWallet');
  };

  return (
    <WalletContext.Provider 
      value={{ 
        wallet, 
        walletAddress, 
        balance, 
        loading,
        isExtensionWallet,
        connectWallet,
        connectExtensionWallet,
        disconnectWallet,
        getWalletBalance
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}; 