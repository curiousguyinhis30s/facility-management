/**
 * Hero Section with Framer Motion Animations
 * Features: Animated headline, CTA button, background gradient
 */

'use client'

import { motion } from 'framer-motion'
import { fadeInUp, fadeInDown, staggerContainer, staggerItem, pulse } from '@/lib/animations/variants'
import { usePrefersReducedMotion } from '@/hooks/useScrollAnimation'

export function HeroSection() {
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20"
        animate={
          prefersReducedMotion
            ? {}
            : {
                backgroundPosition: ['0% 0%', '100% 100%'],
              }
        }
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'linear',
        }}
        style={{
          backgroundSize: '400% 400%',
        }}
      />

      {/* Floating shapes */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"
        animate={
          prefersReducedMotion
            ? {}
            : {
                scale: [1, 1.2, 1],
                x: [0, 50, 0],
                y: [0, 30, 0],
              }
        }
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"
        animate={
          prefersReducedMotion
            ? {}
            : {
                scale: [1, 1.3, 1],
                x: [0, -50, 0],
                y: [0, -30, 0],
              }
        }
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div variants={fadeInDown} className="mb-8 inline-block">
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Modern Facility Management Platform
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeInUp}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-black mb-6 leading-tight"
        >
          Manage Your Properties{' '}
          <motion.span
            className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
            animate={
              prefersReducedMotion
                ? {}
                : {
                    backgroundPosition: ['0%', '100%', '0%'],
                  }
            }
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              backgroundSize: '200% auto',
            }}
          >
            Like a Pro
          </motion.span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeInUp}
          className="text-xl sm:text-2xl text-black/60 mb-12 max-w-3xl mx-auto"
        >
          All-in-one platform for condos, apartments, warehouses, and mixed-use properties.
          Streamline operations, reduce costs, and delight your tenants.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={staggerContainer}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button
            variants={staggerItem}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all overflow-hidden"
          >
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600"
              animate={
                prefersReducedMotion
                  ? {}
                  : {
                      x: ['-100%', '100%'],
                    }
              }
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
            <span className="relative z-10 flex items-center gap-2">
              Start Free Trial
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
          </motion.button>

          <motion.button
            variants={staggerItem}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-white text-black rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl border border-black/[0.08] transition-all"
          >
            Watch Demo
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={fadeInUp}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { value: '10,000+', label: 'Properties Managed' },
            { value: '50,000+', label: 'Active Units' },
            { value: '99.9%', label: 'Uptime' },
            { value: '4.9/5', label: 'User Rating' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={staggerItem}
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-black">{stat.value}</div>
              <div className="text-sm text-black/60 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={
            prefersReducedMotion
              ? {}
              : {
                  y: [0, 10, 0],
                }
          }
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <svg
            className="w-6 h-6 text-black/40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  )
}
