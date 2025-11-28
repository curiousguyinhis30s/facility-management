'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/ui/logo'

interface NavItem {
  title: string
  href: string
  icon?: React.ReactNode
  badge?: string
}

interface SidebarProps {
  navItems: NavItem[]
  collapsed?: boolean
  onToggle?: () => void
}

export function Sidebar({ navItems, collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-white',
        'border-r border-black/[0.06]',
        'transition-[width] duration-200 ease-out',
        collapsed ? 'w-16' : 'w-56'
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex h-14 items-center border-b border-black/[0.04]',
        collapsed ? 'justify-center' : 'px-4'
      )}>
        <Link href="/dashboard" className="flex items-center">
          {collapsed ? (
            <Logo variant="icon" size="sm" />
          ) : (
            <Logo variant="full" size="sm" />
          )}
        </Link>
      </div>

      {/* Toggle */}
      <button
        onClick={onToggle}
        className={cn(
          'absolute -right-2.5 top-5 z-50',
          'flex h-5 w-5 items-center justify-center',
          'rounded-full bg-white border border-black/10',
          'text-black/40 hover:text-black/70 hover:border-black/20',
          'shadow-sm transition-all duration-150'
        )}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <svg
          className={cn('h-2.5 w-2.5 transition-transform duration-150', collapsed && 'rotate-180')}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2.5"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      {/* Navigation */}
      <nav className={cn('py-3', collapsed ? 'px-2' : 'px-2')}>
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

            return (
              <Link
                key={item.href}
                href={item.href}
                scroll={false}
                className={cn(
                  'group relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium',
                  'transition-all duration-150',
                  collapsed && 'justify-center px-0',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-black/50 hover:bg-black/[0.03] hover:text-black/70'
                )}
              >
                {item.icon && (
                  <span className={cn(
                    'h-4 w-4 shrink-0',
                    isActive && 'text-primary'
                  )}>
                    {item.icon}
                  </span>
                )}

                {!collapsed && (
                  <>
                    <span className="flex-1">{item.title}</span>
                    {item.badge && (
                      <span className={cn(
                        'text-[10px] font-semibold px-1.5 py-0.5 rounded-full',
                        isActive
                          ? 'bg-primary/20 text-primary'
                          : 'bg-black/[0.06] text-black/40'
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}

                {/* Tooltip */}
                {collapsed && (
                  <div className={cn(
                    'absolute left-full ml-3 px-2.5 py-1.5 rounded-md',
                    'bg-black text-white text-[11px] font-medium',
                    'opacity-0 invisible pointer-events-none',
                    'group-hover:opacity-100 group-hover:visible',
                    'transition-opacity duration-100 whitespace-nowrap shadow-lg z-50'
                  )}>
                    {item.title}
                    {item.badge && (
                      <span className="ml-1.5 text-white/60">({item.badge})</span>
                    )}
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* User Profile */}
      <div className={cn(
        'absolute bottom-0 left-0 right-0 border-t border-black/[0.06] p-2',
        collapsed && 'flex justify-center'
      )}>
        <div className={cn(
          'group relative flex items-center gap-2.5 rounded-lg p-2',
          'hover:bg-black/[0.03] cursor-pointer transition-all duration-150',
          collapsed && 'p-1.5'
        )}>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-[11px] font-semibold text-white shadow-sm">
            PM
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-black truncate">Property Manager</p>
              <p className="text-[11px] text-black/40 truncate">manager@facilitypro.app</p>
            </div>
          )}
          {/* Tooltip for collapsed mode */}
          {collapsed && (
            <div className={cn(
              'absolute left-full bottom-0 ml-3 px-2.5 py-1.5 rounded-md',
              'bg-black text-white text-[11px] font-medium',
              'opacity-0 invisible pointer-events-none',
              'group-hover:opacity-100 group-hover:visible',
              'transition-opacity duration-100 whitespace-nowrap shadow-lg z-50'
            )}>
              Property Manager
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
