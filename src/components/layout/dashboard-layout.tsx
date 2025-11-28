'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sidebar } from './sidebar'
import { Header } from './header'
import { cn } from '@/lib/utils'
import { useData } from '@/contexts/DataContext'
import { useAuth } from '@/contexts/AuthContext'

// Base navigation items (badges will be added dynamically)
const baseNavigation = [
  {
    title: 'Dashboard',
    href: '/portal',
    icon: (
      <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
        />
      </svg>
    ),
  },
  {
    title: 'Properties',
    href: '/properties',
    icon: (
      <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
        />
      </svg>
    ),
  },
  {
    title: 'Tenants',
    href: '/tenants',
    icon: (
      <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
        />
      </svg>
    ),
    badgeKey: 'tenants',
  },
  {
    title: 'Leases',
    href: '/leases',
    icon: (
      <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
        />
      </svg>
    ),
  },
  {
    title: 'Maintenance',
    href: '/maintenance-hub',
    icon: (
      <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"
        />
      </svg>
    ),
    badgeKey: 'openWorkOrders',
  },
  {
    title: 'Payments',
    href: '/payments',
    icon: (
      <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
        />
      </svg>
    ),
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: (
      <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z"
        />
      </svg>
    ),
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: (
      <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
]

// Mobile bottom nav items (subset)
const mobileNavItems = [
  { title: 'Dashboard', href: '/portal', icon: baseNavigation[0].icon },
  { title: 'Properties', href: '/properties', icon: baseNavigation[1].icon },
  { title: 'Tenants', href: '/tenants', icon: baseNavigation[2].icon },
  { title: 'Maintenance', href: '/maintenance-hub', icon: baseNavigation[4].icon },
  { title: 'More', href: '#more', icon: (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  )},
]

interface DashboardLayoutProps {
  children: React.ReactNode
  title: string | React.ReactNode
  actions?: React.ReactNode
}

export function DashboardLayout({ children, title, actions }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const { tenants, workOrders, leases } = useData()
  const { user, logout } = useAuth()
  const pathname = usePathname()

  // Calculate dynamic badge counts
  const badgeCounts = React.useMemo(() => ({
    tenants: tenants.length,
    openWorkOrders: workOrders.filter(wo => wo.status === 'open' || wo.status === 'in_progress').length,
    activeLeases: leases.filter(l => l.status === 'active').length,
  }), [tenants, workOrders, leases])

  // Generate navigation with dynamic badges
  const navigation = React.useMemo(() =>
    baseNavigation.map(item => ({
      ...item,
      badge: item.badgeKey ? String(badgeCounts[item.badgeKey as keyof typeof badgeCounts] || 0) : undefined,
    })),
    [badgeCounts]
  )

  // Persist sidebar state in localStorage
  React.useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    if (saved !== null) {
      setSidebarCollapsed(saved === 'true')
    }
  }, [])

  // Close mobile menu on route change
  React.useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const toggleSidebar = () => {
    const newValue = !sidebarCollapsed
    setSidebarCollapsed(newValue)
    localStorage.setItem('sidebar-collapsed', String(newValue))
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          navItems={navigation}
          collapsed={sidebarCollapsed}
          onToggle={toggleSidebar}
        />
      </div>

      {/* Mobile Sidebar Overlay with Blur */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden transition-all duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <div className={cn(
        'fixed left-0 top-0 h-full w-72 bg-white z-50 transform transition-transform duration-300 ease-out md:hidden',
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between h-14 px-4 border-b border-black/[0.06]">
          <Link href="/portal" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-slate-900">FacilityPro</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 -mr-2 text-slate-500 hover:text-slate-700"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Mobile Nav Items */}
        <nav className="p-3 overflow-y-auto h-[calc(100%-8rem)]">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  )}
                >
                  <span className="h-5 w-5">{item.icon}</span>
                  <span className="flex-1">{item.title}</span>
                  {item.badge && Number(item.badge) > 0 && (
                    <span className={cn(
                      'text-[10px] font-semibold px-1.5 py-0.5 rounded-full',
                      isActive ? 'bg-primary/20 text-primary' : 'bg-slate-200 text-slate-600'
                    )}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Mobile User Section */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-black/[0.06] bg-white">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-xs font-semibold text-white">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-red-500 transition-colors"
              title="Logout"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={cn(
          'flex flex-1 flex-col overflow-hidden transition-[margin] duration-200 ease-out',
          'md:ml-56',
          sidebarCollapsed && 'md:ml-16'
        )}
      >
        {/* Mobile Page Title Header - Clean minimal design */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-black/[0.04] px-4 py-3 md:hidden">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-slate-900 truncate">
              {typeof title === 'string' ? title : 'Dashboard'}
            </h1>
            {actions && (
              <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                {actions}
              </div>
            )}
          </div>
        </header>

        {/* Desktop Header */}
        <div className="hidden md:block">
          <Header title={title} actions={actions} />
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">{children}</main>

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-black/[0.08] px-2 py-1.5 md:hidden z-30">
          <div className="flex items-center justify-around">
            {mobileNavItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '#more' && pathname.startsWith(item.href + '/'))
              const isMore = item.href === '#more'

              if (isMore) {
                return (
                  <button
                    key={item.href}
                    onClick={() => setMobileMenuOpen(true)}
                    className="flex flex-col items-center gap-0.5 px-3 py-1.5 text-slate-400"
                  >
                    <span className="h-5 w-5">{item.icon}</span>
                    <span className="text-[10px] font-medium">{item.title}</span>
                  </button>
                )
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex flex-col items-center gap-0.5 px-3 py-1.5 transition-colors',
                    isActive ? 'text-primary' : 'text-slate-400'
                  )}
                >
                  <span className="h-5 w-5">{item.icon}</span>
                  <span className="text-[10px] font-medium">{item.title}</span>
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </div>
  )
}
