'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface StatItem {
  label: string
  value: string | number
  icon?: React.ReactNode
  color?: 'blue' | 'green' | 'amber' | 'red' | 'purple' | 'emerald'
  subtext?: string
}

interface ResponsiveStatsProps {
  stats: StatItem[]
  className?: string
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-600',
    value: 'text-black',
  },
  green: {
    bg: 'bg-green-500/10',
    text: 'text-green-600',
    value: 'text-green-600',
  },
  amber: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-600',
    value: 'text-black',
  },
  red: {
    bg: 'bg-red-500/10',
    text: 'text-red-600',
    value: 'text-red-600',
  },
  purple: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-600',
    value: 'text-black',
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-600',
    value: 'text-black',
  },
}

/**
 * Responsive stats component that switches between:
 * - Mobile (< sm): 2-column grid
 * - Tablet (sm-lg): Horizontal scroll
 * - Desktop (lg+): Inline flex with dividers
 */
export function ResponsiveStats({ stats, className }: ResponsiveStatsProps) {
  return (
    <div className={cn('mb-4 pb-4 border-b border-black/[0.06]', className)}>
      {/* Mobile: 2-column grid */}
      <div className="grid grid-cols-2 gap-3 sm:hidden">
        {stats.map((stat, index) => {
          const colors = colorClasses[stat.color || 'blue']
          return (
            <div
              key={index}
              className="flex items-center gap-2 p-3 rounded-lg bg-black/[0.02]"
            >
              {stat.icon && (
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', colors.bg)}>
                  <span className={colors.text}>{stat.icon}</span>
                </div>
              )}
              <div className="min-w-0">
                <div className={cn('text-lg font-semibold truncate', colors.value)}>
                  {stat.value}
                </div>
                <div className="text-[10px] text-black/50 truncate">{stat.label}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Tablet: Horizontal scroll */}
      <div className="hidden sm:flex lg:hidden overflow-x-auto gap-4 pb-2 -mb-2 scrollbar-hide">
        {stats.map((stat, index) => {
          const colors = colorClasses[stat.color || 'blue']
          return (
            <div key={index} className="flex items-center gap-3 flex-shrink-0">
              {stat.icon && (
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', colors.bg)}>
                  <span className={colors.text}>{stat.icon}</span>
                </div>
              )}
              <div>
                <div className={cn('text-xl font-semibold', colors.value)}>{stat.value}</div>
                <div className="text-[11px] text-black/50">{stat.label}</div>
              </div>
              {index < stats.length - 1 && (
                <div className="w-px h-8 bg-black/10 ml-4" />
              )}
            </div>
          )
        })}
      </div>

      {/* Desktop: Inline flex with dividers */}
      <div className="hidden lg:flex flex-wrap items-center gap-6">
        {stats.map((stat, index) => {
          const colors = colorClasses[stat.color || 'blue']
          return (
            <React.Fragment key={index}>
              <div className="flex items-center gap-3">
                {stat.icon && (
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', colors.bg)}>
                    <span className={colors.text}>{stat.icon}</span>
                  </div>
                )}
                <div>
                  <div className={cn('text-xl font-semibold', colors.value)}>{stat.value}</div>
                  <div className="text-[11px] text-black/50">{stat.label}</div>
                </div>
              </div>
              {index < stats.length - 1 && <div className="w-px h-8 bg-black/10" />}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

/**
 * Compact stat badge for inline use
 */
export function StatBadge({
  label,
  value,
  color = 'blue',
  className,
}: {
  label: string
  value: string | number
  color?: 'blue' | 'green' | 'amber' | 'red' | 'purple' | 'emerald'
  className?: string
}) {
  const colors = colorClasses[color]
  return (
    <div className={cn('flex items-center gap-2 px-3 py-1.5 rounded-full', colors.bg, className)}>
      <span className={cn('text-sm font-medium', colors.value)}>{value}</span>
      <span className="text-xs text-black/50">{label}</span>
    </div>
  )
}
