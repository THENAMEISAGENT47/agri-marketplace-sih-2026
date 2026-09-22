import React from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  hoverable?: boolean
  variant?: 'default' | 'flush' | 'elevated' | 'outlined' | 'ghost'
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, hoverable = false, variant = 'default' }) => {
  const variants = {
    default: 'bg-card-bg rounded-custom border border-border shadow-xs',
    flush: 'bg-card-bg rounded-custom border border-border',
    elevated: 'bg-card-bg rounded-custom border border-border shadow-md',
    outlined: 'bg-transparent rounded-custom border border-border',
    ghost: 'bg-transparent rounded-custom',
  }

  return (
    <div
      className={cn(
        variants[variant],
        hoverable && 'cursor-pointer hover:shadow-sm hover:border-primary/40 transition-all duration-200',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return <div className={cn('mb-4 space-y-1.5', className)}>{children}</div>
}

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return <h3 className={cn('text-lg font-semibold text-foreground leading-snug tracking-tight', className)}>{children}</h3>
}

export const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return <p className={cn('text-sm text-muted-foreground', className)}>{children}</p>
}

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return <div className={cn('pt-0', className)}>{children}</div>
}

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return <div className={cn('mt-6 pt-4 border-t border-border', className)}>{children}</div>
}

export const CardBanner: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return <div className={cn('px-6 py-4 border-b border-border rounded-t-custom', className)}>{children}</div>
}