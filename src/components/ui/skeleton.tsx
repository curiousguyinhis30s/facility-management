'use client'

import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('animate-pulse rounded-md bg-black/[0.08]', className)} />
  )
}

// Base skeleton variants for index.tsx exports
export function SkeletonText({ className, lines = 1 }: SkeletonProps & { lines?: number }) {
  if (lines === 1) {
    return <Skeleton className={cn('h-4 w-full', className)} />
  }
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={cn('h-4', i === lines - 1 ? 'w-3/4' : 'w-full')} />
      ))}
    </div>
  )
}

export function SkeletonAvatar({ className, size = 'md' }: SkeletonProps & { size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  }
  return <Skeleton className={cn(sizeClasses[size], 'rounded-full', className)} />
}

interface SkeletonCardProps extends SkeletonProps {
  hasImage?: boolean
  imageHeight?: string
  contentLines?: number
}

export function SkeletonCard({ className, hasImage, imageHeight = 'h-32', contentLines = 2 }: SkeletonCardProps) {
  return (
    <div className={cn('rounded-lg border border-black/[0.08] overflow-hidden', className)}>
      {hasImage && <Skeleton className={cn('w-full', imageHeight)} />}
      <div className="p-4 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        {Array.from({ length: contentLines }).map((_, i) => (
          <Skeleton key={i} className={cn('h-4', i === contentLines - 1 ? 'w-1/2' : 'w-full')} />
        ))}
      </div>
    </div>
  )
}

// Individual stat skeleton
export function StatSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <Skeleton className="w-8 h-8 rounded-lg" />
      <div>
        <Skeleton className="h-6 w-12 mb-1" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  )
}

// Stats row skeleton (matches inline stats pattern)
export function StatsRowSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex flex-wrap items-center gap-6 mb-4 pb-4 border-b border-black/[0.06]">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          {i > 0 && <div className="w-px h-8 bg-black/10 -ml-3 mr-0" />}
          <Skeleton className="w-8 h-8 rounded-lg" />
          <div>
            <Skeleton className="h-6 w-12 mb-1" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      ))}
    </div>
  )
}

// Table skeleton
export function TableSkeleton({ rows = 5, columns = 6 }: { rows?: number; columns?: number }) {
  return (
    <div className="border border-black/[0.08] rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-3 bg-black/[0.02] border-b border-black/[0.08]">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="flex items-center gap-4 px-4 py-3 border-b border-black/[0.06] last:border-0"
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              className={cn(
                "h-4 flex-1",
                colIndex === 0 && "max-w-[200px]"
              )}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

// Card skeleton
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("border border-black/[0.08] rounded-lg p-4", className)}>
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <div className="flex-1">
          <Skeleton className="h-5 w-32 mb-1" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  )
}

// Activity list skeleton
export function ActivitySkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-black/[0.02]">
          <Skeleton className="w-8 h-8 rounded-lg flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <Skeleton className="h-4 w-32 mb-1" />
            <Skeleton className="h-3 w-48" />
          </div>
          <Skeleton className="h-3 w-16 flex-shrink-0" />
        </div>
      ))}
    </div>
  )
}

// Full page loading skeleton
export function PageLoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
      {/* Stats row */}
      <StatsRowSkeleton count={4} />
      {/* Table */}
      <TableSkeleton rows={8} columns={5} />
    </div>
  )
}

// Dashboard specific skeleton
export function DashboardLoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-48" />
      </div>
      {/* Stats row */}
      <StatsRowSkeleton count={5} />
      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Skeleton className="h-6 w-32 mb-4" />
          <ActivitySkeleton count={5} />
        </div>
        <div>
          <Skeleton className="h-6 w-24 mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Property card skeleton
export function PropertyCardSkeleton() {
  return (
    <div className="border border-black/[0.08] rounded-xl p-4 bg-white">
      <div className="flex items-start gap-3 mb-4">
        <Skeleton className="w-12 h-12 rounded-lg" />
        <div className="flex-1">
          <Skeleton className="h-5 w-40 mb-1" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Skeleton className="h-3 w-12 mb-1" />
          <Skeleton className="h-5 w-8" />
        </div>
        <div>
          <Skeleton className="h-3 w-16 mb-1" />
          <Skeleton className="h-5 w-10" />
        </div>
        <div>
          <Skeleton className="h-3 w-14 mb-1" />
          <Skeleton className="h-5 w-16" />
        </div>
      </div>
    </div>
  )
}

// Property grid skeleton
export function PropertyGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  )
}
