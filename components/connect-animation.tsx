"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"

export default function ConnectAnimation() {
  const [showParticles, setShowParticles] = useState(false)

  useEffect(() => {
    // Trigger confetti effect
    const duration = 2000
    const end = Date.now() + duration

    const runConfetti = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#ec4899", "#a855f7"],
      })

      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#ec4899", "#a855f7"],
      })

      if (Date.now() < end) {
        requestAnimationFrame(runConfetti)
      }
    }

    runConfetti()
    setShowParticles(true)

    // Clean up
    return () => {
      setShowParticles(false)
    }
  }, [])

  return (
    <div className="relative w-full h-32 flex items-center justify-center">
      {/* Central pulse animation */}
      <motion.div
        className="absolute w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-600"
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: [0, 1.2, 1],
          opacity: [0, 0.8, 1],
        }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}
      />

      {/* Ripple effects */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border-2 border-pink-500"
          initial={{ width: 60, height: 60, opacity: 0.7 }}
          animate={{
            width: [60, 160 + i * 20],
            height: [60, 160 + i * 20],
            opacity: [0.7, 0],
          }}
          transition={{
            duration: 2,
            delay: i * 0.3,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 0.5,
          }}
        />
      ))}

      {/* Floating particles */}
      {showParticles && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-400"
              initial={{
                x: 0,
                y: 0,
                opacity: 0,
              }}
              animate={{
                x: Math.random() > 0.5 ? [0, (i % 2 ? -1 : 1) * (50 + Math.random() * 50)] : 0,
                y: [0, -50 - Math.random() * 50],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 1 + Math.random() * 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: Math.random() * 2,
                ease: "easeOut",
              }}
            />
          ))}
        </>
      )}
    </div>
  )
}
