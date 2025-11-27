'use client'

import React, { useEffect, useRef, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
}: ConfirmationModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const cancelButtonRef = useRef<HTMLButtonElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  // Handle Escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
    // Focus trap - Tab key
    if (e.key === 'Tab' && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
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
      // Store the previously focused element
      previousActiveElement.current = document.activeElement as HTMLElement

      // Add keyboard listener
      document.addEventListener('keydown', handleKeyDown)

      // Focus the cancel button when modal opens
      setTimeout(() => {
        cancelButtonRef.current?.focus()
      }, 0)

      // Prevent body scroll
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''

      // Restore focus when modal closes
      if (previousActiveElement.current && !isOpen) {
        previousActiveElement.current.focus()
      }
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  const getIconColor = () => {
    switch (type) {
      case 'danger':
        return 'text-red-600'
      case 'warning':
        return 'text-yellow-600'
      case 'info':
        return 'text-blue-600'
      default:
        return 'text-red-600'
    }
  }

  const getConfirmButtonStyle = () => {
    switch (type) {
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500'
      case 'info':
        return 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500'
      default:
        return 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
    }
  }

  const modalId = React.useId()

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${modalId}-title`}
      aria-describedby={`${modalId}-description`}
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <Card
        className="w-full max-w-md animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            {/* Icon */}
            <div className={`flex-shrink-0 ${getIconColor()}`} aria-hidden="true">
              {type === 'danger' && (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              )}
              {type === 'warning' && (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              )}
              {type === 'info' && (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h2
                id={`${modalId}-title`}
                className="text-lg font-semibold text-black mb-2"
              >
                {title}
              </h2>
              <p
                id={`${modalId}-description`}
                className="text-sm text-black/70 mb-6"
              >
                {message}
              </p>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3">
                <Button
                  ref={cancelButtonRef}
                  onClick={onClose}
                  className="bg-transparent hover:bg-black/[0.04] text-black/70 border border-black/20 focus:ring-2 focus:ring-offset-2 focus:ring-black/20"
                >
                  {cancelText}
                </Button>
                <Button
                  onClick={handleConfirm}
                  className={`${getConfirmButtonStyle()} focus:ring-2 focus:ring-offset-2`}
                >
                  {confirmText}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Hook for managing confirmation modal state
export function useConfirmation() {
  const [confirmState, setConfirmState] = React.useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
    type?: 'danger' | 'warning' | 'info'
    confirmText?: string
    cancelText?: string
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  })

  const showConfirmation = (options: Omit<typeof confirmState, 'isOpen'>) => {
    setConfirmState({
      isOpen: true,
      ...options,
    })
  }

  const hideConfirmation = () => {
    setConfirmState((prev) => ({ ...prev, isOpen: false }))
  }

  return {
    confirmState,
    showConfirmation,
    hideConfirmation,
  }
}
