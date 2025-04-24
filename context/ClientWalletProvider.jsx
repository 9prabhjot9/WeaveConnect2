"use client"

import { WalletProvider } from './WalletContext';

export function ClientWalletProvider({ children }) {
  return <WalletProvider>{children}</WalletProvider>;
} 