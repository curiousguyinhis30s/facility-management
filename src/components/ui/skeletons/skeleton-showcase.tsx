'use client'

import * as React from 'react'
import {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonCard,
  PropertyCardSkeleton,
  PropertyCardSkeletonGrid,
  StatCardSkeleton,
  StatsSkeletonGrid,
  TableSkeleton,
  FormSkeleton,
  ListSkeleton,
  DashboardPageSkeleton,
} from './index'

/**
 * Skeleton Showcase Component
 *
 * This component demonstrates all available skeleton variants.
 * Use this as a reference for implementing loading states in your pages.
 *
 * To view: Add a route to this component in your app router
 * Example: /app/skeleton-showcase/page.tsx
 */
export function SkeletonShowcase() {
  return (
    <div className="min-h-screen bg-black/[0.02] p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-black">Skeleton Components Showcase</h1>
          <p className="text-black/70">
            A comprehensive collection of loading skeleton components for FacilityPro
          </p>
        </div>

        {/* Base Components */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-black">Base Components</h2>

          <div className="bg-white rounded-lg border p-6 space-y-6">
            <div>
              <h3 className="text-sm font-medium text-black/70 mb-3">Basic Skeleton</h3>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-black/70 mb-3">Skeleton Text</h3>
              <SkeletonText lines={4} />
            </div>

            <div>
              <h3 className="text-sm font-medium text-black/70 mb-3">Skeleton Avatars</h3>
              <div className="flex items-center gap-4">
                <SkeletonAvatar size="sm" />
                <SkeletonAvatar size="md" />
                <SkeletonAvatar size="lg" />
                <SkeletonAvatar size="xl" />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-black/70 mb-3">Skeleton Card</h3>
              <SkeletonCard hasImage imageHeight="h-48" contentLines={3} />
            </div>
          </div>
        </section>

        {/* Property Components */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-black">Property Components</h2>

          <div className="bg-white rounded-lg border p-6 space-y-6">
            <div>
              <h3 className="text-sm font-medium text-black/70 mb-3">Single Property Card</h3>
              <div className="max-w-sm">
                <PropertyCardSkeleton />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-black/70 mb-3">Property Card Grid (3 cards)</h3>
              <PropertyCardSkeletonGrid count={3} />
            </div>
          </div>
        </section>

        {/* Stats Components */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-black">Stats Components</h2>

          <div className="bg-white rounded-lg border p-6 space-y-6">
            <div>
              <h3 className="text-sm font-medium text-black/70 mb-3">Single Stat Card</h3>
              <div className="max-w-xs">
                <StatCardSkeleton />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-black/70 mb-3">Stats Grid (4 cards)</h3>
              <StatsSkeletonGrid count={4} />
            </div>
          </div>
        </section>

        {/* Table Components */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-black">Table Components</h2>

          <div className="bg-white rounded-lg border p-6 space-y-6">
            <div>
              <h3 className="text-sm font-medium text-black/70 mb-3">Basic Table (5 rows, 5 columns)</h3>
              <TableSkeleton rows={5} columns={5} />
            </div>

            <div>
              <h3 className="text-sm font-medium text-black/70 mb-3">Table with Checkboxes and Actions</h3>
              <TableSkeleton rows={5} columns={5} hasCheckbox hasActions />
            </div>
          </div>
        </section>

        {/* Form Components */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-black">Form Components</h2>

          <div className="bg-white rounded-lg border p-6 space-y-6">
            <div>
              <h3 className="text-sm font-medium text-black/70 mb-3">Form Skeleton</h3>
              <FormSkeleton fields={5} />
            </div>
          </div>
        </section>

        {/* List Components */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-black">List Components</h2>

          <div className="bg-white rounded-lg border p-6 space-y-6">
            <div>
              <h3 className="text-sm font-medium text-black/70 mb-3">List Skeleton</h3>
              <ListSkeleton items={3} />
            </div>
          </div>
        </section>

        {/* Full Page Examples */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-black">Full Page Examples</h2>

          <div className="bg-white rounded-lg border p-6">
            <div>
              <h3 className="text-sm font-medium text-black/70 mb-3">Dashboard Page Skeleton</h3>
              <div className="border rounded-lg p-4 bg-black/[0.02]">
                <DashboardPageSkeleton />
              </div>
            </div>
          </div>
        </section>

        {/* Usage Examples */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-black">Usage Examples</h2>

          <div className="bg-white rounded-lg border p-6 space-y-4">
            <div className="bg-black text-white/90 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm">
{`// Import the skeleton you need
import { PropertyCardSkeletonGrid } from '@/components/ui/skeletons'

// Use in your component
export default function PropertiesPage() {
  const [isLoading, setIsLoading] = useState(true)

  if (isLoading) {
    return <PropertyCardSkeletonGrid count={6} />
  }

  return <PropertyList properties={properties} />
}`}
              </pre>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-black">Tips:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-black/70">
                <li>Match skeleton dimensions to your actual components</li>
                <li>Use appropriate variants for different content types</li>
                <li>Show skeletons as soon as loading starts</li>
                <li>Keep skeletons visible for at least 300ms to avoid flash</li>
                <li>All skeletons are responsive by default</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center text-sm text-black/50 pt-8 border-t">
          <p>
            See <code className="bg-black/[0.04] px-2 py-1 rounded">src/components/ui/skeletons/README.md</code> for complete documentation
          </p>
        </div>
      </div>
    </div>
  )
}

export default SkeletonShowcase
