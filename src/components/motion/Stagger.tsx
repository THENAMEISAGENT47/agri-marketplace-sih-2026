'use client'

import React from 'react'
import { motion, useReducedMotion, Variants } from 'motion/react'

export interface StaggerContainerProps {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
  delay?: number
  as?: keyof React.JSX.IntrinsicElements
  style?: React.CSSProperties
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.08,
  delay = 0,
  as = 'div',
  style,
}: StaggerContainerProps) {
  const shouldReduceMotion = useReducedMotion()
  const Tag = (motion[as as keyof typeof motion] || motion.div) as typeof motion.div

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : staggerDelay,
        delayChildren: shouldReduceMotion ? 0 : delay,
      },
    },
  }

  return (
    <Tag
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-20px' }}
      className={className}
      style={style}
    >
      {children}
    </Tag>
  )
}

export interface StaggerItemProps {
  children: React.ReactNode
  className?: string
  y?: number
  as?: keyof React.JSX.IntrinsicElements
  style?: React.CSSProperties
}

export function StaggerItem({
  children,
  className,
  y = 14,
  as = 'div',
  style,
}: StaggerItemProps) {
  const shouldReduceMotion = useReducedMotion()
  const Tag = (motion[as as keyof typeof motion] || motion.div) as typeof motion.div

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : y },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.5,
        ease: [0.21, 0.47, 0.32, 0.98],
      },
    },
  }

  return (
    <Tag variants={itemVariants} className={className} style={style}>
      {children}
    </Tag>
  )
}
