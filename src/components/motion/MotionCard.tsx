'use client'

import React from 'react'
import { motion, useReducedMotion, HTMLMotionProps } from 'motion/react'

export interface MotionCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode
  className?: string
  lift?: number
}

export function MotionCard({
  children,
  className = '',
  lift = -3,
  whileHover,
  whileTap,
  ...props
}: MotionCardProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      whileHover={
        shouldReduceMotion
          ? undefined
          : (whileHover || {
              y: lift,
              transition: { duration: 0.22, ease: 'easeOut' },
            })
      }
      whileTap={
        shouldReduceMotion
          ? undefined
          : (whileTap || {
              scale: 0.99,
              transition: { duration: 0.1 },
            })
      }
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}
