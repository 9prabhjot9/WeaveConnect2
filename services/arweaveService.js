"use client"

import Arweave from 'arweave';

// Initialize Arweave
export const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
});

// Export functions for working with Arweave
export const getBalance = async (address) => {
  if (!address) return 0;
  try {
    const winstonBalance = await arweave.wallets.getBalance(address);
    return arweave.ar.winstonToAr(winstonBalance);
  } catch (error) {
    console.error('Error getting balance:', error);
    return 0;
  }
};

// Format AR amount for display
export const formatAR = (amount) => {
  if (!amount) return '0 AR';
  return `${parseFloat(amount).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 6
  })} AR`;
};

// Truncate wallet address for display
export const truncateAddress = (address) => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 6)}`;
}; 