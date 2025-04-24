"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Copy, CheckCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WalletAddressProps {
  address: string
}

export default function WalletAddress({ address }: WalletAddressProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Format address to show first and last few characters
  const formatAddress = (addr: string) => {
    if (!addr) return ""
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 6)}`
  }

  // Create an array of characters for the animation
  const addressChars = address.split("")

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">Your Wallet Address</div>

      <div className="flex items-center space-x-2">
        <div className="bg-gray-900/60 dark:bg-gray-800/40 border border-pink-500/20 rounded-lg p-3 flex-1 overflow-hidden">
          <div className="hidden sm:block">
            <div className="flex">
              {addressChars.map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 1 + index * 0.02,
                    duration: 0.3,
                    ease: "easeOut",
                  }}
                  className="font-mono"
                >
                  {char}
                </motion.span>
              ))}
            </div>
          </div>

          <div className="block sm:hidden font-mono">{formatAddress(address)}</div>
        </div>

        <Button variant="outline" size="icon" onClick={copyToClipboard} className="relative">
          <motion.div initial={{ opacity: 1 }} animate={{ opacity: copied ? 0 : 1 }} transition={{ duration: 0.2 }}>
            <Copy className="h-4 w-4" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: copied ? 1 : 0, scale: copied ? 1 : 0.8 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <CheckCheck className="h-4 w-4 text-pink-500" />
          </motion.div>
        </Button>
      </div>
    </motion.div>
  )
}
