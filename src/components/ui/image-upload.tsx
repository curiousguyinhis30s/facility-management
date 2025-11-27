'use client'

import React, { useRef, useState, useEffect } from 'react'

interface ImageUploadProps {
  label?: string
  value?: string
  onChange: (imageData: string) => void
  error?: string
  helperText?: string
  maxSizeMB?: number
  aspectRatio?: string
  className?: string
  compress?: boolean
  maxWidth?: number
}

export function ImageUpload({
  label,
  value,
  onChange,
  error,
  helperText,
  maxSizeMB = 5,
  aspectRatio = '16/9',
  className = '',
  compress = true,
  maxWidth = 1200,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string>(value || '')
  const [uploadError, setUploadError] = useState<string>('')
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [fileName, setFileName] = useState<string>('')

  // Sync preview with value prop
  useEffect(() => {
    if (value !== preview) {
      setPreview(value || '')
    }
  }, [value])

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let { width, height } = img

          // Scale down if larger than maxWidth
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }

          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext('2d')
          if (!ctx) {
            reject(new Error('Failed to get canvas context'))
            return
          }

          ctx.drawImage(img, 0, 0, width, height)

          // Compress to JPEG with 0.8 quality
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8)
          resolve(compressedDataUrl)
        }
        img.onerror = () => reject(new Error('Failed to load image'))
        img.src = e.target?.result as string
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })
  }

  const handleFileChange = async (file: File) => {
    setUploadError('')
    setIsLoading(true)
    setProgress(0)
    setFileName(file.name)

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file (PNG, JPG, GIF, WEBP)')
      setIsLoading(false)
      return
    }

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > maxSizeMB) {
      setUploadError(`File size must be less than ${maxSizeMB}MB (current: ${fileSizeMB.toFixed(1)}MB)`)
      setIsLoading(false)
      return
    }

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90))
      }, 50)

      let result: string

      if (compress && file.type !== 'image/gif') {
        result = await compressImage(file)
      } else {
        // Read without compression for GIFs or if compression disabled
        result = await new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result as string)
          reader.onerror = () => reject(new Error('Failed to read file'))
          reader.readAsDataURL(file)
        })
      }

      clearInterval(progressInterval)
      setProgress(100)

      // Small delay to show 100% progress
      await new Promise((r) => setTimeout(r, 200))

      setPreview(result)
      onChange(result)
    } catch (err) {
      setUploadError('Failed to process image. Please try again.')
    } finally {
      setIsLoading(false)
      setProgress(0)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileChange(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileChange(file)
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPreview('')
    setFileName('')
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    if (!isLoading) {
      fileInputRef.current?.click()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <div className={className}>
      {label && (
        <label className="mb-2 block text-sm font-medium text-black/70">
          {label}
        </label>
      )}

      <div
        role="button"
        tabIndex={0}
        aria-label={preview ? 'Change uploaded image' : 'Upload an image'}
        className={`relative overflow-hidden rounded-xl border-2 border-dashed transition-all duration-200 ${
          isDragging
            ? 'border-primary bg-primary/5 scale-[1.02] shadow-lg shadow-primary/10'
            : error || uploadError
            ? 'border-red-300 bg-red-50/50'
            : preview
            ? 'border-black/[0.08] bg-white hover:border-black/20'
            : 'border-black/20 bg-gradient-to-b from-black/[0.02] to-black/[0.04] hover:border-black/30 hover:from-black/[0.04] hover:to-black/[0.02]'
        } ${isLoading ? 'pointer-events-none' : 'cursor-pointer'}`}
        style={{ aspectRatio }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
          aria-hidden="true"
        />

        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
            <div className="relative mb-4">
              {/* Spinning ring */}
              <svg className="h-12 w-12 animate-spin" viewBox="0 0 24 24">
                <circle
                  className="opacity-20"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                />
                <circle
                  className="text-primary"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={`${progress * 0.628} 62.8`}
                  strokeLinecap="round"
                  transform="rotate(-90 12 12)"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-black/70">
                {progress}%
              </span>
            </div>
            <p className="text-sm font-medium text-black/70">Processing image...</p>
            {fileName && (
              <p className="mt-1 max-w-[200px] truncate text-xs text-black/50">{fileName}</p>
            )}
          </div>
        )}

        {preview && !isLoading ? (
          <>
            <img
              src={preview}
              alt="Uploaded preview"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* Gradient overlay for better button visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100">
              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-3 p-4">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleClick()
                  }}
                  className="flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-black shadow-lg transition-all hover:bg-black/[0.02] hover:scale-105 active:scale-95"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                  Replace
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:bg-red-600 hover:scale-105 active:scale-95"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                  Remove
                </button>
              </div>
            </div>
            {/* Success checkmark badge */}
            <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white shadow-lg">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
          </>
        ) : !isLoading ? (
          <div className="flex h-full flex-col items-center justify-center p-6 text-center">
            {/* Upload icon with animated ring on drag */}
            <div className={`relative mb-4 transition-transform duration-200 ${isDragging ? 'scale-110' : ''}`}>
              <div className={`absolute inset-0 rounded-full ${isDragging ? 'animate-ping bg-primary/20' : ''}`} />
              <div className={`relative flex h-16 w-16 items-center justify-center rounded-full ${
                isDragging ? 'bg-primary/10' : 'bg-black/[0.04]'
              } transition-colors duration-200`}>
                <svg
                  className={`h-8 w-8 transition-colors duration-200 ${isDragging ? 'text-primary' : 'text-black/40'}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
              </div>
            </div>

            <p className={`mb-1 text-sm font-semibold transition-colors duration-200 ${
              isDragging ? 'text-primary' : 'text-black/70'
            }`}>
              {isDragging ? 'Drop your image here' : 'Click to upload or drag and drop'}
            </p>
            <p className="mb-3 text-xs text-black/50">
              PNG, JPG, WEBP or GIF
            </p>
            <div className="flex items-center gap-2 rounded-full bg-black/[0.04] px-3 py-1.5 text-xs text-black/50">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
              </svg>
              Max {maxSizeMB}MB {compress && '(auto-compressed)'}
            </div>
          </div>
        ) : null}
      </div>

      {/* Error/Helper text with icon */}
      {(error || uploadError || helperText) && (
        <div
          className={`mt-2 flex items-start gap-1.5 text-sm ${
            error || uploadError ? 'text-red-600' : 'text-black/50'
          }`}
        >
          {(error || uploadError) && (
            <svg className="mt-0.5 h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          )}
          <span>{error || uploadError || helperText}</span>
        </div>
      )}
    </div>
  )
}
