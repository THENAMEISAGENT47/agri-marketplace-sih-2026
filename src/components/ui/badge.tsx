import React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'secondary' | 'outline' | 'mono'
  size?: 'sm' | 'md' | 'lg' | 'pill'
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', size = 'sm', className = '' }) => {
  const variantStyles = {
    default: 'bg-neutral-100 dark:bg-neutral-800/90 text-neutral-800 dark:text-neutral-200 border-neutral-200 dark:border-neutral-700/80',
    primary: 'bg-forest-50 dark:bg-emerald-950/70 text-forest-900 dark:text-emerald-300 border-forest-200 dark:border-emerald-800/80',
    success: 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80',
    warning: 'bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/80',
    danger: 'bg-red-50 dark:bg-red-950/70 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800/80',
    info: 'bg-sky-50 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800/80',
    secondary: 'bg-amber-50 dark:bg-amber-950/70 text-harvest-600 dark:text-amber-300 border-amber-200 dark:border-amber-800/80',
    outline: 'bg-transparent text-neutral-700 dark:text-neutral-300 border-border',
    mono: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-200 dark:border-neutral-700 font-mono-data',
  }

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[11px] font-mono-data font-semibold',
    md: 'px-2.5 py-1 text-xs font-semibold',
    lg: 'px-3 py-1.5 text-xs font-semibold tracking-wide',
    pill: 'px-3 py-0.5 text-[11px] rounded-full font-mono-data font-semibold',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-custom border whitespace-nowrap gap-1 shadow-2xs transition-colors',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  )
}