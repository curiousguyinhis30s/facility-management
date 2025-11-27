'use client'

import React from 'react'
import { Button } from '@/components/ui/button'

interface BulkActionsBarProps {
  selectedCount: number
  onClearSelection: () => void
  onDelete?: () => void
  onExport?: () => void
  onExportCSV?: () => void
  onExportPDF?: () => void
  onBulkEdit?: () => void
  actions?: {
    label: string
    onClick: () => void
    icon?: React.ReactNode
    variant?: 'default' | 'danger' | 'success'
  }[]
}

export function BulkActionsBar({
  selectedCount,
  onClearSelection,
  onDelete,
  onExport,
  onExportCSV,
  onExportPDF,
  onBulkEdit,
  actions = [],
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom duration-300">
      <div className="bg-white border border-black/[0.08] rounded-lg shadow-lg px-6 py-4 flex items-center gap-4">
        {/* Selection count */}
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-white text-xs font-semibold">
            {selectedCount}
          </div>
          <span className="text-sm font-medium text-black">
            {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
          </span>
        </div>

        <div className="h-6 w-px bg-black/[0.08]" />

        {/* Default actions */}
        <div className="flex items-center gap-2">
          {onExport && (
            <Button
              onClick={onExport}
              className="bg-transparent hover:bg-black/[0.04] text-black/70 border-none transition-colors duration-150"
              size="sm"
            >
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Export
            </Button>
          )}

          {onExportCSV && (
            <Button
              onClick={onExportCSV}
              className="bg-transparent hover:bg-black/[0.04] text-black/70 border-none transition-colors duration-150"
              size="sm"
            >
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              CSV
            </Button>
          )}

          {onExportPDF && (
            <Button
              onClick={onExportPDF}
              className="bg-transparent hover:bg-black/[0.04] text-black/70 border-none transition-colors duration-150"
              size="sm"
            >
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              PDF
            </Button>
          )}

          {onBulkEdit && (
            <Button
              onClick={onBulkEdit}
              className="bg-transparent hover:bg-black/[0.04] text-black/70 border-none transition-colors duration-150"
              size="sm"
            >
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
              Edit
            </Button>
          )}

          {/* Custom actions */}
          {actions.map((action, index) => (
            <Button
              key={index}
              onClick={action.onClick}
              className={
                action.variant === 'danger'
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : action.variant === 'success'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-transparent hover:bg-black/[0.04] text-black/70 border-none'
              }
              size="sm"
            >
              {action.icon && <span className="mr-2">{action.icon}</span>}
              {action.label}
            </Button>
          ))}

          {onDelete && (
            <Button
              onClick={onDelete}
              className="bg-red-600 hover:bg-red-700 text-white transition-colors duration-150"
              size="sm"
            >
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              Delete
            </Button>
          )}
        </div>

        <div className="h-6 w-px bg-black/[0.08]" />

        {/* Clear selection */}
        <Button
          onClick={onClearSelection}
          className="bg-transparent hover:bg-black/[0.04] text-black/40 border-none p-2 transition-colors duration-150"
          size="sm"
          aria-label="Clear selection"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Button>
      </div>
    </div>
  )
}
