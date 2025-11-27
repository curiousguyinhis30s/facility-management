'use client'

import { cn } from '@/lib/utils'
import { Button } from './button'
import Link from 'next/link'

interface EmptyStateProps {
  icon?: 'properties' | 'tenants' | 'leases' | 'payments' | 'work-orders' | 'search' | 'generic'
  title: string
  description: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
  secondaryAction?: {
    label: string
    href?: string
    onClick?: () => void
  }
  className?: string
}

// Custom illustrated icons for empty states
const illustrations = {
  properties: (
    <svg className="w-full h-full" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Building base */}
      <rect x="25" y="30" width="70" height="60" rx="4" fill="currentColor" className="text-black/[0.06]" />
      {/* Building details */}
      <rect x="35" y="40" width="12" height="12" rx="2" fill="currentColor" className="text-blue-500/20" />
      <rect x="54" y="40" width="12" height="12" rx="2" fill="currentColor" className="text-blue-500/20" />
      <rect x="73" y="40" width="12" height="12" rx="2" fill="currentColor" className="text-blue-500/20" />
      <rect x="35" y="58" width="12" height="12" rx="2" fill="currentColor" className="text-blue-500/20" />
      <rect x="54" y="58" width="12" height="12" rx="2" fill="currentColor" className="text-blue-500/20" />
      <rect x="73" y="58" width="12" height="12" rx="2" fill="currentColor" className="text-blue-500/20" />
      {/* Door */}
      <rect x="52" y="75" width="16" height="15" rx="2" fill="currentColor" className="text-blue-500/30" />
      {/* Roof accent */}
      <path d="M20 30 L60 10 L100 30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-blue-500/40" />
      {/* Plus sign */}
      <circle cx="95" cy="25" r="14" fill="currentColor" className="text-blue-500/20" />
      <path d="M95 18 V32 M88 25 H102" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-blue-600" />
    </svg>
  ),
  tenants: (
    <svg className="w-full h-full" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Main person */}
      <circle cx="60" cy="35" r="18" fill="currentColor" className="text-green-500/20" />
      <path d="M35 90 Q35 60 60 60 Q85 60 85 90" fill="currentColor" className="text-green-500/15" />
      {/* Face features */}
      <circle cx="54" cy="32" r="2.5" fill="currentColor" className="text-green-600/50" />
      <circle cx="66" cy="32" r="2.5" fill="currentColor" className="text-green-600/50" />
      <path d="M55 40 Q60 44 65 40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-green-600/50" />
      {/* Plus badge */}
      <circle cx="90" cy="35" r="12" fill="currentColor" className="text-green-500/20" />
      <path d="M90 29 V41 M84 35 H96" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-green-600" />
      {/* Secondary people outlines */}
      <circle cx="25" cy="55" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" className="text-black/10" />
      <circle cx="95" cy="70" r="8" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" className="text-black/10" />
    </svg>
  ),
  leases: (
    <svg className="w-full h-full" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Document */}
      <rect x="30" y="10" width="60" height="80" rx="4" fill="currentColor" className="text-purple-500/10" />
      <rect x="30" y="10" width="60" height="80" rx="4" stroke="currentColor" strokeWidth="2" className="text-purple-500/30" />
      {/* Document lines */}
      <rect x="40" y="25" width="40" height="4" rx="2" fill="currentColor" className="text-purple-500/30" />
      <rect x="40" y="35" width="35" height="3" rx="1.5" fill="currentColor" className="text-black/10" />
      <rect x="40" y="44" width="38" height="3" rx="1.5" fill="currentColor" className="text-black/10" />
      <rect x="40" y="53" width="30" height="3" rx="1.5" fill="currentColor" className="text-black/10" />
      {/* Signature line */}
      <path d="M40 75 Q50 70 60 75 Q70 80 80 72" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-purple-600/50" />
      {/* Stamp/seal */}
      <circle cx="72" cy="65" r="10" fill="currentColor" className="text-purple-500/20" />
      <path d="M68 65 L70 68 L76 62" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600" />
    </svg>
  ),
  payments: (
    <svg className="w-full h-full" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Coins stack */}
      <ellipse cx="45" cy="70" rx="22" ry="8" fill="currentColor" className="text-emerald-500/20" />
      <ellipse cx="45" cy="62" rx="22" ry="8" fill="currentColor" className="text-emerald-500/25" />
      <ellipse cx="45" cy="54" rx="22" ry="8" fill="currentColor" className="text-emerald-500/30" />
      {/* Dollar sign on coin */}
      <text x="45" y="58" textAnchor="middle" className="text-emerald-600 text-[16px] font-bold" fill="currentColor">$</text>
      {/* Bills */}
      <rect x="60" y="25" width="45" height="25" rx="3" fill="currentColor" className="text-emerald-500/15" transform="rotate(-5 82 37)" />
      <rect x="55" y="30" width="45" height="25" rx="3" fill="currentColor" className="text-emerald-500/25" />
      {/* Bill details */}
      <rect x="62" y="38" width="20" height="3" rx="1.5" fill="currentColor" className="text-emerald-600/40" />
      <rect x="62" y="45" width="15" height="2" rx="1" fill="currentColor" className="text-emerald-600/30" />
      {/* Plus */}
      <circle cx="95" cy="65" r="12" fill="currentColor" className="text-emerald-500/20" />
      <path d="M95 59 V71 M89 65 H101" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-emerald-600" />
    </svg>
  ),
  'work-orders': (
    <svg className="w-full h-full" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Wrench */}
      <path d="M25 75 L50 50 Q55 45 60 50 L70 60 Q75 65 70 70 L45 95 Q35 100 25 90 Q20 85 25 75Z" fill="currentColor" className="text-amber-500/20" />
      <circle cx="62" cy="40" r="15" fill="currentColor" className="text-amber-500/15" />
      <path d="M55 40 L62 33 L69 40 L62 47 Z" fill="currentColor" className="text-amber-600/30" />
      {/* Clipboard */}
      <rect x="60" y="20" width="40" height="55" rx="3" fill="currentColor" className="text-black/[0.06]" />
      <rect x="72" y="15" width="16" height="10" rx="2" fill="currentColor" className="text-amber-500/30" />
      {/* Checklist */}
      <rect x="68" y="32" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" className="text-amber-600/50" />
      <path d="M69 35 L71 37 L75 33" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600" />
      <rect x="78" y="34" width="16" height="2" rx="1" fill="currentColor" className="text-black/20" />
      <rect x="68" y="46" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" className="text-amber-600/50" />
      <rect x="78" y="48" width="14" height="2" rx="1" fill="currentColor" className="text-black/20" />
      <rect x="68" y="60" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" className="text-amber-600/50" />
      <rect x="78" y="62" width="12" height="2" rx="1" fill="currentColor" className="text-black/20" />
    </svg>
  ),
  search: (
    <svg className="w-full h-full" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Magnifying glass */}
      <circle cx="50" cy="45" r="25" stroke="currentColor" strokeWidth="4" className="text-black/10" />
      <circle cx="50" cy="45" r="25" fill="currentColor" className="text-black/[0.04]" />
      <path d="M68 63 L90 85" stroke="currentColor" strokeWidth="6" strokeLinecap="round" className="text-black/15" />
      {/* Question mark */}
      <path d="M45 35 Q45 28 50 28 Q58 28 58 38 Q58 42 50 45 L50 50" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-black/20" />
      <circle cx="50" cy="58" r="2" fill="currentColor" className="text-black/20" />
    </svg>
  ),
  generic: (
    <svg className="w-full h-full" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Folder */}
      <path d="M15 30 L15 80 Q15 85 20 85 L100 85 Q105 85 105 80 L105 40 Q105 35 100 35 L55 35 L45 25 L20 25 Q15 25 15 30Z" fill="currentColor" className="text-black/[0.06]" />
      {/* Dashed circle */}
      <circle cx="60" cy="55" r="18" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="text-black/15" />
      {/* Plus */}
      <path d="M60 47 V63 M52 55 H68" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-black/25" />
    </svg>
  ),
}

export function EmptyState({
  icon = 'generic',
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-4', className)}>
      {/* Illustration */}
      <div className="w-32 h-24 mb-6">
        {illustrations[icon]}
      </div>

      {/* Text */}
      <h3 className="text-lg font-semibold text-black mb-2 text-center">{title}</h3>
      <p className="text-sm text-black/50 text-center max-w-sm mb-6">{description}</p>

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex items-center gap-3">
          {action && (
            action.href ? (
              <Link href={action.href}>
                <Button variant="primary" size="sm">{action.label}</Button>
              </Link>
            ) : (
              <Button variant="primary" size="sm" onClick={action.onClick}>{action.label}</Button>
            )
          )}
          {secondaryAction && (
            secondaryAction.href ? (
              <Link href={secondaryAction.href}>
                <Button variant="ghost" size="sm">{secondaryAction.label}</Button>
              </Link>
            ) : (
              <Button variant="ghost" size="sm" onClick={secondaryAction.onClick}>{secondaryAction.label}</Button>
            )
          )}
        </div>
      )}
    </div>
  )
}

// Search-specific empty state
export function SearchEmptyState({
  searchTerm,
  onClear,
  entityName = 'items',
}: {
  searchTerm: string
  onClear?: () => void
  entityName?: string
}) {
  return (
    <EmptyState
      icon="search"
      title={`No ${entityName} found`}
      description={`We couldn't find any ${entityName} matching "${searchTerm}". Try adjusting your search or filters.`}
      action={onClear ? { label: 'Clear search', onClick: onClear } : undefined}
    />
  )
}
