'use client'

import React, { useEffect, useRef, useCallback } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface SidePanelProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  width?: 'sm' | 'md' | 'lg' | 'xl'
  footer?: React.ReactNode
}

export function SidePanel({
  isOpen,
  onClose,
  title,
  children,
  width = 'md',
  footer,
}: SidePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }

  // Handle Escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
    // Focus trap - Tab key
    if (e.key === 'Tab' && panelRef.current) {
      const focusableElements = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault()
        lastElement?.focus()
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault()
        firstElement?.focus()
      }
    }
  }, [onClose])

  // Focus management and keyboard handlers
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'

      // Focus first focusable element
      setTimeout(() => {
        const firstInput = panelRef.current?.querySelector<HTMLElement>(
          'input, select, textarea, button[type="submit"]'
        )
        firstInput?.focus()
      }, 100)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''

      if (previousActiveElement.current && !isOpen) {
        previousActiveElement.current.focus()
      }
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="side-panel-title"
        className={`w-full ${widthClasses[width]} h-full bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/[0.08]">
          <h2 id="side-panel-title" className="text-lg font-semibold text-black">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-black/40 hover:bg-black/[0.04] hover:text-black transition-colors"
            aria-label="Close panel"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content - scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-black/[0.08] bg-black/[0.02]">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

// Convenience component for form panels with standard footer
interface FormSidePanelProps extends Omit<SidePanelProps, 'footer' | 'children'> {
  onSubmit: (e: React.FormEvent) => void
  isSubmitting?: boolean
  submitText?: string
  cancelText?: string
  children: React.ReactNode
}

export function FormSidePanel({
  onSubmit,
  isSubmitting = false,
  submitText = 'Save',
  cancelText = 'Cancel',
  children,
  ...props
}: FormSidePanelProps) {
  return (
    <SidePanel
      {...props}
      footer={
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={props.onClose}
            disabled={isSubmitting}
          >
            {cancelText}
          </Button>
          <Button
            type="submit"
            form="side-panel-form"
            variant="primary"
            disabled={isSubmitting}
            className="min-w-[100px]"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </div>
            ) : (
              submitText
            )}
          </Button>
        </div>
      }
    >
      <form id="side-panel-form" onSubmit={onSubmit} className="space-y-4">
        {children}
      </form>
    </SidePanel>
  )
}
