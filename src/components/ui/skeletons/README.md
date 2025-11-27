# Skeleton Loading Components

Comprehensive skeleton loading components for the FacilityPro application. These components provide visual feedback during data loading operations, improving perceived performance and user experience.

## Features

- 🎨 **Matches Real Components**: Skeleton layouts exactly match the dimensions and structure of actual components
- ⚡ **Reusable & Composable**: Mix and match base components to create custom skeletons
- 🎭 **Multiple Variants**: Covers common patterns (cards, tables, forms, lists, pages)
- 📱 **Responsive**: All skeletons adapt to different screen sizes
- 🔧 **Customizable**: Easy to extend and modify via className prop

## Installation

All skeleton components are already integrated. Simply import what you need:

```tsx
import { PropertyCardSkeletonGrid, StatsSkeletonGrid, TableSkeleton } from '@/components/ui/skeletons'
```

## Base Components

### Skeleton

The fundamental building block. All other skeletons use this component.

```tsx
import { Skeleton } from '@/components/ui/skeletons'

// Basic rectangle
<Skeleton className="h-4 w-32" />

// Text line
<Skeleton variant="text" className="w-full" />

// Avatar/Circle
<Skeleton variant="avatar" className="h-10 w-10" />
```

### SkeletonText

Multi-line text skeleton with configurable lines and width.

```tsx
import { SkeletonText } from '@/components/ui/skeletons'

// 3 lines of text (default)
<SkeletonText />

// 5 lines with custom last line width
<SkeletonText lines={5} lastLineWidth="w-1/2" />
```

### SkeletonAvatar

Avatar skeleton with size variants.

```tsx
import { SkeletonAvatar } from '@/components/ui/skeletons'

<SkeletonAvatar size="sm" />  // 8x8
<SkeletonAvatar size="md" />  // 10x10 (default)
<SkeletonAvatar size="lg" />  // 12x12
<SkeletonAvatar size="xl" />  // 16x16
```

### SkeletonCard

Generic card skeleton with image, header, and content.

```tsx
import { SkeletonCard } from '@/components/ui/skeletons'

<SkeletonCard
  hasImage={true}
  imageHeight="h-48"
  hasHeader={true}
  contentLines={3}
/>
```

## Property Components

### PropertyCardSkeleton

Matches the `PropertyCardOptimized` component exactly.

```tsx
import { PropertyCardSkeleton } from '@/components/ui/skeletons'

<PropertyCardSkeleton />
```

### PropertyCardSkeletonGrid

Grid of property cards (matches properties page layout).

```tsx
import { PropertyCardSkeletonGrid } from '@/components/ui/skeletons'

// 6 cards in responsive grid
<PropertyCardSkeletonGrid count={6} />

// Custom count
<PropertyCardSkeletonGrid count={9} />
```

**Usage Example:**

```tsx
export default function PropertiesPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [properties, setProperties] = useState([])

  if (isLoading) {
    return <PropertyCardSkeletonGrid count={6} />
  }

  return <PropertyList properties={properties} />
}
```

## Stats Components

### StatCardSkeleton

Single stat card skeleton (for dashboard metrics).

```tsx
import { StatCardSkeleton } from '@/components/ui/skeletons'

<StatCardSkeleton />
```

### StatsSkeletonGrid

Grid of stat cards (matches properties page stats).

```tsx
import { StatsSkeletonGrid } from '@/components/ui/skeletons'

// 4 cards (default - matches properties page)
<StatsSkeletonGrid count={4} />

// Custom count
<StatsSkeletonGrid count={3} />
```

### Stat Card Variants

```tsx
import {
  StatCardWithIconSkeleton,
  CompactStatCardSkeleton,
  StatCardWithTrendSkeleton
} from '@/components/ui/skeletons'

// With icon placeholder
<StatCardWithIconSkeleton />

// Compact version
<CompactStatCardSkeleton />

// With trend indicator
<StatCardWithTrendSkeleton />
```

## Table Components

### TableSkeleton

Full-featured table skeleton with customizable rows, columns, and features.

```tsx
import { TableSkeleton } from '@/components/ui/skeletons'

// Basic table
<TableSkeleton rows={5} columns={5} />

// With checkboxes and actions
<TableSkeleton
  rows={8}
  columns={6}
  hasCheckbox={true}
  hasActions={true}
/>
```

### Table Variants

```tsx
import {
  CompactTableSkeleton,
  ExpandableTableSkeleton,
  MinimalTableSkeleton,
  TableWithAvatarSkeleton
} from '@/components/ui/skeletons'

// Compact version
<CompactTableSkeleton rows={5} columns={4} />

// With expand/collapse indicators
<ExpandableTableSkeleton rows={5} columns={5} />

// Minimal (no border, no header)
<MinimalTableSkeleton rows={3} columns={3} />

// With avatar column (for user/tenant lists)
<TableWithAvatarSkeleton rows={5} columns={4} />
```

## Form Components

### FormSkeleton

Generic form skeleton with configurable fields.

```tsx
import { FormSkeleton } from '@/components/ui/skeletons'

// Basic form
<FormSkeleton
  fields={5}
  hasTitle={true}
  hasSubmitButton={true}
/>
```

### Form Variants

```tsx
import {
  FormFieldSkeleton,
  TwoColumnFormSkeleton,
  SearchFormSkeleton
} from '@/components/ui/skeletons'

// Single field
<FormFieldSkeleton />

// Two-column layout
<TwoColumnFormSkeleton fields={6} />

// Search bar
<SearchFormSkeleton />
```

## List Components

### ListSkeleton

List of items with avatar, text, and actions.

```tsx
import { ListSkeleton } from '@/components/ui/skeletons'

<ListSkeleton items={5} />
```

### List Variants

```tsx
import {
  ListItemSkeleton,
  CompactListSkeleton,
  ThumbnailListSkeleton,
  ActivityFeedSkeleton
} from '@/components/ui/skeletons'

// Single list item
<ListItemSkeleton />

// Compact list
<CompactListSkeleton items={5} />

// With thumbnails
<ThumbnailListSkeleton items={5} />

// Activity/timeline feed
<ActivityFeedSkeleton items={5} />
```

## Page Components

### Full Page Skeletons

Complete page layouts for common page types.

```tsx
import {
  DashboardPageSkeleton,
  TablePageSkeleton,
  DetailPageSkeleton,
  AnalyticsPageSkeleton,
  SettingsPageSkeleton
} from '@/components/ui/skeletons'

// Dashboard (stats + cards)
<DashboardPageSkeleton />

// Table listing page
<TablePageSkeleton />

// Detail page with sidebar
<DetailPageSkeleton />

// Analytics/Reports page
<AnalyticsPageSkeleton />

// Settings page
<SettingsPageSkeleton />
```

### PageHeaderSkeleton

Page header with title and actions.

```tsx
import { PageHeaderSkeleton } from '@/components/ui/skeletons'

<PageHeaderSkeleton />
```

## Real-World Examples

### Properties Page Loading

```tsx
'use client'

import { DashboardPageSkeleton } from '@/components/ui/skeletons'
import { PropertyListOptimized } from '@/components/features/properties/property-list-optimized'

export default function PropertiesPage() {
  const { properties, isLoading } = useData()

  if (isLoading) {
    return <DashboardPageSkeleton />
  }

  return (
    <DashboardLayout title="Properties">
      {/* Stats and property list */}
    </DashboardLayout>
  )
}
```

### Tenants Table Loading

```tsx
'use client'

import { TablePageSkeleton } from '@/components/ui/skeletons'

export default function TenantsPage() {
  const { tenants, isLoading } = useTenants()

  if (isLoading) {
    return <TablePageSkeleton />
  }

  return (
    <DashboardLayout title="Tenants">
      <Table data={tenants} />
    </DashboardLayout>
  )
}
```

### Property Detail Loading

```tsx
'use client'

import { DetailPageSkeleton } from '@/components/ui/skeletons'

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const { property, isLoading } = useProperty(params.id)

  if (isLoading) {
    return <DetailPageSkeleton />
  }

  return (
    <DashboardLayout title={property.name}>
      {/* Property details */}
    </DashboardLayout>
  )
}
```

### Custom Composition

Create custom skeletons by combining base components:

```tsx
import { Skeleton, SkeletonAvatar } from '@/components/ui/skeletons'

function CustomWorkOrderSkeleton() {
  return (
    <div className="border rounded-lg p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SkeletonAvatar size="md" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      {/* Content */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t">
        <Skeleton className="h-4 w-24" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-16 rounded" />
          <Skeleton className="h-8 w-16 rounded" />
        </div>
      </div>
    </div>
  )
}
```

## Best Practices

1. **Match Exact Dimensions**: Always ensure skeletons match the actual component's layout
2. **Use Appropriate Variants**: Choose the skeleton that best matches your use case
3. **Show Early**: Display skeletons as soon as loading starts
4. **Smooth Transitions**: Use `animate-pulse` (built-in) for smooth loading effect
5. **Consistent Timing**: Keep skeleton visible for at least 300ms to avoid flash
6. **Mobile Responsive**: All skeletons are responsive by default

## Styling

All skeletons use Tailwind classes and can be customized:

```tsx
// Custom colors
<Skeleton className="bg-blue-200" />

// Custom animation
<Skeleton className="animate-pulse-slow" />

// Custom sizes
<PropertyCardSkeleton className="h-96" />

// Dark mode support (add to your tailwind.config)
<Skeleton className="bg-gray-200 dark:bg-gray-700" />
```

## Animation

All skeletons use Tailwind's `animate-pulse` utility by default. To customize:

```css
/* In your globals.css or tailwind.config.js */
@keyframes pulse-slow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.animate-pulse-slow {
  animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

## Accessibility

Skeletons improve accessibility by:
- Providing visual feedback during loading
- Preventing layout shift when content loads
- Setting user expectations about page structure

Consider adding ARIA labels for screen readers:

```tsx
<div role="status" aria-label="Loading properties">
  <PropertyCardSkeletonGrid count={6} />
</div>
```

## Performance

Skeleton components are lightweight and optimized:
- Use CSS animations (GPU accelerated)
- No JavaScript logic during animation
- Minimal re-renders
- Small bundle size impact

## Browser Support

Works on all modern browsers with Tailwind CSS support:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers

## Contributing

To add new skeleton variants:

1. Create component in appropriate file
2. Follow naming convention: `[Component]Skeleton`
3. Match exact layout of target component
4. Export from `index.tsx`
5. Document in this README

## License

Part of FacilityPro application.
