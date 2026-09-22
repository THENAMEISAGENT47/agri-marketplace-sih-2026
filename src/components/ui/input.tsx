import React from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input: React.FC<InputProps> = ({ label, error, helperText, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
          {label}
        </label>
      )}
      <input
        className={cn(
          'w-full px-3.5 py-2.5 text-sm border border-border rounded-custom focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-card-bg text-foreground placeholder:text-muted-foreground/60 transition-all duration-150',
          error && 'border-danger focus:ring-danger focus:border-danger',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-xs text-danger">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1.5 text-xs text-muted-foreground">{helperText}</p>
      )}
    </div>
  )
}

export const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: string; helperText?: string }> = ({ label, error, helperText, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          'w-full px-3.5 py-2.5 text-sm border border-border rounded-custom focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-card-bg text-foreground placeholder:text-muted-foreground/60 transition-all duration-150 resize-none',
          error && 'border-danger focus:ring-danger focus:border-danger',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-xs text-danger">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1.5 text-xs text-muted-foreground">{helperText}</p>
      )}
    </div>
  )
}

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string; error?: string; helperText?: string; options: Array<{ value: string; label: string }> }> = ({ label, error, helperText, options, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
          {label}
        </label>
      )}
      <select
        className={cn(
          'w-full px-3.5 py-2.5 text-sm border border-border rounded-custom focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-card-bg text-foreground transition-all duration-150 cursor-pointer',
          error && 'border-danger focus:ring-danger focus:border-danger',
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1.5 text-xs text-danger">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1.5 text-xs text-muted-foreground">{helperText}</p>
      )}
    </div>
  )
}