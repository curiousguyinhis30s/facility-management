/**
 * Features Section with Animated Cards
 * Showcases Manara's key features with scroll animations
 */

'use client'

import { motion } from 'framer-motion'
import { staggerContainer, staggerItem, hoverLift } from '@/lib/animations/variants'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

interface Feature {
  icon: string
  title: string
  description: string
  color: string
}

const features: Feature[] = [
  {
    icon: '🏢',
    title: 'Property Management',
    description: 'Manage multiple properties, units, and tenants from one central dashboard.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: '👥',
    title: 'Tenant Portal',
    description: 'Self-service portal for rent payments, maintenance requests, and amenity booking.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: '📋',
    title: 'Lease Management',
    description: 'Digital leases with e-signatures, automated renewals, and compliance tracking.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: '🔧',
    title: 'Work Orders',
    description: 'Track maintenance requests from submission to completion with mobile app.',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: '👷',
    title: 'Workforce Management',
    description: 'Schedule shifts, track attendance, and manage your facility team efficiently.',
    color: 'from-indigo-500 to-blue-500',
  },
  {
    icon: '💰',
    title: 'Payment Processing',
    description: 'Automated rent collection, late fee calculation, and financial reporting.',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    icon: '📊',
    title: 'Analytics & Reports',
    description: 'Real-time insights into occupancy, revenue, expenses, and performance metrics.',
    color: 'from-teal-500 to-green-500',
  },
  {
    icon: '🔒',
    title: 'Compliance & Security',
    description: 'Built-in compliance tools for fair housing, ADA, OSHA, and data protection.',
    color: 'from-gray-700 to-gray-900',
  },
]

export function FeaturesSection() {
  const { ref, isInView } = useScrollAnimation()

  return (
    <section ref={ref} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-black mb-4">
            Everything You Need to Manage Properties
          </h2>
          <p className="text-xl text-black/60 max-w-3xl mx-auto">
            Powerful features designed for property managers, facility teams, and tenants
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <button className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all">
            Explore All Features
          </button>
        </motion.div>
      </div>
    </section>
  )
}

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  return (
    <motion.div
      variants={staggerItem}
      whileHover="hover"
      initial="rest"
      animate="rest"
      className="relative group"
    >
      <motion.div
        variants={hoverLift}
        className="h-full p-6 bg-white rounded-2xl border border-black/[0.08] shadow-sm hover:shadow-xl transition-shadow"
      >
        {/* Icon with gradient background */}
        <motion.div
          className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} mb-4 text-3xl`}
          whileHover={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5 }}
        >
          {feature.icon}
        </motion.div>

        {/* Title */}
        <h3 className="text-xl font-bold text-black mb-2">{feature.title}</h3>

        {/* Description */}
        <p className="text-black/60 leading-relaxed">{feature.description}</p>

        {/* Hover arrow */}
        <motion.div
          className="mt-4 flex items-center text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity"
          initial={{ x: -10 }}
          whileHover={{ x: 0 }}
        >
          Learn more
          <svg
            className="w-4 h-4 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </motion.div>

        {/* Decorative gradient on hover */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"
          style={{
            background: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
          }}
        />
      </motion.div>
    </motion.div>
  )
}
