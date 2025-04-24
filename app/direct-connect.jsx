"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, CheckCircle, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import ConnectAnimation from "@/components/connect-animation"

export default function DirectConnect() {
  const [connecting, setConnecting] = useState(false)
  const [connected, setConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [walletFound, setWalletFound] = useState(false)

  // Check if wallet is available
  useEffect(() => {
    const checkWallet = () => {
      if (typeof window !== 'undefined') {
        setWalletFound(!!window.arweaveWallet)
      }
    }
    
    checkWallet()
    
    // Check if we're already connected
    const checkConnected = async () => {
      if (typeof window !== 'undefined' && window.arweaveWallet) {
        try {
          const address = await window.arweaveWallet.getActiveAddress()
          if (address) {
            setWalletAddress(address)
            setConnected(true)
          }
        } catch (e) {
          // Not connected yet
        }
      }
    }
    
    checkConnected()
  }, [])

  // Connect to wallet
  const connectWallet = async () => {
    if (!window.arweaveWallet) {
      alert("Wander wallet not found. Please install the Wander/ArConnect browser extension.")
      window.open("https://www.wander.app", "_blank")
      return
    }
    
    setConnecting(true)
    
    try {
      // Request permissions
      await window.arweaveWallet.connect(['ACCESS_ADDRESS', 'SIGN_TRANSACTION'])
      
      // Get address
      const address = await window.arweaveWallet.getActiveAddress()
      setWalletAddress(address)
      setConnected(true)
    } catch (error) {
      console.error("Error connecting to wallet:", error)
      alert("Failed to connect to wallet: " + (error.message || "Unknown error"))
    } finally {
      setConnecting(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-black bg-[radial-gradient(ellipse_at_center,rgba(236,72,153,0.15),rgba(168,85,247,0.1),rgba(0,0,0,0))] grid-bg">
      <Card className="w-full max-w-md p-6 overflow-hidden relative backdrop-blur-sm bg-black/40 border border-pink-500/20 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-500/10 z-0" />

        <div className="relative z-10">
          <motion.div
            className="flex flex-col items-center justify-center space-y-8 py-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Wallet className="w-12 h-12 text-white" />
            </motion.div>

            <h1 className="text-2xl font-bold text-center">Direct Wallet Connect</h1>
            <p className="text-center text-gray-400">
              {walletFound ? "Wander/ArConnect wallet detected" : "Wander/ArConnect wallet not detected"}
            </p>

            <AnimatePresence mode="wait">
              {!connected ? (
                <motion.div
                  key="connect"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full"
                >
                  <Button
                    onClick={connectWallet}
                    disabled={connecting || !walletFound}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-6 glow-effect"
                  >
                    {connecting ? (
                      <motion.div className="flex items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="mr-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        Connecting...
                      </motion.div>
                    ) : (
                      <motion.div
                        className="flex items-center"
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        Connect to Wander Wallet
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </motion.div>
                    )}
                  </Button>
                  
                  {!walletFound && (
                    <div className="mt-3 text-center text-xs text-red-400">
                      Please install the Wander wallet extension first
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="connected"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full flex flex-col items-center space-y-6"
                >
                  <ConnectAnimation />

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="flex items-center justify-center space-x-2 text-pink-400"
                  >
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Successfully Connected</span>
                  </motion.div>

                  <div className="bg-gray-900/60 border border-pink-500/20 rounded-lg p-3 w-full break-all text-center">
                    <div className="text-xs text-gray-400 mb-1">Wallet Address</div>
                    <div className="font-mono text-sm">{walletAddress}</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </Card>
    </main>
  )
} 