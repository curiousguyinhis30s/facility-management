import * as React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatsSkeletonProps {
  count?: number
  className?: string
}

/**
 * Skeleton loader for stat cards on the properties page
 * Matches the exact layout from properties/page.tsx stats dashboard
 */
export function StatCardSkeleton({ className }: Omit<StatsSkeletonProps, 'count'>) {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        {/* Label - "Total Properties", "Occupancy Rate", etc. */}
        <Skeleton className="h-4 w-28 mb-2" />

        {/* Main Value - Large number */}
        <Skeleton className="h-9 w-20 mb-1" />

        {/* Subtext - "45 total units", "Available to rent", etc. */}
        <Skeleton className="h-3 w-24" />
      </CardContent>
    </Card>
  )
}

/**
 * Grid of stat card skeletons
 * Matches the grid layout from properties page: sm:grid-cols-2 lg:grid-cols-4
 */
export function StatsSkeletonGrid({ count = 4, className }: StatsSkeletonProps) {
  return (
    <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-4', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <StatCardSkeleton key={index} />
      ))}
    </div>
  )
}

/**
 * Alternative stat card skeleton with icon placeholder
 */
export function StatCardWithIconSkeleton({ className }: Omit<StatsSkeletonProps, 'count'>) {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Skeleton className="h-4 w-28 mb-2" />
            <Skeleton className="h-9 w-20 mb-1" />
            <Skeleton className="h-3 w-24" />
          </div>
          {/* Icon placeholder */}
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Compact stat card skeleton for dashboard widgets
 */
export function CompactStatCardSkeleton({ className }: Omit<StatsSkeletonProps, 'count'>) {
  return (
    <Card className={className}>
      <CardContent className="p-4">
        <Skeleton className="h-3 w-20 mb-2" />
        <Skeleton className="h-7 w-16 mb-1" />
        <Skeleton className="h-3 w-16" />
      </CardContent>
    </Card>
  )
}

/**
 * Stat card skeleton with trend indicator
 */
export function StatCardWithTrendSkeleton({ className }: Omit<StatsSkeletonProps, 'count'>) {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-2">
          <Skeleton className="h-4 w-28" />
          {/* Trend badge */}
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-9 w-20 mb-1" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-20" />
        </div>
      </CardContent>
    </Card>
  )
}
