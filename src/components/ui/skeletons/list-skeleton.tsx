import * as React from 'react'
import { Skeleton, SkeletonAvatar } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface ListSkeletonProps {
  items?: number
  className?: string
}

/**
 * Simple list item skeleton
 */
export function ListItemSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-3 p-4 border-b border-black/[0.08]', className)}>
      <SkeletonAvatar size="md" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-8 w-8 rounded" />
    </div>
  )
}

/**
 * List skeleton with multiple items
 */
export function ListSkeleton({ items = 5, className }: ListSkeletonProps) {
  return (
    <div className={cn('rounded-lg border border-black/[0.08] bg-white divide-y divide-black/[0.08]', className)}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center gap-3 p-4">
          <SkeletonAvatar size="md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-16 rounded" />
        </div>
      ))}
    </div>
  )
}

/**
 * Compact list skeleton
 */
export function CompactListSkeleton({ items = 5, className }: ListSkeletonProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center gap-2 p-2 rounded-lg">
          <Skeleton className="h-6 w-6 rounded" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-12" />
        </div>
      ))}
    </div>
  )
}

/**
 * List with thumbnail skeleton
 */
export function ThumbnailListSkeleton({ items = 5, className }: ListSkeletonProps) {
  return (
    <div className={cn('rounded-lg border border-black/[0.08] bg-white divide-y divide-black/[0.08]', className)}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center gap-3 p-4">
          <Skeleton className="h-16 w-16 rounded" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-2/3" />
          </div>
          <div className="flex flex-col gap-1">
            <Skeleton className="h-6 w-6 rounded ml-auto" />
            <Skeleton className="h-6 w-6 rounded ml-auto" />
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Activity feed / timeline skeleton
 */
export function ActivityFeedSkeleton({ items = 5, className }: ListSkeletonProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex gap-3">
          <SkeletonAvatar size="sm" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      ))}
    </div>
  )
}
