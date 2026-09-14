'use client'

import { Badge } from '../ui'

export function DemoModeIndicator() {
  const isDemoMode = process.env.NODE_ENV === 'development' || !process.env.NEXT_PUBLIC_SUPABASE_URL

  if (!isDemoMode) {
    return null
  }

  return (
    <div className="fixed top-20 right-4 z-50">
      <Badge variant="warning" className="animate-pulse">
        🎭 Demo Mode
      </Badge>
    </div>
  )
}