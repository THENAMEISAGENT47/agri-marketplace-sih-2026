'use client'

import { PortalHeader } from '@/components/shared/portal-header'
import { useLanguage } from '@/contexts/LanguageContext'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors">
      <PortalHeader
        portalName={t('portal.admin_title')}
        portalHref="/admin/dashboard"
        pageTitle={t('admin.title')}
        badge="Operations Admin"
      />
      <main className="flex-1 w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
