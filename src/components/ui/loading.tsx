import React from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({ size = 'md', className = '' }) => {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  return (
    <Loader2 className={cn('animate-spin', sizeStyles[size], className)} />
  )
}

export const LoadingPage: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <LoadingSpinner size="lg" className="text-primary mb-4" />
      <p className="text-foreground text-sm">{message}</p>
    </div>
  )
}

export const LoadingCard: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-card-bg rounded-xl border border-border">
      <LoadingSpinner size="md" className="text-primary mb-3" />
      <p className="text-foreground text-sm">{message}</p>
    </div>
  )
}

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={cn('animate-pulse bg-neutral-200 rounded', className)}></div>
  )
}