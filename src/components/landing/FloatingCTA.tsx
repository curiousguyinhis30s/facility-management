/**
 * Floating CTA Button
 * Persistent call-to-action with pulse animation
 */

'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useState, useEffect } from 'react'

export function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false)
  const { scrollY } = useScroll()

  // Show after scrolling 300px
  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      setIsVisible(latest > 300)
    })
    return () => unsubscribe()
  }, [scrollY])

  // Fade in/out based on scroll
  const opacity = useTransform(scrollY, [200, 400], [0, 1])

  if (!isVisible) return null

  return (
    <motion.div
      className="fixed bottom-8 right-8 z-50"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      style={{ opacity }}
    >
      <motion.button
        className="relative group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold text-lg shadow-2xl hover:shadow-blue-500/50 transition-all overflow-hidden"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          boxShadow: [
            '0 20px 50px rgba(59, 130, 246, 0.5)',
            '0 20px 50px rgba(147, 51, 234, 0.7)',
            '0 20px 50px rgba(59, 130, 246, 0.5)',
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Animated gradient overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        <span className="relative z-10 flex items-center gap-2">
          Start Free Trial
          <motion.svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </motion.svg>
        </span>

        {/* Pulse ring */}
        <motion.div
          className="absolute inset-0 border-4 border-white rounded-full"
          animate={{
            scale: [1, 1.3],
            opacity: [0.6, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      </motion.button>

      {/* Tooltip */}
      <motion.div
        className="absolute bottom-full right-0 mb-2 px-4 py-2 bg-black text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
        initial={{ y: 10, opacity: 0 }}
        whileHover={{ y: 0, opacity: 1 }}
      >
        No credit card required
        <div className="absolute bottom-0 right-8 transform translate-y-1/2 w-2 h-2 bg-black rotate-45" />
      </motion.div>
    </motion.div>
  )
}
