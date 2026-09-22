import React from 'react'
import { cn } from '@/lib/utils'
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react'

interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info'
  children: React.ReactNode
  onClose?: () => void
  className?: string
}

export const Alert: React.FC<AlertProps> = ({ type = 'info', children, onClose, className = '' }) => {
  const typeStyles = {
    success: 'bg-success-light border-success/30 text-success',
    error: 'bg-danger-light border-danger/30 text-danger',
    warning: 'bg-warning-light border-warning/30 text-warning',
    info: 'bg-info-light border-info/30 text-info',
  }

  const iconMap = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  }

  return (
    <div className={cn(
      'flex items-start p-4 border rounded-xl',
      typeStyles[type],
      className
    )}>
      <div className="shrink-0 mr-3 mt-0.5">{iconMap[type]}</div>
      <div className="flex-1 text-sm">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-3 shrink-0 opacity-50 hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}