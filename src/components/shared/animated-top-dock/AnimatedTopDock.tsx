'use client'

import React, { useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sprout } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { createTopDockController, TopDockConfig } from './topDockController'
import './styles.css'

export interface AnimatedTopDockProps {
  proximity?: number
  spring?: number
  damping?: number
  widthGrowth?: number
  heightGrowth?: number
  drop?: number
  className?: string
  actions?: React.ReactNode
}

export const ANIMATED_TOP_DOCK_DEFAULTS: TopDockConfig = {
  proximity: 122,
  spring: 0.19,
  damping: 0.70,
  widthGrowth: 17,
  heightGrowth: 16,
  drop: 3.5,
  axis: 'x',
  lockTrack: true,
}

export function AnimatedTopDock({
  proximity = 122,
  spring = 0.19,
  damping = 0.70,
  widthGrowth = 17,
  heightGrowth = 16,
  drop = 3.5,
  className = '',
  actions,
}: AnimatedTopDockProps) {
  const { t } = useLanguage()
  const pathname = usePathname()
  const navRef = useRef<HTMLElement>(null)

  const configRef = useRef<TopDockConfig>({
    ...ANIMATED_TOP_DOCK_DEFAULTS,
    proximity,
    spring,
    damping,
    widthGrowth,
    heightGrowth,
    drop,
  })

  configRef.current = {
    ...ANIMATED_TOP_DOCK_DEFAULTS,
    proximity,
    spring,
    damping,
    widthGrowth,
    heightGrowth,
    drop,
  }

  useEffect(() => {
    const el = navRef.current
    if (!el) return
    return createTopDockController(el, () => configRef.current)
  }, [])

  // Public navigation destinations matching AgriMarketplace
  const dockItems = [
    {
      id: 'marketplace',
      href: '/marketplace',
      label: t('nav.marketplace'),
      icon: (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3.5h12v2.5H2z" />
          <path d="M3 6v6.5a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6" />
          <path d="M6 9h4" />
        </svg>
      ),
    },
    {
      id: 'for-farmers',
      href: '/#for-farmers',
      label: t('nav.for_farmers'),
      icon: (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 14V7.5" />
          <path d="M8 7.5c0-3 3-4.5 5.5-4.5 0 3.5-2.5 5.5-5.5 4.5z" />
          <path d="M8 9.5c0-2-2-3-3.8-3 0 2.5 1.8 3.8 3.8 3z" />
        </svg>
      ),
    },
    {
      id: 'how-it-works',
      href: '/#how-it-works',
      label: t('nav.how_it_works'),
      icon: (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2.5 4h11M2.5 8h11M2.5 12h7" />
          <circle cx="12" cy="12" r="1.5" />
        </svg>
      ),
    },
    {
      id: 'market-insights',
      href: '/#market-insights',
      label: t('nav.market_insights'),
      icon: (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 13.5h12" />
          <path d="M3.5 11l3-4 2.5 2.5 4-5.5" />
          <path d="M10.5 4h2.5v2.5" />
        </svg>
      ),
    },
    {
      id: 'about-us',
      href: '/#about-us',
      label: t('nav.about_us'),
      icon: (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="8" cy="8" r="5.5" />
          <path d="M8 7v4" />
          <circle cx="8" cy="4.8" r="0.75" fill="currentColor" stroke="none" />
        </svg>
      ),
    },
  ]

  const isItemActive = (href: string) => {
    if (href === '/marketplace') {
      return pathname === '/marketplace' || pathname.startsWith('/marketplace/')
    }
    return false
  }

  return (
    <div className={`animated-top-dock-component atd-modern ${className}`}>
      <div className="atd-modern__bar">
        {/* Left: Brand / Logo navigating to Home */}
        <Link href="/" className="atd-modern__brand group" aria-label="AgriMarketplace Home">
          <div className="w-9 h-9 rounded-custom bg-forest-900 flex items-center justify-center text-white shadow-xs ring-1 ring-emerald-600/30 group-hover:bg-forest-800 transition duration-200">
            <Sprout className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-extrabold text-base tracking-tight text-neutral-900 dark:text-white flex items-center gap-1.5 leading-tight">
              {t('nav.title')}
            </span>
            <span className="text-[10px] font-medium tracking-wide text-forest-900 dark:text-[#8FBF2E] font-mono uppercase leading-tight">
              {t('nav.subtitle')}
            </span>
          </div>
        </Link>

        {/* Center: Proximity Spring Animated Navigation Dock (Desktop) */}
        <nav
          ref={navRef}
          className="hidden md:flex atd-modern__dock"
          aria-label="Primary Navigation"
          data-dock-state="idle"
          data-dock-max="0.00"
        >
          {dockItems.map((item) => {
            const active = isItemActive(item.href)
            return (
              <Link
                key={item.id}
                href={item.href}
                className="atd-modern__item"
                data-dock-item="true"
                aria-pressed={active}
                data-active={active ? 'true' : 'false'}
              >
                <span className="atd-modern__icon" aria-hidden="true">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Right: Actions / Utilities Slot */}
        {actions && (
          <div className="atd-modern__actions">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}
