# Skeleton Components - Quick Reference Card

## Import

```tsx
import { ComponentName } from '@/components/ui/skeletons'
```

## Most Common Use Cases

### Properties Page
```tsx
import { StatsSkeletonGrid, PropertyCardSkeletonGrid } from '@/components/ui/skeletons'

if (isLoading) {
  return (
    <>
      <StatsSkeletonGrid count={4} />
      <PropertyCardSkeletonGrid count={6} />
    </>
  )
}
```

### Table Pages (Tenants, Leases)
```tsx
import { TableSkeleton } from '@/components/ui/skeletons'

if (isLoading) return <TableSkeleton rows={8} columns={6} hasCheckbox hasActions />
```

### Detail Pages
```tsx
import { DetailPageSkeleton } from '@/components/ui/skeletons'

if (isLoading) return <DetailPageSkeleton />
```

### Forms
```tsx
import { FormSkeleton } from '@/components/ui/skeletons'

if (isLoading) return <FormSkeleton fields={5} />
```

### Lists
```tsx
import { ListSkeleton } from '@/components/ui/skeletons'

if (isLoading) return <ListSkeleton items={5} />
```

## All Components at a Glance

| Component | Use For | Props |
|-----------|---------|-------|
| **Base Components** |
| `Skeleton` | Basic shapes | `className`, `variant` |
| `SkeletonText` | Text lines | `lines`, `lastLineWidth` |
| `SkeletonAvatar` | Avatars | `size` (sm/md/lg/xl) |
| `SkeletonCard` | Generic cards | `hasImage`, `imageHeight`, `contentLines` |
| **Property Components** |
| `PropertyCardSkeleton` | Single property card | `className` |
| `PropertyCardSkeletonGrid` | Property grid | `count`, `className` |
| **Stats Components** |
| `StatCardSkeleton` | Single stat card | `className` |
| `StatsSkeletonGrid` | Stats grid | `count` (default: 4) |
| **Table Components** |
| `TableSkeleton` | Data tables | `rows`, `columns`, `hasCheckbox`, `hasActions` |
| `TableWithAvatarSkeleton` | User/tenant tables | `rows`, `columns` |
| **Form Components** |
| `FormSkeleton` | Forms | `fields`, `hasTitle`, `hasSubmitButton` |
| `SearchFormSkeleton` | Search bars | `className` |
| **List Components** |
| `ListSkeleton` | Lists | `items`, `className` |
| `ActivityFeedSkeleton` | Activity feeds | `items` |
| **Page Components** |
| `DashboardPageSkeleton` | Dashboard pages | `className` |
| `TablePageSkeleton` | Table pages | `className` |
| `DetailPageSkeleton` | Detail pages | `className` |

## Component Props

### PropertyCardSkeletonGrid
```tsx
count?: number        // Default: 6
className?: string
```

### StatsSkeletonGrid
```tsx
count?: number        // Default: 4
className?: string
```

### TableSkeleton
```tsx
rows?: number         // Default: 5
columns?: number      // Default: 5
hasCheckbox?: boolean // Default: false
hasActions?: boolean  // Default: false
className?: string
```

### FormSkeleton
```tsx
fields?: number              // Default: 5
hasTitle?: boolean           // Default: true
hasSubmitButton?: boolean    // Default: true
className?: string
```

### ListSkeleton
```tsx
items?: number        // Default: 5
className?: string
```

## Pattern Library

### Loading States
```tsx
// Simple
if (isLoading) return <PropertyCardSkeletonGrid count={6} />

// With data check
if (isLoading || !data) return <PropertyCardSkeletonGrid count={6} />

// Separate sections
{isLoadingStats ? <StatsSkeletonGrid /> : <Stats />}
{isLoadingCards ? <PropertyCardSkeletonGrid /> : <Cards />}
```

### With Error Handling
```tsx
if (isLoading) return <PropertyCardSkeletonGrid count={6} />
if (error) return <ErrorMessage />
if (!data) return <EmptyState />
return <PropertyList data={data} />
```

### Minimum Display Time
```tsx
const [showSkeleton, setShowSkeleton] = useState(true)

useEffect(() => {
  if (!isLoading) {
    setTimeout(() => setShowSkeleton(false), 300)
  }
}, [isLoading])

if (showSkeleton) return <PropertyCardSkeletonGrid />
```

### Progressive Loading
```tsx
<>
  {isLoadingHeader ? <PageHeaderSkeleton /> : <Header />}
  {isLoadingStats ? <StatsSkeletonGrid /> : <Stats />}
  {isLoadingCards ? <PropertyCardSkeletonGrid /> : <Cards />}
</>
```

## Custom Skeletons

### Compose Base Components
```tsx
import { Skeleton, SkeletonAvatar } from '@/components/ui/skeletons'

function CustomSkeleton() {
  return (
    <div className="flex gap-3 p-4 border rounded">
      <SkeletonAvatar size="lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <Skeleton className="h-8 w-8 rounded" />
    </div>
  )
}
```

## Common Variants

### Different Sizes
```tsx
// Small
<PropertyCardSkeletonGrid count={3} />

// Medium
<PropertyCardSkeletonGrid count={6} />

// Large
<PropertyCardSkeletonGrid count={12} />
```

### Responsive Grids
```tsx
// Grid automatically adjusts:
// Mobile: 1 column
// Tablet (sm): 2 columns
// Desktop (lg): 3 columns
<PropertyCardSkeletonGrid count={6} />
```

### Custom Styling
```tsx
// Add custom classes
<PropertyCardSkeletonGrid
  count={6}
  className="gap-6 lg:grid-cols-4"
/>

// Dark mode
<Skeleton className="bg-gray-700" />

// Different color
<Skeleton className="bg-blue-200" />
```

## Tips

1. **Match Count**: Use realistic counts (6 for properties, 5 for lists, etc.)
2. **Show Early**: Display skeleton immediately when loading starts
3. **Minimum Time**: Keep visible for at least 300ms to avoid flash
4. **Match Layout**: Ensure skeleton matches actual component dimensions
5. **Responsive**: All skeletons are mobile-responsive by default

## Debugging

### View All Skeletons
Add route to showcase component:
```tsx
// app/skeleton-showcase/page.tsx
import SkeletonShowcase from '@/components/ui/skeletons/skeleton-showcase'
export default SkeletonShowcase
```

### Force Loading State
```tsx
const [debug, setDebug] = useState(true)
if (debug) return <PropertyCardSkeletonGrid count={6} />
```

### Check Dimensions
```tsx
// Compare real vs skeleton
<div className="flex gap-4">
  <PropertyCard {...realProps} />
  <PropertyCardSkeleton />
</div>
```

## Documentation

- **Full API**: `src/components/ui/skeletons/README.md`
- **Integration Guide**: `/SKELETON_INTEGRATION_EXAMPLE.md`
- **Summary**: `/SKELETON_COMPONENTS_SUMMARY.md`
- **This Card**: `src/components/ui/skeletons/QUICK_REFERENCE.md`

## Support

For issues or questions:
1. Check README.md for detailed API docs
2. View skeleton-showcase.tsx for visual examples
3. See SKELETON_INTEGRATION_EXAMPLE.md for patterns
4. Review existing implementations in codebase

---

**Quick Links:**
- [README.md](./README.md) - Full documentation
- [skeleton-showcase.tsx](./skeleton-showcase.tsx) - Visual demo
- [SKELETON_INTEGRATION_EXAMPLE.md](/SKELETON_INTEGRATION_EXAMPLE.md) - Integration examples

**Pro Tip:** Import from single location: `@/components/ui/skeletons` 🚀
