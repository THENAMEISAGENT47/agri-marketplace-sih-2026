'use client'

import { Badge } from '../ui'

interface NotificationBadgeProps {
  count: number
  className?: string
}

export function NotificationBadge({ count, className = '' }: NotificationBadgeProps) {
  if (count === 0) {
    return null
  }

  return (
    <Badge variant="danger" className={`text-xs ${className}`}>
      {count > 99 ? '99+' : count}
    </Badge>
  )
}