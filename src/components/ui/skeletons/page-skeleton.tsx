import * as React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { StatsSkeletonGrid } from './stats-skeleton'
import { PropertyCardSkeletonGrid } from './property-card-skeleton'
import { TableSkeleton } from './table-skeleton'
import { cn } from '@/lib/utils'

interface PageSkeletonProps {
  className?: string
}

/**
 * Full page skeleton with header
 */
export function PageHeaderSkeleton({ className }: PageSkeletonProps) {
  return (
    <div className={cn('flex items-center justify-between mb-6', className)}>
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-10 w-32 rounded" />
        <Skeleton className="h-10 w-32 rounded" />
      </div>
    </div>
  )
}

/**
 * Dashboard page skeleton (like properties page)
 */
export function DashboardPageSkeleton({ className }: PageSkeletonProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Page Header */}
      <PageHeaderSkeleton />

      {/* Stats Cards */}
      <StatsSkeletonGrid count={4} />

      {/* Property Grid */}
      <PropertyCardSkeletonGrid count={6} />
    </div>
  )
}

/**
 * Table page skeleton (like leases, tenants)
 */
export function TablePageSkeleton({ className }: PageSkeletonProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Page Header */}
      <PageHeaderSkeleton />

      {/* Filters/Search */}
      <div className="flex gap-2">
        <Skeleton className="h-10 flex-1 rounded" />
        <Skeleton className="h-10 w-32 rounded" />
        <Skeleton className="h-10 w-32 rounded" />
      </div>

      {/* Table */}
      <TableSkeleton rows={8} columns={6} hasCheckbox hasActions />
    </div>
  )
}

/**
 * Detail page skeleton (like property detail)
 */
export function DetailPageSkeleton({ className }: PageSkeletonProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Back button and title */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-8 w-8 rounded" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-24 rounded" />
      </div>

      {/* Image and main content */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Main content area */}
        <div className="md:col-span-2 space-y-6">
          <Skeleton className="h-64 w-full rounded-lg" />

          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-32" />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="rounded-lg border border-black/[0.08] bg-white p-4 space-y-4">
            <Skeleton className="h-5 w-24" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Analytics/Reports page skeleton
 */
export function AnalyticsPageSkeleton({ className }: PageSkeletonProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Page Header */}
      <PageHeaderSkeleton />

      {/* Date range selector */}
      <div className="flex gap-2">
        <Skeleton className="h-10 w-48 rounded" />
        <Skeleton className="h-10 w-48 rounded" />
        <Skeleton className="h-10 w-32 rounded" />
      </div>

      {/* Key metrics */}
      <StatsSkeletonGrid count={4} />

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-black/[0.08] bg-white p-6 space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="rounded-lg border border-black/[0.08] bg-white p-6 space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  )
}

/**
 * Settings page skeleton
 */
export function SettingsPageSkeleton({ className }: PageSkeletonProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Page Header */}
      <div className="space-y-2 mb-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Settings sections */}
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="rounded-lg border border-black/[0.08] bg-white p-6 space-y-4">
          <Skeleton className="h-6 w-40" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-10 w-20 rounded" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
