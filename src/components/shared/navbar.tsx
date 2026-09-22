'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { Button } from '../ui'
import { useAuth } from '@/hooks/useAuth'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { NotificationPanel, NotificationBadge } from '../notifications'
import { Sprout, Menu, X, Bell, LogOut, Sun, Moon, Globe, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTheme } from '@/contexts/ThemeContext'
import { AnimatedTopDock } from './animated-top-dock'

export const Navbar: React.FC = () => {
  const { user, signOut, loading } = useAuth()
  const { userId } = useCurrentUser()
  const { language, setLanguage, t } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const shouldReduceMotion = useReducedMotion()

  const router = useRouter()

  // Detect scroll for navbar background
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const fetchUnreadCount = async () => {
    if (userId) {
      try {
        const response = await fetch(`/api/notifications?user_id=${userId}`)
        if (response.ok) {
          const data = await response.json()
          setUnreadCount(data.filter((n: { is_read: boolean }) => !n.is_read).length)
        }
      } catch (error) {
        console.error('Error fetching unread count:', error)
      }
    }
  }

  useEffect(() => {
    if (userId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchUnreadCount()
      const interval = setInterval(fetchUnreadCount, 30000)
      return () => clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  // Don't show top navbar inside dashboard layouts (they have their own sidebar)
  const isDashboard = pathname?.startsWith('/buyer') || pathname?.startsWith('/farmer') || pathname?.startsWith('/admin')

  if (isDashboard) return null

  if (loading) {
    return (
      <nav className={cn(
        'sticky top-0 z-50 border-b transition-all duration-300',
        'border-border/60 bg-background/80 backdrop-blur-xl'
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold font-display text-foreground tracking-tight">AgriMarketplace</span>
            </Link>
            <div className="w-5 h-5 border-2 border-neutral-300 border-t-primary rounded-full animate-spin" />
          </div>
        </div>
      </nav>
    )
  }

  return (
    <>
      <header className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-neutral-200/80 dark:border-neutral-800 bg-white/95 dark:bg-[#111713]/95 backdrop-blur-md shadow-xs'
          : 'border-b border-neutral-200/40 dark:border-neutral-800/40 bg-white/90 dark:bg-[#111713]/90 backdrop-blur-md'
      )}>
        <div className="w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <AnimatedTopDock
            actions={
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Language Selector */}
                <button
                  onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                  className="text-xs font-semibold px-2.5 py-1.5 rounded-custom border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition duration-150 flex items-center gap-1.5 active:scale-[0.98]"
                  title={language === 'en' ? 'Switch to हिन्दी' : 'Switch to English'}
                >
                  <Globe className="w-3.5 h-3.5 text-neutral-500" />
                  <span className="font-mono text-[11px]">{language === 'en' ? 'EN / हिन्दी' : 'हिन्दी / EN'}</span>
                </button>

                {/* Dark/Light Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  aria-label={t('nav.theme_toggle')}
                  className="p-2 rounded-custom border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 transition duration-150 active:scale-[0.98]"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
                </button>

                {/* Notifications */}
                {user && (
                  <div className="relative">
                    <button
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="p-2 rounded-custom border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 transition duration-150 relative active:scale-[0.98]"
                    >
                      <Bell className="w-4 h-4" />
                      <NotificationBadge count={unreadCount} />
                    </button>
                    {showNotifications && userId && (
                      <NotificationPanel
                        userId={userId}
                        onClose={() => setShowNotifications(false)}
                      />
                    )}
                  </div>
                )}

                {/* Auth / CTA */}
                {user ? (
                  <div className="hidden sm:flex items-center gap-2">
                    <Link href={user.role === 'farmer' ? '/farmer/dashboard' : user.role === 'admin' ? '/admin/dashboard' : '/buyer/dashboard'}>
                      <Button variant="outline" size="sm" className="text-xs font-semibold">
                        {t('nav.dashboard')}
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="p-2 rounded-custom border border-neutral-200 dark:border-neutral-700 hover:text-danger hover:bg-red-50 dark:hover:bg-red-950/30 transition duration-150 text-neutral-500 active:scale-[0.98]"
                      title={t('nav.signout')}
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="hidden sm:flex items-center gap-2">
                    <Link
                      href="/login"
                      className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white px-2.5 py-1.5 rounded-custom border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 transition duration-150 active:scale-[0.98]"
                    >
                      {t('nav.account')}
                    </Link>
                    <Link
                      href="/farmer/dashboard"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-custom bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-semibold transition duration-150 border border-neutral-200 dark:border-neutral-700 active:scale-[0.98]"
                    >
                      <span>{t('nav.sell_produce')}</span>
                    </Link>
                    <Link
                      href="/marketplace"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-custom bg-forest-900 hover:bg-forest-800 text-white text-xs font-semibold shadow-xs transition duration-150 border border-emerald-700/50 group active:scale-[0.98]"
                    >
                      <span>{t('nav.buy_produce')}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-emerald-300 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                )}

                {/* Mobile Menu Toggle */}
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="md:hidden p-2 rounded-custom border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition duration-150 active:scale-[0.98]"
                  aria-label="Toggle menu"
                >
                  {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            }
          />
        </div>

        {/* Mobile Drawer with AnimatePresence */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.22, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-[#111713]/95 backdrop-blur-md overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                <Link
                  href="/"
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-2.5 rounded-custom text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  {t('nav.home')}
                </Link>
                <Link
                  href="/marketplace"
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-2.5 rounded-custom text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  {t('nav.marketplace')}
                </Link>
                <Link
                  href="/#for-farmers"
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-2.5 rounded-custom text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  {t('nav.for_farmers')}
                </Link>
                <Link
                  href="/#how-it-works"
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-2.5 rounded-custom text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  {t('nav.how_it_works')}
                </Link>
                <Link
                  href="/#market-insights"
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-2.5 rounded-custom text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  {t('nav.market_insights')}
                </Link>
                <Link
                  href="/#about-us"
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-2.5 rounded-custom text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  {t('nav.about_us')}
                </Link>

                <div className="border-t border-neutral-200 dark:border-neutral-800 my-3" />

                {user ? (
                  <>
                    <Link
                      href={user.role === 'farmer' ? '/farmer/dashboard' : user.role === 'admin' ? '/admin/dashboard' : '/buyer/dashboard'}
                      onClick={() => setShowMobileMenu(false)}
                      className="block px-4 py-2.5 rounded-custom text-sm font-medium text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      {t('nav.dashboard')} →
                    </Link>
                    <button
                      onClick={() => { handleLogout(); setShowMobileMenu(false) }}
                      className="w-full text-left px-4 py-2.5 rounded-custom text-sm font-medium text-danger hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    >
                      {t('nav.signout')}
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2 pt-2">
                    <Link href="/login" className="w-full" onClick={() => setShowMobileMenu(false)}>
                      <Button variant="outline" size="sm" className="w-full text-xs rounded-custom">{t('nav.account')}</Button>
                    </Link>
                    <div className="flex gap-2">
                      <Link href="/farmer/dashboard" className="flex-1" onClick={() => setShowMobileMenu(false)}>
                        <Button variant="outline" size="sm" className="w-full text-xs rounded-custom">{t('nav.sell_produce')}</Button>
                      </Link>
                      <Link href="/marketplace" className="flex-1" onClick={() => setShowMobileMenu(false)}>
                        <Button variant="primary" size="sm" className="w-full text-xs rounded-custom bg-forest-900 hover:bg-forest-800">{t('nav.buy_produce')}</Button>
                      </Link>
                    </div>
                  </div>
                )}

                {/* Language in mobile */}
                <div className="pt-2 flex items-center justify-between px-4 text-xs text-neutral-500">
                  <span>{t('nav.lang_label')}</span>
                  <button
                    onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                    className="font-mono font-semibold text-forest-900 dark:text-[#8FBF2E] hover:underline"
                  >
                    {t('nav.switch_lang_btn')}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}