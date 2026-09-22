import React from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'warning' | 'success' | 'link'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  isLoading?: boolean
  children: React.ReactNode
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled,
  leftIcon,
  rightIcon,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-custom transition-all duration-150 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none select-none'

  const variantStyles = {
    primary: 'bg-forest-900 text-white hover:bg-forest-800 border border-emerald-600/40 shadow-xs hover:shadow-sm focus-visible:ring-emerald-500',
    secondary: 'bg-card-bg text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-border shadow-xs focus-visible:ring-primary-500',
    danger: 'bg-danger text-white hover:bg-red-700 border border-red-600/40 shadow-xs focus-visible:ring-red-500',
    ghost: 'bg-transparent text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 focus-visible:ring-neutral-400',
    outline: 'border border-border bg-transparent text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 shadow-2xs focus-visible:ring-primary-500',
    warning: 'bg-harvest-600 text-white hover:bg-harvest-500 border border-amber-600/40 shadow-xs focus-visible:ring-amber-500',
    success: 'bg-emerald-600 text-white hover:bg-emerald-500 border border-emerald-500/40 shadow-xs focus-visible:ring-emerald-500',
    link: 'bg-transparent text-forest-900 dark:text-emerald-400 hover:underline underline-offset-2 p-0 h-auto font-medium',
  }

  const sizeStyles = {
    xs: 'px-2.5 py-1 text-xs gap-1',
    sm: 'px-3 py-1.5 text-xs font-semibold gap-1.5',
    md: 'px-4 py-2 text-xs sm:text-sm font-semibold gap-2',
    lg: 'px-6 py-2.5 text-sm sm:text-base font-semibold gap-2',
    xl: 'px-8 py-3.5 text-base sm:text-lg font-bold gap-2.5',
  }

  return (
    <button
      className={cn(baseStyles, variantStyles[variant], variant !== 'link' && sizeStyles[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="sr-only">Loading</span>
        </span>
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  )
}