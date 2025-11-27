/**
 * Pricing Section with Interactive Cards
 * Animated pricing tiers with comparison features
 */

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { staggerContainer, staggerItem, hoverLift } from '@/lib/animations/variants'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

interface PricingTier {
  name: string
  price: number
  period: string
  description: string
  features: string[]
  highlighted?: boolean
  ctaText: string
  color: string
}

const pricingTiers: PricingTier[] = [
  {
    name: 'Starter',
    price: 49,
    period: 'month',
    description: 'Perfect for individual landlords',
    features: [
      'Up to 10 units',
      'Basic property management',
      'Online rent collection',
      'Work order tracking',
      'Document storage (5 GB)',
      'Email support',
    ],
    ctaText: 'Start Free Trial',
    color: 'blue',
  },
  {
    name: 'Professional',
    price: 149,
    period: 'month',
    description: 'For growing property portfolios',
    features: [
      'Up to 100 units',
      'Everything in Starter',
      'Workforce management',
      'Preventive maintenance',
      'Tenant portal',
      'Advanced reporting',
      'Phone + email support',
    ],
    highlighted: true,
    ctaText: 'Start Free Trial',
    color: 'purple',
  },
  {
    name: 'Business',
    price: 399,
    period: 'month',
    description: 'For mid-size operations',
    features: [
      'Up to 500 units',
      'Everything in Professional',
      'Unlimited employees',
      'Mobile apps',
      'API access',
      'Priority support',
      'Dedicated account manager',
    ],
    ctaText: 'Start Free Trial',
    color: 'pink',
  },
  {
    name: 'Enterprise',
    price: 0,
    period: 'custom',
    description: 'For large-scale operations',
    features: [
      'Unlimited units',
      'Everything in Business',
      'White-label option',
      'SSO (SAML)',
      'Custom integrations',
      '99.95% SLA',
      'Dedicated support team',
    ],
    ctaText: 'Contact Sales',
    color: 'gray',
  },
]

export function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly')
  const { ref, isInView } = useScrollAnimation()

  const discount = billingPeriod === 'annual' ? 0.8 : 1 // 20% off annual

  return (
    <section ref={ref} className="py-24 bg-gradient-to-br from-black/[0.02] to-black/[0.04]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-black mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-black/60 max-w-3xl mx-auto mb-8">
            Choose the perfect plan for your property portfolio
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 bg-white p-2 rounded-full shadow-lg">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-black/60 hover:text-black'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                billingPeriod === 'annual'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-black/60 hover:text-black'
              }`}
            >
              Annual
              <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {pricingTiers.map((tier, index) => (
            <PricingCard
              key={tier.name}
              tier={tier}
              discount={discount}
              billingPeriod={billingPeriod}
              index={index}
            />
          ))}
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          className="mt-20 flex flex-wrap justify-center items-center gap-12 opacity-70"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 0.7, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.8 }}
        >
          {['💳 No credit card required', '🔒 SSL Secure', '✓ Cancel anytime', '📞 24/7 Support'].map(
            (badge) => (
              <div key={badge} className="text-black/60 font-medium">
                {badge}
              </div>
            )
          )}
        </motion.div>
      </div>
    </section>
  )
}

function PricingCard({
  tier,
  discount,
  billingPeriod,
  index,
}: {
  tier: PricingTier
  discount: number
  billingPeriod: 'monthly' | 'annual'
  index: number
}) {
  const finalPrice = tier.price === 0 ? 0 : Math.floor(tier.price * discount)
  const colorClasses = {
    blue: 'from-blue-500 to-cyan-500',
    purple: 'from-purple-500 to-pink-500',
    pink: 'from-pink-500 to-rose-500',
    gray: 'from-gray-700 to-gray-900',
  }

  return (
    <motion.div
      variants={staggerItem}
      whileHover="hover"
      initial="rest"
      animate="rest"
      className={`relative ${tier.highlighted ? 'lg:-mt-4' : ''}`}
    >
      {tier.highlighted && (
        <motion.div
          className="absolute -top-5 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold rounded-full shadow-lg"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          MOST POPULAR
        </motion.div>
      )}

      <motion.div
        variants={hoverLift}
        className={`h-full p-8 bg-white rounded-3xl shadow-xl border-2 ${
          tier.highlighted ? 'border-purple-500' : 'border-black/[0.08]'
        } transition-all`}
      >
        {/* Gradient Header */}
        <div
          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colorClasses[tier.color as keyof typeof colorClasses]} mb-6 flex items-center justify-center text-3xl`}
        >
          {tier.name === 'Starter' && '🚀'}
          {tier.name === 'Professional' && '⭐'}
          {tier.name === 'Business' && '💼'}
          {tier.name === 'Enterprise' && '🏢'}
        </div>

        {/* Tier Name */}
        <h3 className="text-2xl font-bold text-black mb-2">{tier.name}</h3>
        <p className="text-black/60 mb-6">{tier.description}</p>

        {/* Price */}
        <div className="mb-6">
          {tier.price === 0 ? (
            <div className="text-3xl font-bold text-black">Custom</div>
          ) : (
            <>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-black">${finalPrice}</span>
                <span className="text-black/60">/{tier.period}</span>
              </div>
              {billingPeriod === 'annual' && (
                <motion.div
                  className="text-sm text-green-600 font-medium mt-1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  Save ${(tier.price - finalPrice) * 12}/year
                </motion.div>
              )}
            </>
          )}
        </div>

        {/* CTA Button */}
        <motion.button
          className={`w-full py-3 px-6 rounded-lg font-semibold text-white mb-8 ${
            tier.highlighted
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-500/50'
              : 'bg-gradient-to-r ' + colorClasses[tier.color as keyof typeof colorClasses]
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {tier.ctaText}
        </motion.button>

        {/* Features */}
        <ul className="space-y-4">
          {tier.features.map((feature, i) => (
            <motion.li
              key={feature}
              className="flex items-start gap-3"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.05 }}
              viewport={{ once: true }}
            >
              <svg
                className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-black/70">{feature}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  )
}
