'use client'

import React from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import {
  Sprout,
  ArrowRight,
  ArrowUp,
  Globe,
  Sun,
  Moon,
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTheme } from '@/contexts/ThemeContext'
import { Reveal, StaggerContainer, StaggerItem } from '@/components/motion'

export const Footer: React.FC = () => {
  const { language, setLanguage, t } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const shouldReduceMotion = useReducedMotion()

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <footer
      className="relative bg-[#050b07] dark:bg-[#030704] text-neutral-400 text-xs border-t border-[#14261b] dark:border-[#0e1d14] mt-auto overflow-hidden"
      id="site-footer"
    >
      {/* Restrained Ambient Visual Accents */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] sm:w-[1200px] h-[340px] bg-[radial-gradient(ellipse_at_top,_rgba(21,128,61,0.12),_transparent_70%)] pointer-events-none z-0"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(#15803d_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.035] pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* Giant Architectural Background Typography (partially clipped at bottom) */}
      <div
        className="absolute inset-x-0 bottom-0 overflow-hidden pointer-events-none select-none flex justify-center z-0"
        aria-hidden="true"
      >
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: shouldReduceMotion ? 0 : 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading font-black text-[14vw] leading-[0.8] tracking-tighter text-white/[0.03] dark:text-white/[0.025] uppercase text-center translate-y-[26%] whitespace-nowrap"
        >
          AGRIMARKETPLACE
        </motion.div>
      </div>

      <div className="w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10 pt-14 sm:pt-16">
        {/* ===================================================================== */}
        {/* 1. MAIN FOOTER STATEMENT & PROMINENT CTAS */}
        {/* ===================================================================== */}
        <div className="pb-14 sm:pb-16 border-b border-[#14261b] dark:border-[#0e1d14]">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 sm:gap-10">
            {/* Left Narrative */}
            <div className="max-w-2xl space-y-4">
              <Reveal delay={0.05} y={16}>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{t('footer.infrastructure')}</span>
                </div>
              </Reveal>

              <Reveal delay={0.1} y={20}>
                <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-[1.08]">
                  <span className="block">{t('footer.tagline_p1')}</span>
                  <span className="block text-emerald-400/90">{t('footer.tagline_p2')}</span>
                </h2>
              </Reveal>

              <Reveal delay={0.16} y={16}>
                <p className="text-sm sm:text-base text-neutral-400 max-w-xl font-sans leading-relaxed">
                  {t('footer.substatement')}
                </p>
              </Reveal>
            </div>

            {/* Right CTAs */}
            <Reveal delay={0.22} y={16} className="shrink-0">
              <div className="flex flex-wrap items-center gap-3.5">
                <Link
                  href="/marketplace"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-custom bg-[#8FBF2E] hover:bg-[#9ecc34] text-neutral-950 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-[0.98] group"
                >
                  <span>{t('footer.cta_browse')}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  href="/farmer/dashboard"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-custom bg-white/5 hover:bg-white/10 text-white border border-white/10 font-semibold text-xs sm:text-sm transition-all active:scale-[0.98]"
                >
                  <Sprout className="w-4 h-4 text-emerald-400" />
                  <span>{t('footer.cta_sell')}</span>
                </Link>
              </div>
            </Reveal>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 2. CURATED REAL DESTINATIONS (STAGGERED REVEAL) */}
        {/* ===================================================================== */}
        <div className="py-12 sm:py-14 border-b border-[#14261b] dark:border-[#0e1d14]">
          <StaggerContainer
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 sm:gap-10"
            staggerDelay={0.07}
          >
            {/* Col 1: Marketplace */}
            <StaggerItem>
              <h3 className="font-heading font-bold text-white text-xs uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>{t('footer.nav_marketplace')}</span>
              </h3>
              <ul className="space-y-2.5 text-xs text-neutral-400">
                <li>
                  <Link href="/marketplace" className="hover:text-white transition">
                    {t('footer.market_link')}
                  </Link>
                </li>
                <li>
                  <Link href="/#market-insights" className="hover:text-white transition">
                    {t('footer.nav_market_insights')}
                  </Link>
                </li>
                <li>
                  <Link href="/buyer/matching" className="hover:text-white transition">
                    {t('footer.demo_link')}
                  </Link>
                </li>
              </ul>
            </StaggerItem>

            {/* Col 2: For Farmers */}
            <StaggerItem>
              <h3 className="font-heading font-bold text-white text-xs uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>{t('footer.nav_farmers')}</span>
              </h3>
              <ul className="space-y-2.5 text-xs text-neutral-400">
                <li>
                  <Link href="/farmer/dashboard" className="hover:text-white transition">
                    {t('footer.farmer_portal')}
                  </Link>
                </li>
                <li>
                  <Link href="/#for-farmers" className="hover:text-white transition">
                    {t('farmers.tag')}
                  </Link>
                </li>
                <li>
                  <Link href="/farmer/products" className="hover:text-white transition">
                    {t('footer.catalog')}
                  </Link>
                </li>
              </ul>
            </StaggerItem>

            {/* Col 3: Platform & Features */}
            <StaggerItem>
              <h3 className="font-heading font-bold text-white text-xs uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>{t('footer.platform')}</span>
              </h3>
              <ul className="space-y-2.5 text-xs text-neutral-400">
                <li>
                  <Link href="/#how-it-works" className="hover:text-white transition">
                    {t('footer.nav_how_it_works')}
                  </Link>
                </li>
                <li>
                  <Link href="/#about-us" className="hover:text-white transition">
                    {t('footer.nav_about')}
                  </Link>
                </li>
                <li>
                  <Link href="/#problem-comparison" className="hover:text-white transition">
                    {t('compare.tag')}
                  </Link>
                </li>
              </ul>
            </StaggerItem>

            {/* Col 4: Standards & Verification */}
            <StaggerItem>
              <h3 className="font-heading font-bold text-white text-xs uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>{t('footer.standards')}</span>
              </h3>
              <ul className="space-y-2.5 text-xs text-neutral-400">
                <li>{t('footer.agmark')}</li>
                <li>{t('footer.enam')}</li>
                <li>{t('footer.routing')}</li>
              </ul>
            </StaggerItem>

            {/* Col 5: Operational Health */}
            <StaggerItem className="col-span-2 sm:col-span-1">
              <h3 className="font-heading font-bold text-white text-xs uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>{t('footer.health')}</span>
              </h3>
              <div className="p-3 rounded-custom bg-[#09150d] border border-[#14261b] space-y-1.5 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono text-neutral-200 font-medium">
                    {t('footer.operational')}
                  </span>
                </div>
                <p className="text-[10px] text-neutral-400 font-mono">
                  {t('footer.fallback')}
                </p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>

        {/* ===================================================================== */}
        {/* 3. BOTTOM BAR (COPYRIGHT, LANGUAGE, THEME, BACK TO TOP) */}
        {/* ===================================================================== */}
        <div className="py-8 flex flex-col sm:flex-row items-center justify-between gap-5 text-xs text-neutral-400">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span>{t('footer.rights')}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 sm:gap-4">
            {/* Language Switch */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-custom border border-[#1d3525] bg-[#09150d] text-neutral-300 hover:text-white transition text-xs font-medium cursor-pointer"
              title={language === 'en' ? 'Switch to हिन्दी' : 'Switch to English'}
              aria-label="Toggle language"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'en' ? 'English (EN)' : 'हिन्दी (HI)'}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-custom border border-[#1d3525] bg-[#09150d] text-neutral-300 hover:text-white transition text-xs font-medium cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle color theme"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-300" />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Dark</span>
                </>
              )}
            </button>

            {/* Back to Top */}
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-custom border border-[#1d3525] bg-[#09150d] text-neutral-300 hover:text-white hover:-translate-y-0.5 active:scale-95 transition-all text-xs font-medium cursor-pointer group"
              aria-label="Back to top"
            >
              <span>{t('footer.back_to_top')}</span>
              <ArrowUp className="w-3.5 h-3.5 text-emerald-400 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
