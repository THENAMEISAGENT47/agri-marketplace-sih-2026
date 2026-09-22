'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { LayoutDashboard, Sparkles, Store, Package, User, Globe, Sun, Moon } from 'lucide-react'
import { PortalHeader } from '@/components/shared/portal-header'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTheme } from '@/contexts/ThemeContext'

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { user } = useAuth()
  const { language, setLanguage, t } = useLanguage()
  const { theme, toggleTheme } = useTheme()

  const navigation = [
    { name: t('portal.dashboard'), href: '/buyer/dashboard', icon: LayoutDashboard },
    { name: t('portal.supplier_matching'), href: '/buyer/matching', icon: Sparkles },
    { name: t('portal.marketplace'), href: '/marketplace', icon: Store },
    { name: t('portal.my_orders'), href: '/buyer/orders', icon: Package },
    { name: t('portal.profile'), href: '/buyer/profile', icon: User },
  ]

  // Determine current page title
  const currentNavItem = navigation.find(item => item.href === pathname)
  const pageTitle = currentNavItem?.name || (pathname.includes('/matching') ? t('portal.supplier_matching') : t('portal.buyer_title'))

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex flex-1">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-card-bg border-r border-border transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col`}>
          <div className="flex items-center px-6 h-16 border-b border-border shrink-0">
            <Link href="/buyer/dashboard" className="flex items-center space-x-2.5">
              <div className="w-8 h-8 bg-forest-900 text-emerald-300 rounded-custom flex items-center justify-center font-bold text-sm shadow-xs ring-1 ring-emerald-600/30">
                B
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold font-heading text-foreground tracking-tight leading-tight">{t('portal.buyer_title')}</span>
                <span className="text-[10px] font-mono-data text-emerald-600 dark:text-emerald-400 uppercase leading-tight">Institutional B2B</span>
              </div>
            </Link>
          </div>

          <nav className="flex-1 mt-6 px-3 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-3.5 py-2.5 rounded-custom text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-forest-900 text-white shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  <Icon className="mr-3 h-4 w-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Sidebar Footer Controls & User Card */}
          <div className="mt-auto p-4 border-t border-border shrink-0 bg-card-bg space-y-3">
            {/* Mobile drawer quick utility row */}
            <div className="lg:hidden flex items-center justify-between gap-2 pt-1 pb-2 border-b border-border text-xs">
              <button
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="flex-1 py-1.5 px-2 rounded-custom border border-border text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 transition flex items-center justify-center gap-1.5"
              >
                <Globe className="w-3.5 h-3.5 text-neutral-500" />
                <span className="font-mono-data text-[11px] font-semibold">{language === 'en' ? 'EN / हिन्दी' : 'हिन्दी / EN'}</span>
              </button>
              <button
                onClick={toggleTheme}
                className="p-1.5 rounded-custom border border-border text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-600" />}
              </button>
            </div>

            <div className="bg-neutral-50 dark:bg-neutral-900 rounded-custom p-3 border border-border flex items-center gap-3">
              <div className="w-8 h-8 bg-forest-100 dark:bg-forest-950 text-forest-800 dark:text-emerald-300 rounded-custom flex items-center justify-center font-bold text-xs shrink-0 ring-1 ring-forest-600/20">
                {user?.email?.[0]?.toUpperCase() ?? 'B'}
              </div>
              <div className="flex-1 min-w-0 overflow-hidden">
                <p className="text-xs font-semibold text-foreground truncate">
                  {user?.email || 'buyer1@demo.com'}
                </p>
                <p className="text-[10px] text-neutral-500 font-medium font-mono-data">{t('portal.buyer_account')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area with Shared PortalHeader */}
        <div className="flex-1 flex flex-col min-w-0">
          <PortalHeader
            portalName={t('portal.buyer_title')}
            portalHref="/buyer/dashboard"
            pageTitle={pageTitle}
            onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          />

          {/* Page content */}
          <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1680px]">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

