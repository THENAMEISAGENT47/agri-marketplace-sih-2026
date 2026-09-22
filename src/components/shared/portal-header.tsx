'use client'

import React from 'react'
import Link from 'next/link'
import { Menu, Globe, Sun, Moon, Home, ChevronRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTheme } from '@/contexts/ThemeContext'

interface PortalHeaderProps {
  portalName: string
  portalHref: string
  pageTitle: string
  onMenuClick?: () => void
  badge?: string
}

export const PortalHeader: React.FC<PortalHeaderProps> = ({
  portalName,
  portalHref,
  pageTitle,
  onMenuClick,
  badge = 'Verified Operations',
}) => {
  const { language, setLanguage, t } = useLanguage()
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-30 bg-card-bg/95 backdrop-blur-md border-b border-border transition-colors">
      <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
        {/* Left: Mobile Trigger & Clear Contextual Hierarchy */}
        <div className="flex items-center gap-3 min-w-0">
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-custom border border-border text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shrink-0"
              aria-label="Open Navigation Menu"
            >
              <Menu className="h-4 w-4" />
            </button>
          )}

          <div className="flex flex-col min-w-0">
            {/* Level 1: Page Context Breadcrumb */}
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono-data text-neutral-500 truncate">
              <Link href="/" className="hover:text-primary transition flex items-center gap-1">
                <Home className="w-3 h-3" />
                <span className="hidden xs:inline">{t('nav.title')}</span>
              </Link>
              <ChevronRight className="w-3 h-3 text-neutral-400 shrink-0" />
              <Link href={portalHref} className="hover:text-primary transition truncate">
                {portalName}
              </Link>
            </div>

            {/* Level 2: Page Title */}
            <h1 className="text-base sm:text-lg font-bold font-display text-foreground tracking-tight truncate leading-tight mt-0.5">
              {pageTitle}
            </h1>
          </div>
        </div>

        {/* Right: Global Utility Controls (EN/HI + Theme + Status Badge) */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Subtle SIH project badge */}
          {badge && (
            <span className="hidden xl:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono-data font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
              {badge}
            </span>
          )}

          {/* Global Language Toggle: English <-> Hindi */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="text-xs font-semibold px-2.5 py-1.5 rounded-custom border border-border hover:bg-neutral-100 dark:hover:bg-neutral-800 text-foreground transition flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            title={language === 'en' ? 'Switch interface to हिन्दी' : 'Switch interface to English'}
            aria-label={`Current language is ${language === 'en' ? 'English' : 'Hindi'}. Click to toggle language.`}
          >
            <Globe className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
            <span className="font-mono-data text-[11px]">
              {language === 'en' ? 'EN / हिन्दी' : 'हिन्दी / EN'}
            </span>
          </button>

          {/* Global Light/Dark Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-custom border border-border hover:bg-neutral-100 dark:hover:bg-neutral-800 text-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-neutral-600" />
            )}
          </button>

          {/* Quick Exit / Public Homepage Link */}
          <Link
            href="/"
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-custom border border-border text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
            title="Return to Public Homepage"
          >
            <span className="font-sans text-[11px]">{t('nav.title')}</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
