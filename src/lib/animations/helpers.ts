/**
 * Animation Helper Functions
 * Utility functions for common animation tasks
 */

import { Variants } from 'framer-motion'

/**
 * Creates a stagger container with custom delay
 */
export function createStaggerContainer(staggerDelay: number = 0.1, baseDelay: number = 0): Variants {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: baseDelay,
      },
    },
  }
}

/**
 * Creates viewport animation config
 */
export function createViewportConfig(once: boolean = true, amount: number = 0.3) {
  return {
    once,
    amount,
    margin: '0px 0px -100px 0px',
  }
}

/**
 * Creates a custom fade in variant with direction
 */
export function createFadeIn(direction: 'up' | 'down' | 'left' | 'right', distance: number = 60): Variants {
  const directionMap = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
  }

  return {
    hidden: {
      opacity: 0,
      ...directionMap[direction],
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }
}

/**
 * Creates a custom hover effect
 */
export function createHoverEffect(scale: number = 1.05, y: number = -8) {
  return {
    rest: {
      scale: 1,
      y: 0,
    },
    hover: {
      scale,
      y,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  }
}

/**
 * Creates a repeating animation
 */
export function createRepeatAnimation(values: number[], duration: number = 2) {
  return {
    hidden: { opacity: values[0] },
    visible: {
      opacity: values,
      transition: {
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  }
}

/**
 * Creates a spring animation config
 */
export function createSpringConfig(stiffness: number = 200, damping: number = 25) {
  return {
    type: 'spring' as const,
    stiffness,
    damping,
  }
}

/**
 * Easing functions
 */
export const easing = {
  // Standard easing
  easeOut: [0.22, 1, 0.36, 1] as [number, number, number, number],
  easeIn: [0.42, 0, 1, 1] as [number, number, number, number],
  easeInOut: [0.42, 0, 0.58, 1] as [number, number, number, number],

  // Apple-style easing
  apple: [0.25, 0.1, 0.25, 1] as [number, number, number, number],

  // Sharp easing
  sharp: [0.4, 0, 0.6, 1] as [number, number, number, number],

  // Bounce easing
  bounce: [0.68, -0.55, 0.265, 1.55] as [number, number, number, number],
}

/**
 * Common animation durations
 */
export const duration = {
  fast: 0.2,
  normal: 0.4,
  slow: 0.6,
  verySlow: 1.0,
}

/**
 * Creates a page transition
 */
export function createPageTransition() {
  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: easing.easeOut },
  }
}

/**
 * Creates a modal animation
 */
export function createModalAnimation() {
  return {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.2, ease: easing.easeOut },
  }
}

/**
 * Creates a drawer animation (from side)
 */
export function createDrawerAnimation(from: 'left' | 'right' = 'right') {
  const x = from === 'right' ? '100%' : '-100%'

  return {
    initial: { x },
    animate: { x: 0 },
    exit: { x },
    transition: createSpringConfig(300, 30),
  }
}

/**
 * Creates a notification animation (from top)
 */
export function createNotificationAnimation() {
  return {
    initial: { y: -100, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -100, opacity: 0 },
    transition: createSpringConfig(200, 25),
  }
}

/**
 * Utility to delay an animation
 */
export function withDelay(variants: Variants, delay: number): Variants {
  const newVariants: Variants = {}

  for (const key in variants) {
    const variant = variants[key]
    if (typeof variant === 'object' && variant !== null) {
      newVariants[key] = {
        ...variant,
        transition: {
          ...(typeof variant === 'object' && 'transition' in variant ? variant.transition : {}),
          delay,
        },
      }
    }
  }

  return newVariants
}
