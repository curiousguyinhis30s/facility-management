'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Subscription, SubscriptionPlan, SUBSCRIPTION_PLANS } from '@/types/subscription'
import { saveToStorage, loadFromStorage, StorageKeys } from '@/lib/storage'

interface SubscriptionContextType {
  subscription: Subscription
  updateSubscription: (plan: SubscriptionPlan) => void
  cancelSubscription: () => void
  hasFeature: (feature: keyof Subscription['features']) => boolean
  canAddMore: (type: 'properties' | 'tenants' | 'employees', current: number) => boolean
  isTrialActive: boolean
  daysLeftInTrial: number
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

// Default free subscription
const createDefaultSubscription = (): Subscription => ({
  plan: 'professional', // Start with professional for demo purposes
  status: 'trial',
  startDate: new Date(),
  endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
  trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days trial
  autoRenew: true,
  features: SUBSCRIPTION_PLANS.professional.features,
})

interface SubscriptionProviderProps {
  children: ReactNode
}

export function SubscriptionProvider({ children }: SubscriptionProviderProps) {
  const [subscription, setSubscription] = useState<Subscription>(createDefaultSubscription())

  // Load subscription from storage on mount
  useEffect(() => {
    const stored = loadFromStorage<Subscription>('facilitypro_subscription', createDefaultSubscription())
    setSubscription(stored)
  }, [])

  // Save subscription to storage whenever it changes
  useEffect(() => {
    saveToStorage('facilitypro_subscription', subscription)
  }, [subscription])

  const updateSubscription = (plan: SubscriptionPlan) => {
    const planDetails = SUBSCRIPTION_PLANS[plan]
    setSubscription((prev) => ({
      ...prev,
      plan,
      features: planDetails.features,
      status: 'active',
      trialEndsAt: undefined, // Remove trial when upgrading
    }))
  }

  const cancelSubscription = () => {
    setSubscription((prev) => ({
      ...prev,
      status: 'cancelled',
      autoRenew: false,
    }))
  }

  const hasFeature = (feature: keyof Subscription['features']): boolean => {
    return subscription.features[feature] as boolean
  }

  const canAddMore = (type: 'properties' | 'tenants' | 'employees', current: number): boolean => {
    const maxKey = `max${type.charAt(0).toUpperCase() + type.slice(1)}` as keyof Subscription['features']
    const max = subscription.features[maxKey] as number

    // -1 means unlimited
    if (max === -1) return true

    return current < max
  }

  const isTrialActive = (): boolean => {
    if (!subscription.trialEndsAt || subscription.status !== 'trial') return false
    return new Date() < new Date(subscription.trialEndsAt)
  }

  const getDaysLeftInTrial = (): number => {
    if (!subscription.trialEndsAt) return 0
    const now = new Date()
    const trialEnd = new Date(subscription.trialEndsAt)
    const diffTime = trialEnd.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        updateSubscription,
        cancelSubscription,
        hasFeature,
        canAddMore,
        isTrialActive: isTrialActive(),
        daysLeftInTrial: getDaysLeftInTrial(),
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider')
  }
  return context
}
