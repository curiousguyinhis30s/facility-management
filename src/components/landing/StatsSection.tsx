/**
 * Animated Statistics Section
 * Features counting numbers, progress bars, and visual indicators
 */

'use client'

import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations/variants'
import { useCountAnimation, useScrollAnimation } from '@/hooks/useScrollAnimation'

interface Stat {
  value: number
  label: string
  suffix?: string
  prefix?: string
  description: string
  icon: string
}

const stats: Stat[] = [
  {
    value: 10000,
    label: 'Properties',
    suffix: '+',
    description: 'Managed worldwide',
    icon: '🏢',
  },
  {
    value: 50000,
    label: 'Units',
    suffix: '+',
    description: 'Under management',
    icon: '🏠',
  },
  {
    value: 99.9,
    label: 'Uptime',
    suffix: '%',
    description: 'System reliability',
    icon: '⚡',
  },
  {
    value: 30,
    label: 'Cost Savings',
    suffix: '%',
    description: 'Average reduction',
    icon: '💰',
  },
  {
    value: 4.9,
    label: 'Rating',
    suffix: '/5',
    description: 'Customer satisfaction',
    icon: '⭐',
  },
  {
    value: 24,
    label: 'Support',
    suffix: '/7',
    description: 'Always available',
    icon: '🛟',
  },
]

export function StatsSection() {
  const { ref, isInView } = useScrollAnimation()

  return (
    <section ref={ref} className="py-24 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-black mb-4">
            Trusted by Property Managers Worldwide
          </h2>
          <p className="text-xl text-black/60 max-w-3xl mx-auto">
            Join thousands of property managers who have transformed their operations with Manara
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} />
          ))}
        </motion.div>

        {/* Visual Timeline */}
        <motion.div
          className="mt-20"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="bg-white rounded-3xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold text-black mb-8 text-center">
              Average Time Savings by Feature
            </h3>
            <div className="space-y-6">
              <ProgressBar label="Lease Management" percentage={85} color="blue" />
              <ProgressBar label="Work Order Processing" percentage={70} color="purple" />
              <ProgressBar label="Rent Collection" percentage={90} color="green" />
              <ProgressBar label="Reporting & Analytics" percentage={75} color="orange" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function StatCard({ stat, index }: { stat: Stat; index: number }) {
  const { ref, count } = useCountAnimation(stat.value, 2000)

  return (
    <motion.div
      ref={ref}
      variants={staggerItem}
      whileHover={{ scale: 1.05 }}
      className="relative group"
    >
      <div className="h-full p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow border border-black/[0.04]">
        {/* Icon */}
        <div className="text-5xl mb-4">{stat.icon}</div>

        {/* Animated Number */}
        <div className="flex items-baseline mb-2">
          <motion.span
            className="text-5xl font-bold text-black"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          >
            {stat.prefix}
            {count.toLocaleString()}
            {stat.suffix}
          </motion.span>
        </div>

        {/* Label */}
        <div className="text-xl font-semibold text-black/70 mb-2">{stat.label}</div>

        {/* Description */}
        <div className="text-sm text-black/50">{stat.description}</div>

        {/* Decorative line */}
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-b-2xl"
          initial={{ width: 0 }}
          whileInView={{ width: '100%' }}
          transition={{ duration: 1, delay: 0.5 }}
          viewport={{ once: true }}
        />
      </div>
    </motion.div>
  )
}

function ProgressBar({
  label,
  percentage,
  color,
}: {
  label: string
  percentage: number
  color: string
}) {
  const colorClasses = {
    blue: 'from-blue-500 to-cyan-500',
    purple: 'from-purple-500 to-pink-500',
    green: 'from-green-500 to-emerald-500',
    orange: 'from-orange-500 to-red-500',
  }

  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-black/70 font-medium">{label}</span>
        <span className="text-black font-bold">{percentage}% faster</span>
      </div>
      <div className="relative h-4 bg-black/[0.08] rounded-full overflow-hidden">
        <motion.div
          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${colorClasses[color as keyof typeof colorClasses]} rounded-full`}
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          viewport={{ once: true }}
        />
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>
    </div>
  )
}
