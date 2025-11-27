/**
 * Framer Motion Animation Variants Library
 * Reusable animation configurations for Manara Landing Page
 */

import { Variants } from 'framer-motion'

/**
 * Fade in from bottom - smooth entrance
 */
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 60,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1], // Custom easing for smooth motion
    },
  },
}

/**
 * Fade in from top
 */
export const fadeInDown: Variants = {
  hidden: {
    opacity: 0,
    y: -60,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

/**
 * Fade in from left
 */
export const fadeInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -60,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

/**
 * Fade in from right
 */
export const fadeInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 60,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

/**
 * Simple fade in
 */
export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

/**
 * Scale up with fade
 */
export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

/**
 * Container for staggered children
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

/**
 * Fast stagger for grids
 */
export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
}

/**
 * Item variants for staggered animations
 */
export const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
}

/**
 * Slide in from bottom (for modals/panels)
 */
export const slideInBottom: Variants = {
  hidden: {
    y: '100%',
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 200,
    },
  },
  exit: {
    y: '100%',
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
}

/**
 * Rotate and fade in (for logos, icons)
 */
export const rotateIn: Variants = {
  hidden: {
    opacity: 0,
    rotate: -180,
    scale: 0.5,
  },
  visible: {
    opacity: 1,
    rotate: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

/**
 * Typing indicator animation
 */
export const typingIndicator: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
}

/**
 * Bounce animation for attention
 */
export const bounce: Variants = {
  hidden: {
    y: 0,
  },
  visible: {
    y: [-10, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
    },
  },
}

/**
 * Pulse animation for CTAs
 */
export const pulse: Variants = {
  hidden: {
    scale: 1,
  },
  visible: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

/**
 * Glowing effect
 */
export const glow: Variants = {
  hidden: {
    boxShadow: '0 0 0px rgba(59, 130, 246, 0)',
  },
  visible: {
    boxShadow: [
      '0 0 20px rgba(59, 130, 246, 0.5)',
      '0 0 40px rgba(59, 130, 246, 0.8)',
      '0 0 20px rgba(59, 130, 246, 0.5)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

/**
 * Hover lift effect
 */
export const hoverLift: Variants = {
  rest: {
    scale: 1,
    y: 0,
  },
  hover: {
    scale: 1.05,
    y: -8,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  tap: {
    scale: 0.98,
    y: -4,
  },
}

/**
 * Card flip animation
 */
export const cardFlip: Variants = {
  front: {
    rotateY: 0,
    transition: {
      duration: 0.6,
      ease: 'easeInOut',
    },
  },
  back: {
    rotateY: 180,
    transition: {
      duration: 0.6,
      ease: 'easeInOut',
    },
  },
}

/**
 * Text reveal from left to right
 */
export const textReveal: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
}

/**
 * Number counting animation
 */
export const numberCount: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.5,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

/**
 * Drawer slide in from right
 */
export const drawerSlide: Variants = {
  hidden: {
    x: '100%',
  },
  visible: {
    x: 0,
    transition: {
      type: 'spring',
      damping: 30,
      stiffness: 300,
    },
  },
  exit: {
    x: '100%',
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
}

/**
 * Progressive blur (for backgrounds)
 */
export const blurIn: Variants = {
  hidden: {
    opacity: 0,
    filter: 'blur(20px)',
  },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
}
