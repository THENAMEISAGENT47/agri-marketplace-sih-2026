'use client'

import { Badge } from '../ui'
import { useLanguage } from '@/contexts/LanguageContext'

export function DemoModeIndicator() {
  const { t } = useLanguage()
  const isDemoMode = process.env.NODE_ENV === 'development' || !process.env.NEXT_PUBLIC_SUPABASE_URL

  if (!isDemoMode) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 pointer-events-none select-none">
      <Badge variant="warning" size="sm" className="shadow-md backdrop-blur-md bg-amber-50/95 dark:bg-amber-950/95 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 font-mono-data text-[11px]">
        {t('demo.mode_badge')} · {t('guide.title')}
      </Badge>
    </div>
  )
}
