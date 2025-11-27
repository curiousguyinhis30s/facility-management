'use client'

import React from 'react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'full' | 'icon' | 'wordmark'
  className?: string
}

const sizes = {
  sm: { icon: 24, text: 'text-sm' },
  md: { icon: 32, text: 'text-lg' },
  lg: { icon: 40, text: 'text-xl' },
  xl: { icon: 48, text: 'text-2xl' },
}

export function Logo({ size = 'md', variant = 'full', className = '' }: LogoProps) {
  const { icon: iconSize, text: textSize } = sizes[size]

  const IconMark = () => (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      {/* Building/Property icon with modern geometric design */}
      <rect
        x="4"
        y="12"
        width="40"
        height="32"
        rx="4"
        className="fill-primary"
      />
      <rect
        x="8"
        y="4"
        width="32"
        height="12"
        rx="3"
        className="fill-primary/80"
      />
      {/* Windows - representing units/properties */}
      <rect x="10" y="18" width="8" height="8" rx="1.5" className="fill-white/90" />
      <rect x="20" y="18" width="8" height="8" rx="1.5" className="fill-white/90" />
      <rect x="30" y="18" width="8" height="8" rx="1.5" className="fill-white/90" />
      <rect x="10" y="30" width="8" height="8" rx="1.5" className="fill-white/90" />
      <rect x="30" y="30" width="8" height="8" rx="1.5" className="fill-white/90" />
      {/* Door - entrance */}
      <rect x="20" y="30" width="8" height="14" rx="1" className="fill-white" />
      <circle cx="26" cy="37" r="1" className="fill-primary" />
      {/* Roof accent */}
      <path
        d="M24 2L8 12H40L24 2Z"
        className="fill-primary"
      />
    </svg>
  )

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <IconMark />
      </div>
    )
  }

  if (variant === 'wordmark') {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <span className={`font-bold ${textSize} text-black tracking-tight`}>
          Facility<span className="text-primary">Pro</span>
        </span>
      </div>
    )
  }

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <IconMark />
      <span className={`font-bold ${textSize} text-black tracking-tight`}>
        Facility<span className="text-primary">Pro</span>
      </span>
    </div>
  )
}

// Favicon-ready SVG export
export function LogoFavicon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="32" height="32" rx="8" fill="#2563EB" />
      <rect x="6" y="10" width="20" height="16" rx="2" fill="white" />
      <rect x="8" y="6" width="16" height="6" rx="1.5" fill="white" fillOpacity="0.8" />
      <rect x="8" y="13" width="4" height="4" rx="0.5" fill="#2563EB" />
      <rect x="14" y="13" width="4" height="4" rx="0.5" fill="#2563EB" />
      <rect x="20" y="13" width="4" height="4" rx="0.5" fill="#2563EB" />
      <rect x="8" y="19" width="4" height="4" rx="0.5" fill="#2563EB" />
      <rect x="20" y="19" width="4" height="4" rx="0.5" fill="#2563EB" />
      <rect x="14" y="19" width="4" height="7" rx="0.5" fill="#2563EB" />
    </svg>
  )
}
