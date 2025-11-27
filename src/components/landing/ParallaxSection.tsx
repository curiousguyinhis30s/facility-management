/**
 * Parallax Scroll Section
 * Demonstrates advanced scroll-linked animations
 */

'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

export function ParallaxSection() {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // Smooth spring animation
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  // Different parallax speeds for layers
  const y1 = useTransform(smoothProgress, [0, 1], ['0%', '30%'])
  const y2 = useTransform(smoothProgress, [0, 1], ['0%', '50%'])
  const y3 = useTransform(smoothProgress, [0, 1], ['0%', '70%'])

  // Opacity fade
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.4, 1, 0.4])

  // Scale effect
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8])

  return (
    <section ref={ref} className="relative h-[150vh] overflow-hidden bg-black">
      {/* Background Layer - Slowest */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ y: y1 }}
      >
        <div className="w-[800px] h-[800px] rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl" />
      </motion.div>

      {/* Middle Layer - Medium speed */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ y: y2, opacity }}
      >
        <div className="relative max-w-7xl mx-auto px-4">
          <motion.div
            style={{ scale }}
            className="text-center"
          >
            <h2 className="text-5xl sm:text-7xl font-bold text-white mb-6">
              Built for the Future
            </h2>
            <p className="text-2xl text-white/70 mb-12 max-w-3xl mx-auto">
              Experience next-generation property management with cutting-edge technology
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-4">
              {[
                '🤖 AI-Powered',
                '☁️ Cloud Native',
                '🔒 Bank-Level Security',
                '📱 Mobile First',
                '⚡ Lightning Fast',
                '🌍 Global Scale',
              ].map((feature, index) => (
                <motion.div
                  key={feature}
                  className="px-6 py-3 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 text-white font-semibold"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                >
                  {feature}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Foreground Layer - Fastest */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: y3 }}
      >
        <div className="absolute top-20 left-10 w-32 h-32 rounded-lg bg-blue-500/30 backdrop-blur-sm" />
        <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-purple-500/30 backdrop-blur-sm" />
        <div className="absolute bottom-40 left-1/4 w-40 h-40 rounded-lg bg-pink-500/30 backdrop-blur-sm" />
        <div className="absolute bottom-20 right-1/3 w-28 h-28 rounded-full bg-cyan-500/30 backdrop-blur-sm" />
      </motion.div>

      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />
    </section>
  )
}
