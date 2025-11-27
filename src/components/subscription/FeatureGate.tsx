'use client'

import { ReactNode } from 'react'
import { useSubscription } from '@/contexts/SubscriptionContext'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface FeatureGateProps {
  feature: keyof ReturnType<typeof useSubscription>['subscription']['features']
  children: ReactNode
  fallback?: ReactNode
  showUpgradePrompt?: boolean
}

export function FeatureGate({ feature, children, fallback, showUpgradePrompt = true }: FeatureGateProps) {
  const { hasFeature } = useSubscription()
  const router = useRouter()

  if (hasFeature(feature)) {
    return <>{children}</>
  }

  if (fallback) {
    return <>{fallback}</>
  }

  if (showUpgradePrompt) {
    return (
      <Card className="border-2 border-dashed border-black/[0.12] bg-black/[0.02]">
        <CardContent className="p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-black">Premium Feature</h3>
          <p className="mb-6 text-sm text-black/60">
            This feature is not available in your current plan. Upgrade to unlock this and many more premium features.
          </p>
          <Button variant="primary" onClick={() => router.push('/settings?tab=subscription')}>
            View Plans & Upgrade
          </Button>
        </CardContent>
      </Card>
    )
  }

  return null
}

interface LimitGateProps {
  type: 'properties' | 'tenants' | 'employees'
  current: number
  children: ReactNode
  onUpgradeClick?: () => void
}

export function LimitGate({ type, current, children, onUpgradeClick }: LimitGateProps) {
  const { canAddMore, subscription } = useSubscription()
  const router = useRouter()

  const canAdd = canAddMore(type, current)

  if (canAdd) {
    return <>{children}</>
  }

  const maxKey = `max${type.charAt(0).toUpperCase() + type.slice(1)}` as keyof typeof subscription.features
  const max = subscription.features[maxKey] as number

  const handleUpgrade = () => {
    if (onUpgradeClick) {
      onUpgradeClick()
    } else {
      router.push('/settings?tab=subscription')
    }
  }

  return (
    <div className="rounded-lg border-2 border-dashed border-orange-300 bg-orange-50 p-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-black">Limit Reached</h4>
          <p className="mt-1 text-sm text-black/60">
            You've reached the maximum of {max} {type} allowed in your current plan.
            Upgrade to add more.
          </p>
          <Button variant="secondary" size="sm" onClick={handleUpgrade} className="mt-3">
            Upgrade Plan
          </Button>
        </div>
      </div>
    </div>
  )
}

export function TrialBanner() {
  const { isTrialActive, daysLeftInTrial, subscription } = useSubscription()
  const router = useRouter()

  if (!isTrialActive || subscription.status !== 'trial') return null

  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-black">Trial Period Active</h4>
          <p className="mt-1 text-sm text-black/60">
            You have {daysLeftInTrial} {daysLeftInTrial === 1 ? 'day' : 'days'} left in your {subscription.plan} plan trial.
            Upgrade now to continue enjoying all features after your trial ends.
          </p>
          <Button variant="primary" size="sm" onClick={() => router.push('/settings?tab=subscription')} className="mt-3">
            View Pricing & Upgrade
          </Button>
        </div>
      </div>
    </div>
  )
}
