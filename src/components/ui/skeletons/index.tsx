/**
 * Skeleton Loading Components
 *
 * Centralized export for all skeleton loading components used throughout the application.
 * These components provide visual feedback during data loading operations.
 *
 * Usage:
 * ```tsx
 * import { PropertyCardSkeletonGrid, StatsSkeletonGrid, TableSkeleton } from '@/components/ui/skeletons'
 *
 * // Loading state
 * if (isLoading) return <PropertyCardSkeletonGrid count={6} />
 * ```
 */

// Base skeleton components
export {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonCard,
} from '../skeleton'

// Property card skeletons
export {
  PropertyCardSkeleton,
  PropertyCardSkeletonGrid,
  PropertyCardSkeletonItem,
} from './property-card-skeleton'

// Stats card skeletons
export {
  StatCardSkeleton,
  StatsSkeletonGrid,
  StatCardWithIconSkeleton,
  CompactStatCardSkeleton,
  StatCardWithTrendSkeleton,
} from './stats-skeleton'

// Table skeletons
export {
  TableSkeleton,
  CompactTableSkeleton,
  ExpandableTableSkeleton,
  MinimalTableSkeleton,
  TableWithAvatarSkeleton,
} from './table-skeleton'

// Form skeletons
export {
  FormSkeleton,
  FormFieldSkeleton,
  TwoColumnFormSkeleton,
  SearchFormSkeleton,
} from './form-skeleton'

// List skeletons
export {
  ListItemSkeleton,
  ListSkeleton,
  CompactListSkeleton,
  ThumbnailListSkeleton,
  ActivityFeedSkeleton,
} from './list-skeleton'

// Page skeletons
export {
  PageHeaderSkeleton,
  DashboardPageSkeleton,
  TablePageSkeleton,
  DetailPageSkeleton,
  AnalyticsPageSkeleton,
  SettingsPageSkeleton,
} from './page-skeleton'
