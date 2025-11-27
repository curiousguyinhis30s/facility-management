'use client'

import { useState } from 'react'
import { useSubscription } from '@/contexts/SubscriptionContext'
import { SUBSCRIPTION_PLANS, SubscriptionPlan, FEATURE_LABELS } from '@/types/subscription'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { useToast } from '@/components/ui/toast/toast'

export function SubscriptionSettings() {
  const { subscription, updateSubscription, cancelSubscription } = useSubscription()
  const { showToast } = useToast()
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null)

  const handleUpgrade = (plan: SubscriptionPlan) => {
    updateSubscription(plan)
    setSelectedPlan(null)
    showToast(`Successfully upgraded to ${SUBSCRIPTION_PLANS[plan].name} plan!`, 'success')
  }

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel your subscription? You will lose access to premium features.')) {
      cancelSubscription()
      showToast('Subscription cancelled successfully', 'success')
    }
  }

  const plans: SubscriptionPlan[] = ['free', 'basic', 'professional', 'enterprise']

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Current Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-semibold">{SUBSCRIPTION_PLANS[subscription.plan].name}</h3>
                <Badge variant={subscription.status === 'active' ? 'success' : subscription.status === 'trial' ? 'warning' : 'default'}>
                  {subscription.status}
                </Badge>
              </div>
              <p className="mt-2 text-sm text-black/60">{SUBSCRIPTION_PLANS[subscription.plan].description}</p>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold">{formatCurrency(SUBSCRIPTION_PLANS[subscription.plan].price)}</span>
                <span className="text-black/60">/{SUBSCRIPTION_PLANS[subscription.plan].billingCycle}</span>
              </div>
              {subscription.trialEndsAt && subscription.status === 'trial' && (
                <p className="mt-2 text-sm text-orange-600">
                  Trial ends on {new Date(subscription.trialEndsAt).toLocaleDateString()}
                </p>
              )}
            </div>
            {subscription.status === 'active' && subscription.plan !== 'free' && (
              <Button variant="secondary" onClick={handleCancel}>
                Cancel Subscription
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Available Plans</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((planKey) => {
            const plan = SUBSCRIPTION_PLANS[planKey]
            const isCurrent = subscription.plan === planKey

            return (
              <Card
                key={planKey}
                className={`relative ${plan.popular ? 'ring-2 ring-blue-500' : ''} ${isCurrent ? 'border-green-500 bg-green-50' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="default">Most Popular</Badge>
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold">{plan.name}</h3>
                    <p className="mt-1 text-sm text-black/60">{plan.description}</p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">{formatCurrency(plan.price)}</span>
                      <span className="text-black/60">/{plan.billingCycle}</span>
                    </div>
                  </div>

                  {/* Key Features */}
                  <div className="mb-6 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>
                        {plan.features.maxProperties === -1 ? 'Unlimited' : plan.features.maxProperties} Properties
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>
                        {plan.features.maxTenants === -1 ? 'Unlimited' : plan.features.maxTenants} Tenants
                      </span>
                    </div>
                    {plan.features.payments && (
                      <div className="flex items-center gap-2 text-sm">
                        <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Payment Processing</span>
                      </div>
                    )}
                    {plan.features.advancedReports && (
                      <div className="flex items-center gap-2 text-sm">
                        <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Advanced Analytics</span>
                      </div>
                    )}
                    {plan.features.prioritySupport && (
                      <div className="flex items-center gap-2 text-sm">
                        <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Priority Support</span>
                      </div>
                    )}
                  </div>

                  <Button
                    variant={isCurrent ? 'secondary' : 'primary'}
                    className="w-full"
                    disabled={isCurrent}
                    onClick={() => handleUpgrade(planKey)}
                  >
                    {isCurrent ? 'Current Plan' : planKey === 'free' ? 'Downgrade' : 'Upgrade'}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Feature Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left font-semibold">Feature</th>
                  {plans.map((planKey) => (
                    <th key={planKey} className="py-3 px-4 text-center font-semibold">
                      {SUBSCRIPTION_PLANS[planKey].name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(FEATURE_LABELS).map(([key, label]) => (
                  <tr key={key} className="border-b hover:bg-black/[0.02]">
                    <td className="py-3 px-4">{label}</td>
                    {plans.map((planKey) => {
                      const plan = SUBSCRIPTION_PLANS[planKey]
                      const value = plan.features[key as keyof typeof plan.features]

                      return (
                        <td key={planKey} className="py-3 px-4 text-center">
                          {typeof value === 'boolean' ? (
                            value ? (
                              <svg className="mx-auto h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="mx-auto h-5 w-5 text-black/[0.12]" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            )
                          ) : value === -1 ? (
                            <span className="font-semibold text-green-600">Unlimited</span>
                          ) : (
                            <span>{value}</span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
