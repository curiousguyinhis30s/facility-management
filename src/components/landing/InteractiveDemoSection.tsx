/**
 * Interactive Demo Section
 * Animated mockups showcasing Manara portal features
 */

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeIn, slideInBottom, staggerContainer, staggerItem } from '@/lib/animations/variants'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

interface DemoFeature {
  id: string
  title: string
  description: string
  icon: string
  mockupComponent: React.ReactNode
}

const demoFeatures: DemoFeature[] = [
  {
    id: 'dashboard',
    title: 'Dashboard Overview',
    description: 'Real-time insights into property performance, occupancy, and financials',
    icon: '📊',
    mockupComponent: <DashboardMockup />,
  },
  {
    id: 'work-orders',
    title: 'Work Order Management',
    description: 'Track maintenance requests from submission to completion',
    icon: '🔧',
    mockupComponent: <WorkOrderMockup />,
  },
  {
    id: 'tenant-portal',
    title: 'Tenant Portal',
    description: 'Self-service portal for rent payments and maintenance requests',
    icon: '👥',
    mockupComponent: <TenantPortalMockup />,
  },
  {
    id: 'reports',
    title: 'Advanced Reports',
    description: 'Generate comprehensive reports with one click',
    icon: '📈',
    mockupComponent: <ReportsMockup />,
  },
]

export function InteractiveDemoSection() {
  const [activeFeature, setActiveFeature] = useState(demoFeatures[0].id)
  const { ref, isInView } = useScrollAnimation()

  const currentFeature = demoFeatures.find((f) => f.id === activeFeature)!

  return (
    <section ref={ref} className="py-24 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            See Manara in Action
          </h2>
          <p className="text-xl text-white/40 max-w-3xl mx-auto">
            Experience the power of modern property management
          </p>
        </motion.div>

        {/* Feature Tabs */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {demoFeatures.map((feature) => (
            <motion.button
              key={feature.id}
              variants={staggerItem}
              onClick={() => setActiveFeature(feature.id)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeFeature === feature.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                  : 'bg-white/10 text-white/40 hover:bg-white/20'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="mr-2">{feature.icon}</span>
              {feature.title}
            </motion.button>
          ))}
        </motion.div>

        {/* Demo Display */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Description */}
          <motion.div
            key={`desc-${activeFeature}`}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-6xl mb-6">{currentFeature.icon}</div>
            <h3 className="text-3xl font-bold mb-4">{currentFeature.title}</h3>
            <p className="text-xl text-white/40 mb-8">{currentFeature.description}</p>

            <div className="space-y-4">
              <FeaturePoint icon="✓" text="Real-time updates across all devices" />
              <FeaturePoint icon="✓" text="Intuitive interface, minimal training needed" />
              <FeaturePoint icon="✓" text="Mobile-optimized for on-the-go management" />
              <FeaturePoint icon="✓" text="Customizable to your workflow" />
            </div>

            <motion.button
              className="mt-8 px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try This Feature
            </motion.button>
          </motion.div>

          {/* Animated Mockup */}
          <motion.div
            key={`mockup-${activeFeature}`}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeature}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentFeature.mockupComponent}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Decorative glow */}
            <motion.div
              className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl -z-10"
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function FeaturePoint({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-sm">
        {icon}
      </span>
      <span className="text-white/70">{text}</span>
    </div>
  )
}

// Mockup Components

function DashboardMockup() {
  return (
    <div className="bg-black/[0.02] p-6 min-h-[500px]">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-2xl font-bold text-black">Dashboard</h3>
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Occupancy', value: '95%', color: 'green' },
          { label: 'Work Orders', value: '12', color: 'orange' },
          { label: 'Revenue', value: '$125K', color: 'blue' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            className="bg-white p-4 rounded-lg shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="text-sm text-black/60 mb-1">{stat.label}</div>
            <div className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="bg-white p-4 rounded-lg shadow h-64"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="text-sm font-semibold text-black/70 mb-4">Monthly Revenue</div>
        <div className="flex items-end justify-between h-40">
          {[60, 75, 85, 70, 90, 85].map((height, index) => (
            <motion.div
              key={index}
              className="w-12 bg-gradient-to-t from-blue-500 to-purple-500 rounded-t"
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}

function WorkOrderMockup() {
  const workOrders = [
    { id: 'WO-001', title: 'HVAC Repair', status: 'In Progress', priority: 'High' },
    { id: 'WO-002', title: 'Plumbing Issue', status: 'Pending', priority: 'Medium' },
    { id: 'WO-003', title: 'Painting', status: 'Completed', priority: 'Low' },
  ]

  return (
    <div className="bg-black/[0.02] p-6 min-h-[500px]">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-black mb-4">Work Orders</h3>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">All</button>
          <button className="px-4 py-2 bg-black/[0.08] text-black/70 rounded-lg text-sm">Pending</button>
          <button className="px-4 py-2 bg-black/[0.08] text-black/70 rounded-lg text-sm">In Progress</button>
        </div>
      </div>

      <div className="space-y-3">
        {workOrders.map((wo, index) => (
          <motion.div
            key={wo.id}
            className="bg-white p-4 rounded-lg shadow-sm border border-black/[0.08]"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15 }}
            whileHover={{ scale: 1.02, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-black">{wo.title}</div>
                <div className="text-sm text-black/50">{wo.id}</div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    wo.status === 'Completed'
                      ? 'bg-green-100 text-green-800'
                      : wo.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-black/[0.04] text-black/80'
                  }`}
                >
                  {wo.status}
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    wo.priority === 'High'
                      ? 'bg-red-100 text-red-800'
                      : wo.priority === 'Medium'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-black/[0.04] text-black/80'
                  }`}
                >
                  {wo.priority}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function TenantPortalMockup() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 min-h-[500px]">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-black mb-2">Welcome back, Sarah!</h3>
        <p className="text-black/60">Unit 204 • Sunset Apartments</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {[
          { icon: '💰', label: 'Pay Rent', color: 'blue' },
          { icon: '🔧', label: 'Maintenance', color: 'orange' },
          { icon: '📅', label: 'Book Amenity', color: 'purple' },
          { icon: '📄', label: 'Documents', color: 'green' },
        ].map((item, index) => (
          <motion.button
            key={item.label}
            className={`bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all text-left`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="text-4xl mb-2">{item.icon}</div>
            <div className="font-semibold text-black">{item.label}</div>
          </motion.button>
        ))}
      </div>

      <motion.div
        className="bg-white p-6 rounded-xl shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h4 className="font-semibold text-black mb-3">Next Rent Payment</h4>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-black">$1,500</div>
            <div className="text-sm text-black/50">Due in 5 days</div>
          </div>
          <motion.button
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Pay Now
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

function ReportsMockup() {
  return (
    <div className="bg-black/[0.02] p-6 min-h-[500px]">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-black mb-4">Financial Reports</h3>
        <div className="flex gap-2">
          <select className="px-4 py-2 border border-black/[0.12] rounded-lg text-sm">
            <option>Last 30 Days</option>
            <option>Last Quarter</option>
            <option>Last Year</option>
          </select>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
        <div className="text-sm font-semibold text-black/70 mb-4">Revenue Breakdown</div>
        <div className="space-y-3">
          {[
            { label: 'Rent Collection', amount: 125000, percentage: 75 },
            { label: 'Late Fees', amount: 5000, percentage: 3 },
            { label: 'Amenity Fees', amount: 15000, percentage: 9 },
            { label: 'Other', amount: 22000, percentage: 13 },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex justify-between text-sm mb-1">
                <span className="text-black/60">{item.label}</span>
                <span className="font-semibold text-black">${item.amount.toLocaleString()}</span>
              </div>
              <div className="relative h-2 bg-black/[0.08] rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentage}%` }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.8 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.button
        className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Export Full Report
      </motion.button>
    </div>
  )
}
