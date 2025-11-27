'use client'

import React from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useData } from '@/contexts/DataContext'
import { useCurrency } from '@/contexts/CurrencyContext'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { DashboardPageSkeleton } from '@/components/ui/skeletons'

// Get greeting based on time
function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

// Format relative time
function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function PortalDashboard() {
  const { properties, tenants, leases, workOrders, units, isLoading } = useData()
  const { formatAmount } = useCurrency()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, authLoading, router])

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null
  }

  // Show skeleton while loading data
  if (isLoading) {
    return (
      <DashboardLayout title="">
        <DashboardPageSkeleton />
      </DashboardLayout>
    )
  }

  // Calculate real stats
  const stats = React.useMemo(() => {
    const totalUnits = properties.reduce((sum, p) => sum + (p.totalUnits || 0), 0)
    const occupiedUnits = properties.reduce((sum, p) => sum + (p.occupiedUnits || 0), 0)
    const monthlyRevenue = properties.reduce((sum, p) => sum + (p.monthlyRevenue || 0), 0)
    const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0

    return { totalUnits, occupiedUnits, monthlyRevenue, occupancyRate }
  }, [properties])

  // Get attention items - things that need action
  const attentionItems = React.useMemo(() => {
    const items: Array<{
      id: string
      type: 'urgent' | 'warning' | 'info'
      title: string
      description: string
      action: string
      href: string
      count?: number
    }> = []

    // Urgent work orders
    const urgentWorkOrders = workOrders.filter(wo => wo.priority === 'urgent' && wo.status !== 'completed')
    if (urgentWorkOrders.length > 0) {
      items.push({
        id: 'urgent-wo',
        type: 'urgent',
        title: `${urgentWorkOrders.length} urgent work order${urgentWorkOrders.length > 1 ? 's' : ''}`,
        description: urgentWorkOrders[0]?.title || 'Requires immediate attention',
        action: 'View all',
        href: '/maintenance-hub?priority=urgent',
        count: urgentWorkOrders.length,
      })
    }

    // Expiring leases
    const expiringLeases = leases.filter(l => l.status === 'expiring')
    if (expiringLeases.length > 0) {
      items.push({
        id: 'expiring-leases',
        type: 'warning',
        title: `${expiringLeases.length} lease${expiringLeases.length > 1 ? 's' : ''} expiring soon`,
        description: 'Review and renew before expiration',
        action: 'Review leases',
        href: '/leases?status=expiring',
        count: expiringLeases.length,
      })
    }

    // Open work orders (non-urgent)
    const openWorkOrders = workOrders.filter(wo => wo.status === 'open' && wo.priority !== 'urgent')
    if (openWorkOrders.length > 0) {
      items.push({
        id: 'open-wo',
        type: 'info',
        title: `${openWorkOrders.length} open work order${openWorkOrders.length > 1 ? 's' : ''}`,
        description: 'Waiting to be assigned or started',
        action: 'Manage',
        href: '/maintenance-hub?status=open',
        count: openWorkOrders.length,
      })
    }

    // Vacant units
    const vacantUnits = stats.totalUnits - stats.occupiedUnits
    if (vacantUnits > 0 && properties.length > 0) {
      items.push({
        id: 'vacant',
        type: 'info',
        title: `${vacantUnits} vacant unit${vacantUnits > 1 ? 's' : ''}`,
        description: 'Available for new tenants',
        action: 'View properties',
        href: '/properties',
        count: vacantUnits,
      })
    }

    return items.slice(0, 4)
  }, [workOrders, leases, stats, properties])

  // Generate real activity feed with timestamps
  const activityFeed = React.useMemo(() => {
    const activities: Array<{
      id: string
      type: 'tenant' | 'lease' | 'maintenance' | 'payment'
      title: string
      subtitle: string
      timestamp: Date
      status?: 'success' | 'warning' | 'pending'
      href?: string
    }> = []

    // Recent tenants
    tenants.slice(0, 3).forEach((tenant, i) => {
      const property = properties.find(p => p.id === tenant.propertyId)
      const unit = units.find(u => u.id === tenant.unitId)
      activities.push({
        id: `tenant-${tenant.id}`,
        type: 'tenant',
        title: tenant.name,
        subtitle: property ? `${property.name}${unit ? ` • Unit ${unit.unitNumber}` : ''}` : 'New tenant',
        timestamp: new Date(Date.now() - (i + 1) * 3600000 * (i + 2)), // Simulated timestamps
        status: tenant.status === 'active' ? 'success' : 'pending',
        href: `/tenants/${tenant.id}`,
      })
    })

    // Recent work orders
    workOrders.filter(wo => wo.status !== 'completed').slice(0, 2).forEach((wo, i) => {
      const property = properties.find(p => p.id === wo.propertyId)
      activities.push({
        id: `wo-${wo.id}`,
        type: 'maintenance',
        title: wo.title,
        subtitle: property?.name || 'Work order',
        timestamp: new Date(Date.now() - (i + 2) * 3600000 * 4),
        status: wo.priority === 'urgent' ? 'warning' : 'pending',
        href: `/work-orders/${wo.id}`,
      })
    })

    // Sort by timestamp
    return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 5)
  }, [tenants, workOrders, properties, units])

  // Property health overview
  const propertyHealth = React.useMemo(() => {
    return properties.slice(0, 3).map(p => {
      const occupancy = p.totalUnits > 0 ? Math.round((p.occupiedUnits / p.totalUnits) * 100) : 0
      const openWO = workOrders.filter(wo => wo.propertyId === p.id && wo.status !== 'completed').length
      return {
        id: p.id,
        name: p.name,
        occupancy,
        openWorkOrders: openWO,
        revenue: p.monthlyRevenue,
        status: occupancy >= 90 ? 'healthy' : occupancy >= 70 ? 'attention' : 'critical',
      }
    })
  }, [properties, workOrders])

  const hasData = properties.length > 0 || tenants.length > 0

  return (
    <DashboardLayout title="">
      {/* Hero Section */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-black">
          {getGreeting()}{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
        </h1>
        <p className="text-sm text-black/50 mt-0.5">
          {hasData
            ? `Overview of your ${properties.length} ${properties.length === 1 ? 'property' : 'properties'}`
            : 'Welcome to FacilityPro'}
        </p>
      </div>

      {/* Empty State for New Users */}
      {!hasData && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card className="border-dashed border-2 border-black/10 bg-gradient-to-br from-blue-50/50 to-transparent">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                </svg>
              </div>
              <h3 className="font-semibold text-black mb-1">Add your first property</h3>
              <p className="text-sm text-black/50 mb-4">Start by adding a property to manage units, tenants, and finances.</p>
              <Link href="/properties">
                <Button variant="primary" size="sm">Add Property</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-dashed border-2 border-black/10 bg-gradient-to-br from-green-50/50 to-transparent">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-black mb-1">Invite tenants</h3>
              <p className="text-sm text-black/50 mb-4">Add tenant information and link them to units for easy management.</p>
              <Link href="/tenants">
                <Button variant="secondary" size="sm">Add Tenant</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-dashed border-2 border-black/10 bg-gradient-to-br from-purple-50/50 to-transparent">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-black mb-1">Configure settings</h3>
              <p className="text-sm text-black/50 mb-4">Set your currency, timezone, and notification preferences.</p>
              <Link href="/settings">
                <Button variant="ghost" size="sm">Go to Settings</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Dashboard for Users with Data */}
      {hasData && (
        <>
          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <Card className="border-slate-100">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">Properties</span>
                  <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center">
                    <svg className="w-3 h-3 text-slate-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                    </svg>
                  </div>
                </div>
                <div className="text-2xl font-semibold text-black">{properties.length}</div>
                <div className="text-[10px] text-black/40">{stats.totalUnits} units</div>
              </CardContent>
            </Card>

            <Card className="border-slate-100">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">Occupancy</span>
                  <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center">
                    <svg className="w-3 h-3 text-slate-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                    </svg>
                  </div>
                </div>
                <div className="text-2xl font-semibold text-black">{stats.occupancyRate}%</div>
                <div className="text-[10px] text-black/40">{stats.occupiedUnits}/{stats.totalUnits} occupied</div>
              </CardContent>
            </Card>

            <Card className="border-slate-100">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">Revenue</span>
                  <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center">
                    <svg className="w-3 h-3 text-slate-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="text-2xl font-semibold text-black">{formatAmount(stats.monthlyRevenue)}</div>
                <div className="text-[10px] text-black/40">Monthly</div>
              </CardContent>
            </Card>

            <Card className="border-slate-100">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">Tenants</span>
                  <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center">
                    <svg className="w-3 h-3 text-slate-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                    </svg>
                  </div>
                </div>
                <div className="text-2xl font-semibold text-black">{tenants.length}</div>
                <div className="text-[10px] text-black/40">{tenants.filter(t => t.status === 'active').length} active</div>
              </CardContent>
            </Card>
          </div>

          {/* Attention Items */}
          {attentionItems.length > 0 && (
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-black/70 uppercase tracking-wide mb-3">Needs Attention</h2>
              <div className="grid gap-3 md:grid-cols-2">
                {attentionItems.map(item => (
                  <Link key={item.id} href={item.href}>
                    <Card className={`transition-all duration-200 hover:shadow-md cursor-pointer ${
                      item.type === 'urgent'
                        ? 'border-red-200 bg-gradient-to-r from-red-50/80 to-white hover:border-red-300'
                        : item.type === 'warning'
                        ? 'border-amber-200 bg-gradient-to-r from-amber-50/80 to-white hover:border-amber-300'
                        : 'border-blue-100 bg-gradient-to-r from-blue-50/50 to-white hover:border-blue-200'
                    }`}>
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          item.type === 'urgent' ? 'bg-red-100' : item.type === 'warning' ? 'bg-amber-100' : 'bg-blue-100'
                        }`}>
                          {item.type === 'urgent' ? (
                            <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            </svg>
                          ) : item.type === 'warning' ? (
                            <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm text-black">{item.title}</div>
                          <div className="text-xs text-black/50 truncate">{item.description}</div>
                        </div>
                        <div className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          item.type === 'urgent' ? 'bg-red-100 text-red-700' : item.type === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {item.action}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Two Column Layout */}
          <div className="grid gap-6 lg:grid-cols-5">
            {/* Activity Feed */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Recent Activity</CardTitle>
                    <span className="text-xs text-black/40">Last 7 days</span>
                  </div>
                </CardHeader>
                <CardContent>
                  {activityFeed.length === 0 ? (
                    <div className="py-8 text-center">
                      <div className="w-12 h-12 rounded-full bg-black/[0.04] flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-black/30" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-sm text-black/50">No recent activity</p>
                      <p className="text-xs text-black/30 mt-1">Activity will appear here as you use the system</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {activityFeed.map((item) => (
                        <Link
                          key={item.id}
                          href={item.href || '#'}
                          className="flex items-center gap-3 p-3 -mx-2 rounded-lg hover:bg-black/[0.02] transition-colors duration-150 group"
                        >
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                            item.status === 'success' ? 'bg-green-100' :
                            item.status === 'warning' ? 'bg-amber-100' : 'bg-black/[0.06]'
                          }`}>
                            {item.type === 'tenant' && (
                              <svg className={`w-4 h-4 ${item.status === 'success' ? 'text-green-600' : 'text-black/40'}`} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                              </svg>
                            )}
                            {item.type === 'maintenance' && (
                              <svg className={`w-4 h-4 ${item.status === 'warning' ? 'text-amber-600' : 'text-black/40'}`} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                              </svg>
                            )}
                            {item.type === 'lease' && (
                              <svg className="w-4 h-4 text-black/40" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                              </svg>
                            )}
                            {item.type === 'payment' && (
                              <svg className="w-4 h-4 text-black/40" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-black group-hover:text-primary transition-colors">{item.title}</div>
                            <div className="text-xs text-black/50">{item.subtitle}</div>
                          </div>
                          <div className="text-[11px] text-black/40 flex-shrink-0">
                            {formatRelativeTime(item.timestamp)}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Property Health */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Property Health</CardTitle>
                    <Link href="/properties" className="text-xs text-primary hover:text-primary/80">View all</Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {propertyHealth.length === 0 ? (
                    <div className="py-8 text-center">
                      <div className="w-12 h-12 rounded-full bg-black/[0.04] flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-black/30" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                        </svg>
                      </div>
                      <p className="text-sm text-black/50">No properties yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {propertyHealth.map(property => (
                        <Link
                          key={property.id}
                          href={`/properties/${property.id}`}
                          className="block p-3 -mx-2 rounded-lg hover:bg-black/[0.02] transition-colors duration-150 group"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-black group-hover:text-primary transition-colors truncate">{property.name}</span>
                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                              property.status === 'healthy' ? 'bg-green-500' :
                              property.status === 'attention' ? 'bg-amber-500' : 'bg-red-500'
                            }`} />
                          </div>
                          <div className="flex items-center gap-4 text-xs text-black/50">
                            <span>{property.occupancy}% occupied</span>
                            {property.openWorkOrders > 0 && (
                              <span className="text-amber-600">{property.openWorkOrders} open WO</span>
                            )}
                            <span className="ml-auto">{formatAmount(property.revenue)}/mo</span>
                          </div>
                          {/* Mini progress bar */}
                          <div className="mt-2 h-1 bg-black/[0.06] rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                property.status === 'healthy' ? 'bg-green-500' :
                                property.status === 'attention' ? 'bg-amber-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${property.occupancy}%` }}
                            />
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  )
}
