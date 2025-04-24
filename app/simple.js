"use client"

import { useState, useEffect } from 'react'

export default function Simple() {
  const [connecting, setConnecting] = useState(false)
  const [connected, setConnected] = useState(false)
  const [address, setAddress] = useState('')
  const [disconnecting, setDisconnecting] = useState(false)
  const [walletAvailable, setWalletAvailable] = useState(false)

  // Check if wallet is available in browser environment
  useEffect(() => {
    setWalletAvailable(typeof window !== 'undefined' && !!window.arweaveWallet)
  }, [])

  async function connectWallet() {
    if (!walletAvailable) {
      alert('Wanders wallet not found. Please install it first.')
      window.open('https://www.wander.app', '_blank')
      return
    }

    setConnecting(true)
    
    try {
      // TypeScript safety check
      if (!window.arweaveWallet) {
        throw new Error("Arweave wallet not available");
      }
      
      await window.arweaveWallet.connect(['ACCESS_ADDRESS', 'SIGN_TRANSACTION'])
      const walletAddress = await window.arweaveWallet.getActiveAddress()
      setAddress(walletAddress)
      setConnected(true)
    } catch (error) {
      // Handle user cancellation gracefully
      if (error && typeof error === 'object' && 'message' in error && 
          typeof error.message === 'string' && 
          !(error.message.includes("User cancelled") || 
            error.message.includes("user rejected") ||
            error.message.includes("cancelled the AuthRequest"))) {
        console.error('Failed to connect wallet:', error)
      }
    } finally {
      setConnecting(false)
    }
  }

  async function disconnectWallet() {
    setDisconnecting(true)
    
    try {
      // Check if disconnect method exists (it should in Wanders wallet)
      if (walletAvailable && window.arweaveWallet && window.arweaveWallet.disconnect) {
        await window.arweaveWallet.disconnect()
      }
      
      // Reset state
      setAddress('')
      setConnected(false)
    } catch (error) {
      console.error('Failed to disconnect wallet:', error)
    } finally {
      setDisconnecting(false)
    }
  }

  return (
    <div style={{ maxWidth: '600px', margin: '100px auto', textAlign: 'center' }}>
      <h1>Arweave Wallet Connect</h1>
      
      {!connected ? (
        <button 
          onClick={connectWallet} 
          disabled={connecting}
          style={{ 
            padding: '12px 24px',
            background: 'linear-gradient(to right, #ec4899, #8b5cf6)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          {connecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      ) : (
        <div style={{ marginTop: '20px' }}>
          <div style={{ color: 'green', marginBottom: '10px' }}>
            ✓ Successfully Connected
          </div>
          <div style={{ 
            padding: '10px', 
            background: '#222', 
            color: 'white',
            borderRadius: '8px',
            wordBreak: 'break-all',
            fontFamily: 'monospace',
            marginBottom: '20px'
          }}>
            {address}
          </div>
          
          <button 
            onClick={disconnectWallet} 
            disabled={disconnecting}
            style={{ 
              padding: '10px 20px',
              background: 'linear-gradient(to right, #f43f5e, #d946ef)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            {disconnecting ? 'Disconnecting...' : 'Disconnect Wallet'}
          </button>
        </div>
      )}
    </div>
  )
} 