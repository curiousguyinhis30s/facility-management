'use client'

import React from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { formatCurrency } from '@/lib/utils'
import { FeatureGate } from '@/components/subscription/FeatureGate'

// Mini sparkline component for metric cards
function Sparkline({ data, color = 'text-primary' }: { data: number[]; color?: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const width = 80
  const height = 32
  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * width
      const y = height - ((value - min) / range) * height
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg width={width} height={height} className={`${color} opacity-60`}>
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// Animated counter component
function AnimatedValue({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const [displayValue, setDisplayValue] = React.useState(0)

  React.useEffect(() => {
    const duration = 1000
    const startTime = Date.now()
    const startValue = displayValue

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayValue(Math.floor(startValue + (value - startValue) * eased))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [value])

  return (
    <span>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  )
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = React.useState('30')
  const [selectedMetric, setSelectedMetric] = React.useState('revenue')
  const [isLoaded, setIsLoaded] = React.useState(false)

  React.useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Mock analytics data with sparkline trends
  const overviewMetrics = {
    totalRevenue: 215000,
    revenueGrowth: 12.5,
    revenueTrend: [180000, 185000, 190000, 195000, 200000, 208000, 215000],
    totalProperties: 5,
    propertyGrowth: 0,
    propertyTrend: [5, 5, 5, 5, 5, 5, 5],
    totalTenants: 63,
    tenantGrowth: 8.6,
    tenantTrend: [55, 57, 58, 60, 61, 62, 63],
    avgOccupancy: 91.7,
    occupancyChange: -2.3,
    occupancyTrend: [94, 93, 92, 91, 91.5, 91.2, 91.7],
    activeWorkOrders: 14,
    workOrdersChange: -20.0,
    workOrdersTrend: [22, 20, 18, 17, 15, 14, 14],
    maintenanceCost: 18500,
    costChange: 15.2,
    costTrend: [14000, 15000, 16000, 17000, 17500, 18000, 18500],
  }

  const propertyPerformance = [
    {
      id: '1',
      name: 'Sunset Apartments',
      revenue: 48000,
      occupancy: 91.7,
      units: { total: 24, occupied: 22 },
      trend: 'up',
      maintenance: 4200,
    },
    {
      id: '2',
      name: 'Downtown Condos',
      revenue: 72000,
      occupancy: 100,
      units: { total: 18, occupied: 18 },
      trend: 'stable',
      maintenance: 2800,
    },
    {
      id: '3',
      name: 'Commerce Warehouse',
      revenue: 32000,
      occupancy: 75,
      units: { total: 8, occupied: 6 },
      trend: 'down',
      maintenance: 6500,
    },
    {
      id: '4',
      name: 'Retail Plaza',
      revenue: 45000,
      occupancy: 83.3,
      units: { total: 12, occupied: 10 },
      trend: 'up',
      maintenance: 3200,
    },
    {
      id: '5',
      name: 'Garden Houses',
      revenue: 18000,
      occupancy: 83.3,
      units: { total: 6, occupied: 5 },
      trend: 'stable',
      maintenance: 1800,
    },
  ]

  const recentActivity = [
    {
      id: '1',
      type: 'payment',
      title: 'Payment Received',
      description: 'Unit 204 - Sunset Apartments',
      amount: 2000,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'success',
    },
    {
      id: '2',
      type: 'maintenance',
      title: 'Work Order Completed',
      description: 'Plumbing repair - Downtown Condos',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      status: 'success',
    },
    {
      id: '3',
      type: 'lease',
      title: 'Lease Signed',
      description: 'Unit 105 - Retail Plaza',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      status: 'success',
    },
    {
      id: '4',
      type: 'alert',
      title: 'Lease Expiring Soon',
      description: 'Unit 302 - Sunset Apartments (15 days)',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      status: 'warning',
    },
    {
      id: '5',
      type: 'maintenance',
      title: 'New Work Order',
      description: 'HVAC maintenance - Commerce Warehouse',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: 'info',
    },
  ]

  const getTimeLabel = () => {
    switch (timeRange) {
      case '7':
        return 'Last 7 Days'
      case '30':
        return 'Last 30 Days'
      case '90':
        return 'Last 90 Days'
      case '365':
        return 'Last Year'
      default:
        return 'Last 30 Days'
    }
  }

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'Just now'
  }

  return (
    <DashboardLayout
      title="Analytics & Tracking"
      actions={
        <div className="flex items-center gap-2">
          <Select
            value={timeRange}
            options={[
              { value: '7', label: 'Last 7 Days' },
              { value: '30', label: 'Last 30 Days' },
              { value: '90', label: 'Last 90 Days' },
              { value: '365', label: 'Last Year' },
            ]}
            onChange={(e) => setTimeRange(e.target.value)}
            className="w-40"
          />
          <Button variant="secondary">
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export Report
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Key Metrics Overview */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-black">Key Metrics - {getTimeLabel()}</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Revenue Card - Featured */}
            <Card className={`relative overflow-hidden transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent" />
              <CardContent className="relative p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                        <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="text-sm font-medium text-black/50">Total Revenue</div>
                    </div>
                    <div className="mt-3 text-3xl font-bold text-black">
                      {isLoaded ? (
                        <AnimatedValue value={overviewMetrics.totalRevenue} prefix="SAR " />
                      ) : (
                        formatCurrency(overviewMetrics.totalRevenue)
                      )}
                    </div>
                  </div>
                  <Badge variant={overviewMetrics.revenueGrowth > 0 ? 'success' : 'danger'} className="flex items-center gap-1">
                    {overviewMetrics.revenueGrowth > 0 ? (
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                      </svg>
                    ) : (
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25" />
                      </svg>
                    )}
                    {overviewMetrics.revenueGrowth}%
                  </Badge>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-black/[0.06] pt-3">
                  <span className="text-xs text-black/50">vs previous period</span>
                  <Sparkline data={overviewMetrics.revenueTrend} color="text-emerald-500" />
                </div>
              </CardContent>
            </Card>

            {/* Occupancy Card - Featured */}
            <Card className={`relative overflow-hidden transition-all duration-500 delay-75 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent" />
              <CardContent className="relative p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                        <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                        </svg>
                      </div>
                      <div className="text-sm font-medium text-black/50">Avg Occupancy</div>
                    </div>
                    <div className="mt-3 text-3xl font-bold text-black">
                      {isLoaded ? (
                        <AnimatedValue value={Math.round(overviewMetrics.avgOccupancy)} suffix="%" />
                      ) : (
                        `${overviewMetrics.avgOccupancy}%`
                      )}
                    </div>
                  </div>
                  <Badge variant={overviewMetrics.occupancyChange >= 0 ? 'success' : 'warning'} className="flex items-center gap-1">
                    {overviewMetrics.occupancyChange >= 0 ? (
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                      </svg>
                    ) : (
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25" />
                      </svg>
                    )}
                    {Math.abs(overviewMetrics.occupancyChange)}%
                  </Badge>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-black/[0.06] pt-3">
                  <span className="text-xs text-black/50">{overviewMetrics.totalTenants} active tenants</span>
                  <Sparkline data={overviewMetrics.occupancyTrend} color="text-blue-500" />
                </div>
              </CardContent>
            </Card>

            {/* Maintenance Card - Featured */}
            <Card className={`relative overflow-hidden transition-all duration-500 delay-150 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent" />
              <CardContent className="relative p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
                        <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                        </svg>
                      </div>
                      <div className="text-sm font-medium text-black/50">Maintenance Cost</div>
                    </div>
                    <div className="mt-3 text-3xl font-bold text-black">
                      {isLoaded ? (
                        <AnimatedValue value={overviewMetrics.maintenanceCost} prefix="SAR " />
                      ) : (
                        formatCurrency(overviewMetrics.maintenanceCost)
                      )}
                    </div>
                  </div>
                  <Badge variant={overviewMetrics.costChange > 0 ? 'danger' : 'success'} className="flex items-center gap-1">
                    {overviewMetrics.costChange > 0 ? (
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                      </svg>
                    ) : (
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25" />
                      </svg>
                    )}
                    {overviewMetrics.costChange}%
                  </Badge>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-black/[0.06] pt-3">
                  <span className="text-xs text-black/50">{overviewMetrics.activeWorkOrders} active work orders</span>
                  <Sparkline data={overviewMetrics.costTrend} color="text-amber-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Secondary metrics row */}
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card className={`transition-all duration-500 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black/[0.04]">
                    <svg className="h-5 w-5 text-black/70" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-black/50">Properties</div>
                    <div className="text-xl font-bold text-black">{overviewMetrics.totalProperties}</div>
                  </div>
                </div>
                <Sparkline data={overviewMetrics.propertyTrend} color="text-black/40" />
              </CardContent>
            </Card>

            <Card className={`transition-all duration-500 delay-[250ms] ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100">
                    <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-black/50">Active Tenants</div>
                    <div className="text-xl font-bold text-black">{overviewMetrics.totalTenants}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="success" className="text-xs">+{overviewMetrics.tenantGrowth}%</Badge>
                  <Sparkline data={overviewMetrics.tenantTrend} color="text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card className={`transition-all duration-500 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-100">
                    <svg className="h-5 w-5 text-rose-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-black/50">Work Orders</div>
                    <div className="text-xl font-bold text-black">{overviewMetrics.activeWorkOrders}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="success" className="text-xs">{overviewMetrics.workOrdersChange}%</Badge>
                  <Sparkline data={overviewMetrics.workOrdersTrend} color="text-rose-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Property Performance Table */}
        <FeatureGate feature="advancedReports">
          <Card>
            <CardHeader>
              <CardTitle>Property Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-black/[0.08]">
                    <tr>
                      <th className="pb-3 text-left text-sm font-semibold text-black">Property</th>
                      <th className="pb-3 text-right text-sm font-semibold text-black">Revenue</th>
                      <th className="pb-3 text-center text-sm font-semibold text-black">Occupancy</th>
                      <th className="pb-3 text-center text-sm font-semibold text-black">Units</th>
                      <th className="pb-3 text-center text-sm font-semibold text-black">Trend</th>
                      <th className="pb-3 text-right text-sm font-semibold text-black">Maintenance</th>
                      <th className="pb-3 text-right text-sm font-semibold text-black">Net</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/[0.08]">
                    {propertyPerformance.map((property) => (
                      <tr key={property.id} className="hover:bg-black/[0.02] transition-colors duration-100">
                        <td className="py-3 text-sm font-medium text-black">{property.name}</td>
                        <td className="py-3 text-right text-sm text-black">
                          {formatCurrency(property.revenue)}
                        </td>
                        <td className="py-3 text-center">
                          <Badge
                            variant={
                              property.occupancy >= 90
                                ? 'success'
                                : property.occupancy >= 75
                                ? 'warning'
                                : 'danger'
                            }
                          >
                            {property.occupancy}%
                          </Badge>
                        </td>
                        <td className="py-3 text-center text-sm text-black/70">
                          {property.units.occupied} / {property.units.total}
                        </td>
                        <td className="py-3 text-center">
                          {property.trend === 'up' && (
                            <svg className="mx-auto h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                            </svg>
                          )}
                          {property.trend === 'down' && (
                            <svg className="mx-auto h-5 w-5 text-danger" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181" />
                            </svg>
                          )}
                          {property.trend === 'stable' && (
                            <svg className="mx-auto h-5 w-5 text-black/40" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                            </svg>
                          )}
                        </td>
                        <td className="py-3 text-right text-sm text-black/70">
                          {formatCurrency(property.maintenance)}
                        </td>
                        <td className="py-3 text-right text-sm font-medium text-black">
                          {formatCurrency(property.revenue - property.maintenance)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="border-t-2 border-black/20">
                    <tr>
                      <td className="py-3 text-sm font-semibold text-black">Total</td>
                      <td className="py-3 text-right text-sm font-semibold text-black">
                        {formatCurrency(propertyPerformance.reduce((sum, p) => sum + p.revenue, 0))}
                      </td>
                      <td className="py-3"></td>
                      <td className="py-3 text-center text-sm text-black/70">
                        {propertyPerformance.reduce((sum, p) => sum + p.units.occupied, 0)} /{' '}
                        {propertyPerformance.reduce((sum, p) => sum + p.units.total, 0)}
                      </td>
                      <td className="py-3"></td>
                      <td className="py-3 text-right text-sm font-semibold text-black">
                        {formatCurrency(propertyPerformance.reduce((sum, p) => sum + p.maintenance, 0))}
                      </td>
                      <td className="py-3 text-right text-sm font-semibold text-success">
                        {formatCurrency(
                          propertyPerformance.reduce((sum, p) => sum + (p.revenue - p.maintenance), 0)
                        )}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        </FeatureGate>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Revenue Breakdown */}
          <FeatureGate feature="advancedReports">
            <Card className="overflow-hidden">
              <CardHeader className="border-b border-black/[0.06] bg-black/[0.02]">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-black/50" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                    </svg>
                    Revenue Breakdown
                  </CardTitle>
                  <div className="text-sm font-medium text-black/50">{getTimeLabel()}</div>
                </div>
              </CardHeader>
              <CardContent className="p-5">
                {/* Donut-style visualization */}
                <div className="mb-6 flex items-center justify-center">
                  <div className="relative">
                    <svg width="160" height="160" viewBox="0 0 160 160" className="-rotate-90">
                      {/* Background circle */}
                      <circle cx="80" cy="80" r="60" fill="none" stroke="#f3f4f6" strokeWidth="20" />
                      {/* Rent segment - 83.7% */}
                      <circle
                        cx="80"
                        cy="80"
                        r="60"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="20"
                        strokeDasharray={`${83.7 * 3.77} 377`}
                        strokeDashoffset="0"
                        className="transition-all duration-1000"
                      />
                      {/* Parking segment - 7% */}
                      <circle
                        cx="80"
                        cy="80"
                        r="60"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="20"
                        strokeDasharray={`${7 * 3.77} 377`}
                        strokeDashoffset={`${-83.7 * 3.77}`}
                        className="transition-all duration-1000"
                      />
                      {/* Late Fees segment - 5.6% */}
                      <circle
                        cx="80"
                        cy="80"
                        r="60"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="20"
                        strokeDasharray={`${5.6 * 3.77} 377`}
                        strokeDashoffset={`${-(83.7 + 7) * 3.77}`}
                        className="transition-all duration-1000"
                      />
                      {/* Other segment - 3.7% */}
                      <circle
                        cx="80"
                        cy="80"
                        r="60"
                        fill="none"
                        stroke="#8b5cf6"
                        strokeWidth="20"
                        strokeDasharray={`${3.7 * 3.77} 377`}
                        strokeDashoffset={`${-(83.7 + 7 + 5.6) * 3.77}`}
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-black">{formatCurrency(215000)}</span>
                      <span className="text-xs text-black/50">Total Revenue</span>
                    </div>
                  </div>
                </div>

                {/* Legend and bars */}
                <div className="space-y-4">
                  <div className="group rounded-lg p-2 transition-colors duration-150 hover:bg-black/[0.02]">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-emerald-500" />
                        <span className="text-sm font-medium text-black/70">Rent Payments</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-black">{formatCurrency(180000)}</span>
                        <span className="text-xs text-black/50">83.7%</span>
                      </div>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-black/[0.06]">
                      <div className="h-full rounded-full bg-emerald-500 transition-all duration-1000" style={{ width: '83.7%' }} />
                    </div>
                  </div>

                  <div className="group rounded-lg p-2 transition-colors duration-150 hover:bg-black/[0.02]">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-blue-500" />
                        <span className="text-sm font-medium text-black/70">Parking Fees</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-black">{formatCurrency(15000)}</span>
                        <span className="text-xs text-black/50">7.0%</span>
                      </div>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-black/[0.06]">
                      <div className="h-full rounded-full bg-blue-500 transition-all duration-1000" style={{ width: '7%' }} />
                    </div>
                  </div>

                  <div className="group rounded-lg p-2 transition-colors duration-150 hover:bg-black/[0.02]">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-amber-500" />
                        <span className="text-sm font-medium text-black/70">Late Fees</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-black">{formatCurrency(12000)}</span>
                        <span className="text-xs text-black/50">5.6%</span>
                      </div>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-black/[0.06]">
                      <div className="h-full rounded-full bg-amber-500 transition-all duration-1000" style={{ width: '5.6%' }} />
                    </div>
                  </div>

                  <div className="group rounded-lg p-2 transition-colors duration-150 hover:bg-black/[0.02]">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-purple-500" />
                        <span className="text-sm font-medium text-black/70">Other Income</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-black">{formatCurrency(8000)}</span>
                        <span className="text-xs text-black/50">3.7%</span>
                      </div>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-black/[0.06]">
                      <div className="h-full rounded-full bg-purple-500 transition-all duration-1000" style={{ width: '3.7%' }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FeatureGate>

          {/* Recent Activity Feed */}
          <Card className="overflow-hidden">
            <CardHeader className="border-b border-black/[0.06] bg-black/[0.02]">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-black/50" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Recent Activity
                </CardTitle>
                <Button variant="secondary" className="text-xs">View All</Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-black/[0.06]">
                {recentActivity.map((activity, index) => (
                  <div
                    key={activity.id}
                    className={`flex items-start gap-3 p-4 transition-all duration-300 hover:bg-black/[0.02] ${
                      isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                    }`}
                    style={{ transitionDelay: `${index * 75}ms` }}
                  >
                    <div className="relative">
                      <div
                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${
                          activity.status === 'success'
                            ? 'bg-emerald-100'
                            : activity.status === 'warning'
                            ? 'bg-amber-100'
                            : 'bg-blue-100'
                        }`}
                      >
                        {activity.type === 'payment' && (
                          <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                        {activity.type === 'maintenance' && (
                          <svg className={`h-5 w-5 ${activity.status === 'success' ? 'text-emerald-600' : 'text-blue-600'}`} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                          </svg>
                        )}
                        {activity.type === 'lease' && (
                          <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                          </svg>
                        )}
                        {activity.type === 'alert' && (
                          <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                          </svg>
                        )}
                      </div>
                      {/* Activity type indicator line */}
                      {index < recentActivity.length - 1 && (
                        <div className="absolute left-5 top-12 h-full w-px bg-black/[0.08]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-black">{activity.title}</span>
                            {activity.status === 'warning' && (
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100">
                                <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 truncate text-sm text-black/70">{activity.description}</p>
                        </div>
                        {activity.amount && (
                          <div className="flex flex-shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-sm font-semibold text-emerald-600">
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            {formatCurrency(activity.amount)}
                          </div>
                        )}
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-xs text-black/50">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatTimeAgo(activity.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
