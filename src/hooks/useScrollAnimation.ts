/**
 * Custom hook for scroll-triggered animations
 * Uses Framer Motion's useInView hook with configuration
 */

import { useInView, useScroll, useTransform } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

interface UseScrollAnimationOptions {
  once?: boolean // Trigger animation only once
  margin?: string // Margin around viewport (e.g., "-100px")
  amount?: number | 'some' | 'all' // Threshold for triggering (0-1)
}

export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const ref = useRef(null)
  const isInView = useInView(ref, {
    once: options.once ?? true, // Default: trigger only once
    margin: (options.margin ?? '0px 0px -100px 0px') as `${number}px ${number}px ${number}px ${number}px`, // Trigger slightly before element enters viewport
    amount: options.amount ?? 0.3, // Trigger when 30% visible
  })

  return { ref, isInView }
}

/**
 * Hook for continuous scroll-based animations
 * Useful for parallax effects
 */
export function useParallaxScroll(speed: number = 0.5) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, -50 * speed])

  return { ref, y }
}

/**
 * Hook for number counting animation
 */
export function useCountAnimation(
  end: number,
  duration: number = 2000,
  start: number = 0
) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const [count, setCount] = useState(start)

  useEffect(() => {
    if (!isInView) return

    let startTime: number | null = null
    let animationFrameId: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      const easeOutQuad = (t: number) => t * (2 - t)
      const easedProgress = easeOutQuad(progress)

      setCount(Math.floor(start + (end - start) * easedProgress))

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate)
      }
    }

    animationFrameId = requestAnimationFrame(animate)

    // Cleanup to prevent memory leak
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [isInView, end, start, duration])

  return { ref, count }
}

/**
 * Hook for checking reduced motion preference
 */
export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = () => {
      setPrefersReducedMotion(mediaQuery.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
}
