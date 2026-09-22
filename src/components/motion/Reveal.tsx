'use client'

import React from 'react'
import { motion, useReducedMotion } from 'motion/react'

export interface RevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  y?: number
  as?: keyof React.JSX.IntrinsicElements
  style?: React.CSSProperties
}

export function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.6,
  y = 16,
  as = 'div',
  style,
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion()
  const Tag = (motion[as as keyof typeof motion] || motion.div) as typeof motion.div

  if (shouldReduceMotion) {
    return (
      <Tag className={className} style={style}>
        {children}
      </Tag>
    )
  }

  return (
    <Tag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
      style={style}
    >
      {children}
    </Tag>
  )
}
