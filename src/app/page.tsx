'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Layers,
  CheckCircle2,
  Navigation,
  MapPin,
  TrendingDown,
  Zap,
  Check,
  CheckCheck,
  XCircle,
  ChevronRight,
  ArrowRight,
  RotateCcw,
  Sprout,
  Calendar,
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { getCommodityImage, getCommodityAlt } from '@/lib/commodities'
import { MarketInsights } from '@/components/marketplace/market-insights'
import { TextEffect } from '@/components/motion-primitives/text-effect'
import { Reveal, StaggerContainer, StaggerItem, MotionCard } from '@/components/motion'

export default function Home() {
  const { t } = useLanguage()

  // Interactive Simulator State for Canonical SIH Demonstration Card
  const [simState, setSimState] = useState<'idle' | 'processing' | 'completed'>('idle')
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const handleSimulate = () => {
    if (simState === 'processing') return
    setSimState('processing')
    setTimeout(() => {
      setSimState('completed')
    }, 650)
  }

  const handleResetSim = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSimState('idle')
  }

  // Curated demo crops for early marketplace preview
  const demoCrops = [
    {
      id: 'tomatoes',
      category: 'vegetables',
      name: 'Hybrid Tomatoes',
      grade: 'Grade A',
      location: 'Nashik Agri Cluster, MH',
      lot: '500 kg',
      price: '₹25 / kg',
      harvest: 'Harvested 10 Sep 2026',
      farmer: 'Ramesh Kumar'
    },
    {
      id: 'onions',
      category: 'vegetables',
      name: 'Red Onions (Garwa)',
      grade: 'Grade A',
      location: 'Lasalgaon FPO Network, MH',
      lot: '400 kg',
      price: '₹18 / kg',
      harvest: 'Harvested 08 Sep 2026',
      farmer: 'Ramesh Kumar'
    },
    {
      id: 'ragi',
      category: 'grains',
      name: 'Ragi (Finger Millet)',
      grade: 'Grade A',
      location: 'Kolhapur Cluster, MH',
      lot: '1,000 kg',
      price: '₹37 / kg',
      harvest: 'Expected 24-28 Sep 2026',
      farmer: 'Suresh FPO'
    },
    {
      id: 'potatoes',
      category: 'tubers',
      name: 'Potatoes (Jyoti Ware)',
      grade: 'Grade A',
      location: 'Pune Agri Hub, MH',
      lot: '600 kg',
      price: '₹15 / kg',
      harvest: 'Harvested 09 Sep 2026',
      farmer: 'Suresh FPO'
    },
  ]

  const filteredCrops = activeCategory === 'all'
    ? demoCrops
    : demoCrops.filter(c => c.category === activeCategory)

  return (
    <div className="flex flex-col bg-background text-foreground transition-colors duration-200">

      {/* ========================================================================= */}
      {/* 1. HERO SECTION (FARMER FIRST & PRODUCT FIRST) */}
      {/* ========================================================================= */}
      <section className="relative pt-10 pb-16 lg:pt-14 lg:pb-20 border-b border-border bg-[#fafaf8] dark:bg-[#080d0a] overflow-hidden" id="hero">
        {/* Cinematic Agricultural Hero Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/images/home-hero.png"
            alt="Cinematic agricultural landscape with mountains and farmland"
            fill
            priority
            quality={90}
            sizes="100vw"
            className="object-cover object-[65%_center] md:object-right select-none"
          />
          {/* Restrained directional overlay: stronger dark forest overlay on left for readable copy, transparent to right for landscape */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#fafaf8]/95 via-[#fafaf8]/90 to-[#fafaf8]/80 md:bg-gradient-to-r md:from-[#fafaf8]/95 md:via-[#fafaf8]/85 md:to-transparent/20 dark:from-[#080d0a]/95 dark:via-[#080d0a]/90 dark:to-[#080d0a]/80 md:dark:from-[#071c12]/95 md:dark:via-[#080d0a]/85 md:dark:to-transparent/25"
            aria-hidden="true"
          />
          {/* Subtle bottom edge blend into next section */}
          <div
            className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#fafaf8] dark:from-[#080d0a] to-transparent"
            aria-hidden="true"
          />
        </div>

        <div className="w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-14 items-center">
            
            {/* Left Hero Narrative */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Category Badge */}
              <Reveal delay={0.05} duration={0.4}>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-custom text-xs font-semibold bg-forest-50 dark:bg-[#111713] text-forest-900 dark:text-[#8FBF2E] border border-forest-100 dark:border-[#233027] shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-forest-900 dark:bg-[#8FBF2E] animate-pulse"></span>
                  <span>{t('hero.proof_badge')}</span>
                </div>
              </Reveal>

              {/* Farmer-First Simple Headline */}
              <TextEffect
                as="h1"
                per="word"
                preset="fade"
                className="text-5xl font-semibold tracking-tight sm:text-6xl"
              >
                Buy better. Sell directly.
              </TextEffect>

              {/* Supporting Subhead */}
              <Reveal delay={0.12} duration={0.5}>
                <p className="text-base sm:text-lg text-neutral-600 dark:text-[#9ea8a0] leading-relaxed max-w-2xl font-sans">
                  {t('hero.simple_subhead')}
                </p>
              </Reveal>

              {/* Primary & Secondary Action CTAs */}
              <Reveal delay={0.2} duration={0.5}>
                <div className="flex flex-wrap items-center gap-3.5 pt-1">
                  <Link
                    href="/marketplace"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-custom bg-forest-900 hover:bg-forest-800 text-white font-semibold text-sm shadow-md transition-all border border-emerald-700/50 group active:scale-[0.98]"
                  >
                    <Layers className="w-4 h-4 text-emerald-300 group-hover:scale-105 transition-transform" />
                    <span>{t('hero.btn_browse_marketplace')}</span>
                    <ArrowRight className="w-4 h-4 text-emerald-300 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  
                  <Link
                    href="/farmer/dashboard"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-custom bg-white dark:bg-[#111713] hover:bg-neutral-50 dark:hover:bg-[#1e2a21] text-neutral-800 dark:text-[#f4f5f1] font-semibold text-sm border border-neutral-300 dark:border-[#233027] transition shadow-xs active:scale-[0.98]"
                  >
                    <Sprout className="w-4 h-4 text-forest-900 dark:text-[#8FBF2E]" />
                    <span>{t('hero.btn_sell_produce')}</span>
                  </Link>
                </div>
              </Reveal>

              {/* Supporting Proof Strip */}
              <Reveal delay={0.28} duration={0.5}>
                <div className="pt-4 flex flex-wrap items-center gap-5 sm:gap-6 text-xs text-neutral-600 dark:text-[#9ea8a0] border-t border-neutral-200 dark:border-[#233027]">
                  <div className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-forest-800 dark:text-[#8FBF2E]" />
                    <span>{t('hero.proof_farmer_payout')}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <TrendingDown className="w-4 h-4 text-forest-800 dark:text-[#8FBF2E]" />
                    <span>{t('hero.proof_buyer_savings')}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <Navigation className="w-4 h-4 text-forest-800 dark:text-[#8FBF2E]" />
                    <span>{t('hero.proof_route')}</span>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right Hero: Direct Farmgate Preview Card */}
            <div className="lg:col-span-5 w-full">
              <Reveal delay={0.18} duration={0.6}>
                <div className="bg-white dark:bg-[#111713] rounded-custom border border-neutral-300/80 dark:border-[#233027] shadow-lg overflow-hidden ring-1 ring-black/5">
                  <div className="bg-forest-900 text-white p-4 sm:p-4.5 flex items-center justify-between border-b border-emerald-800">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-custom bg-white/10 flex items-center justify-center">
                        <Sprout className="w-4 h-4 text-emerald-300" />
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-sm text-white">
                          {t('calc.title')}
                        </h3>
                        <p className="text-[10px] text-emerald-300 font-mono">
                          {t('calc.badge')} • PO #ORD-8812
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] bg-emerald-500/20 px-2 py-0.5 rounded font-mono text-emerald-200 border border-emerald-400/30 font-bold">
                      -15.0% SAVINGS
                    </span>
                  </div>

                  <div className="p-4 sm:p-5 space-y-3.5 text-xs">
                    {/* Target Requisition */}
                    <div className="flex items-center justify-between pb-2.5 border-b border-neutral-100 dark:border-[#233027]">
                      <span className="text-neutral-500 dark:text-[#9ea8a0]">{t('calc.buyer_target')}</span>
                      <span className="font-semibold text-neutral-900 dark:text-[#f4f5f1] font-mono bg-neutral-100 dark:bg-[#1e2a21] px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-700">
                        800 kg Grade-A Tomatoes
                      </span>
                    </div>

                    {/* Allocated Producers */}
                    <div className="space-y-2">
                      <div className="p-2.5 rounded-custom bg-neutral-50 dark:bg-[#1e2a21]/50 border border-neutral-200 dark:border-[#233027] flex items-center justify-between">
                        <div>
                          <span className="font-bold text-neutral-900 dark:text-[#f4f5f1]">Ramesh Kumar</span>
                          <p className="text-[11px] text-neutral-500 dark:text-[#9ea8a0]">Nashik Cluster • 500 kg @ ₹25/kg</p>
                        </div>
                        <span className="font-mono font-bold text-forest-900 dark:text-[#8FBF2E] text-sm">₹12,500</span>
                      </div>

                      <div className="p-2.5 rounded-custom bg-neutral-50 dark:bg-[#1e2a21]/50 border border-neutral-200 dark:border-[#233027] flex items-center justify-between">
                        <div>
                          <span className="font-bold text-neutral-900 dark:text-[#f4f5f1]">Suresh FPO</span>
                          <p className="text-[11px] text-neutral-500 dark:text-[#9ea8a0]">Pune Agri Hub • 300 kg @ ₹22/kg</p>
                        </div>
                        <span className="font-mono font-bold text-forest-900 dark:text-[#8FBF2E] text-sm">₹6,600</span>
                      </div>
                    </div>

                    {/* Farmgate Total & Route */}
                    <div className="pt-2 border-t border-neutral-200 dark:border-[#233027] flex items-center justify-between">
                      <div>
                        <span className="text-neutral-500 dark:text-[#9ea8a0] block text-[11px]">{t('calc.net_val_label')}</span>
                        <span className="text-base font-extrabold text-neutral-950 dark:text-[#f4f5f1] font-mono">₹19,100</span>
                      </div>
                      <div className="text-right">
                        <span className="text-neutral-500 dark:text-[#9ea8a0] block text-[11px]">Coordinated Route</span>
                        <span className="font-mono font-bold text-neutral-900 dark:text-[#f4f5f1]">18.21 km Milk Run</span>
                      </div>
                    </div>

                    <Link
                      href="/marketplace"
                      className="w-full py-2.5 rounded-custom bg-forest-900 hover:bg-forest-800 text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow-xs active:scale-[0.98]"
                    >
                      <span>{t('hero.btn_browse_marketplace')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </Reveal>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. MARKETPLACE PREVIEW (EARLY IN HIERARCHY!) */}
      {/* ========================================================================= */}
      <section className="py-16 bg-white dark:bg-[#111713] border-b border-border" id="crop-marketplace">
        <div className="w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <span className="text-xs font-mono font-bold tracking-widest uppercase text-forest-900 dark:text-[#8FBF2E]">
                  {t('market_prev.tag')}
                </span>
                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-neutral-950 dark:text-[#f4f5f1] mt-1">
                  {t('market_prev.title')}
                </h2>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-[#9ea8a0] mt-1">
                  {t('market_prev.subtitle')}
                </p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`px-3 py-1.5 rounded-custom font-medium transition duration-150 active:scale-[0.98] ${
                    activeCategory === 'all'
                      ? 'bg-forest-900 text-white dark:bg-[#1e2a21] dark:text-[#8FBF2E] dark:border dark:border-[#8FBF2E]/40'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200'
                  }`}
                >
                  {t('market_prev.all')}
                </button>
                <button
                  onClick={() => setActiveCategory('vegetables')}
                  className={`px-3 py-1.5 rounded-custom font-medium transition duration-150 active:scale-[0.98] ${
                    activeCategory === 'vegetables'
                      ? 'bg-forest-900 text-white dark:bg-[#1e2a21] dark:text-[#8FBF2E] dark:border dark:border-[#8FBF2E]/40'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200'
                  }`}
                >
                  {t('market_prev.veg')}
                </button>
                <button
                  onClick={() => setActiveCategory('grains')}
                  className={`px-3 py-1.5 rounded-custom font-medium transition duration-150 active:scale-[0.98] ${
                    activeCategory === 'grains'
                      ? 'bg-forest-900 text-white dark:bg-[#1e2a21] dark:text-[#8FBF2E] dark:border dark:border-[#8FBF2E]/40'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200'
                  }`}
                >
                  Grains & Millets
                </button>
                <button
                  onClick={() => setActiveCategory('tubers')}
                  className={`px-3 py-1.5 rounded-custom font-medium transition duration-150 active:scale-[0.98] ${
                    activeCategory === 'tubers'
                      ? 'bg-forest-900 text-white dark:bg-[#1e2a21] dark:text-[#8FBF2E] dark:border dark:border-[#8FBF2E]/40'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200'
                  }`}
                >
                  {t('market_prev.tubers')}
                </button>
              </div>
            </div>
          </Reveal>

          {/* 4 Cards Grid Staggered */}
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredCrops.map(crop => (
              <StaggerItem key={crop.id}>
                <MotionCard
                  className="bg-card-bg rounded-custom border border-border p-4.5 shadow-xs hover:border-forest-900/40 dark:hover:border-[#8FBF2E]/40 transition duration-200 flex flex-col justify-between h-full group"
                >
                  <div>
                    <div className="relative aspect-[16/10] rounded-custom overflow-hidden border border-border bg-neutral-100 dark:bg-neutral-800 mb-3">
                      <Image
                        src={getCommodityImage(crop.id || crop.name)}
                        alt={getCommodityAlt(crop.name, crop.grade)}
                        fill
                        sizes="(max-width: 640px) 100vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2 left-2 text-[10px] font-mono font-semibold bg-black/70 text-white px-2 py-0.5 rounded backdrop-blur-xs">
                        {crop.grade}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-heading font-bold text-base text-foreground leading-snug">
                        {crop.name}
                      </h4>
                      <p className="text-[11px] text-neutral-500 dark:text-[#9ea8a0] mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                        <span>{crop.location}</span>
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-border space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-neutral-500 dark:text-[#9ea8a0]">{t('market_prev.lot')}</span>
                        <span className="font-mono font-bold text-foreground">{crop.lot}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500 dark:text-[#9ea8a0]">{t('market_prev.price')}</span>
                        <span className="font-mono font-bold text-forest-900 dark:text-[#8FBF2E]">{crop.price}</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-neutral-500 pt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-neutral-400" />
                          <span>{crop.harvest}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/marketplace"
                    className="mt-4 w-full block text-center py-2 rounded-custom bg-neutral-100 dark:bg-neutral-800 hover:bg-forest-900 hover:text-white dark:hover:bg-neutral-700 text-foreground text-xs font-semibold transition duration-150 active:scale-[0.98]"
                  >
                    View Details & Buy →
                  </Link>
                </MotionCard>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Direct Catalog Navigation Footer */}
          <Reveal delay={0.15}>
            <div className="mt-7 flex flex-col sm:flex-row items-center justify-between p-4 rounded-custom bg-[#fafaf8] dark:bg-[#1e2a21]/40 border border-border gap-3">
              <span className="text-xs text-neutral-600 dark:text-[#9ea8a0]">
                Showing verified demo listings across 24 commodities including newly added Millets.
              </span>
              <Link
                href="/marketplace"
                className="text-xs font-bold text-forest-900 dark:text-[#8FBF2E] hover:underline flex items-center gap-1 shrink-0"
              >
                <span>Browse All 24 Marketplace Commodities</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. MARKET INSIGHTS (PRICE PREDICTION, HARVEST ESTIMATE, DEMAND FORECAST) */}
      {/* ========================================================================= */}
      <section className="py-16 bg-[#fafafa] dark:bg-[#080d0a] border-b border-border" id="market-insights">
        <div className="w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <Reveal>
            <MarketInsights />
          </Reveal>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. HOW IT WORKS (FOUR SIMPLE STAGES) */}
      {/* ========================================================================= */}
      <section className="py-16 bg-white dark:bg-[#111713] border-b border-border" id="how-it-works">
        <div className="w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-forest-900 dark:text-[#8FBF2E]">
                {t('how.tag')}
              </span>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-neutral-950 dark:text-[#f4f5f1] mt-1">
                {t('how.title')}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-[#9ea8a0] mt-1.5">
                {t('how.subtitle')}
              </p>
            </div>
          </Reveal>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Stage 1 */}
            <StaggerItem>
              <MotionCard className="p-5 rounded-custom bg-[#fafaf8] dark:bg-[#1e2a21]/50 border border-border flex flex-col justify-between h-full">
                <div>
                  <div className="w-8 h-8 rounded-full bg-forest-900 text-white font-mono font-bold text-xs flex items-center justify-center mb-3.5 shadow-xs">
                    01
                  </div>
                  <h3 className="font-heading font-bold text-base text-foreground mb-1.5">
                    {t('how.s1_title')}
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-[#9ea8a0] leading-relaxed">
                    {t('how.s1_desc')}
                  </p>
                </div>
                <div className="mt-4 pt-2.5 border-t border-border text-[11px] font-semibold text-forest-900 dark:text-[#8FBF2E]">
                  Direct Producer Listing
                </div>
              </MotionCard>
            </StaggerItem>

            {/* Stage 2 */}
            <StaggerItem>
              <MotionCard className="p-5 rounded-custom bg-[#fafaf8] dark:bg-[#1e2a21]/50 border border-border flex flex-col justify-between h-full">
                <div>
                  <div className="w-8 h-8 rounded-full bg-forest-900 text-white font-mono font-bold text-xs flex items-center justify-center mb-3.5 shadow-xs">
                    02
                  </div>
                  <h3 className="font-heading font-bold text-base text-foreground mb-1.5">
                    {t('how.s2_title')}
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-[#9ea8a0] leading-relaxed">
                    {t('how.s2_desc')}
                  </p>
                </div>
                <div className="mt-4 pt-2.5 border-t border-border text-[11px] font-semibold text-forest-900 dark:text-[#8FBF2E]">
                  Verified Buyer Requisition
                </div>
              </MotionCard>
            </StaggerItem>

            {/* Stage 3 */}
            <StaggerItem>
              <MotionCard className="p-5 rounded-custom bg-[#fafaf8] dark:bg-[#1e2a21]/50 border border-border flex flex-col justify-between h-full">
                <div>
                  <div className="w-8 h-8 rounded-full bg-forest-900 text-white font-mono font-bold text-xs flex items-center justify-center mb-3.5 shadow-xs">
                    03
                  </div>
                  <h3 className="font-heading font-bold text-base text-foreground mb-1.5">
                    {t('how.s3_title')}
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-[#9ea8a0] leading-relaxed">
                    {t('how.s3_desc')}
                  </p>
                </div>
                <div className="mt-4 pt-2.5 border-t border-border text-[11px] font-semibold text-forest-900 dark:text-[#8FBF2E]">
                  Direct Lot Allocation
                </div>
              </MotionCard>
            </StaggerItem>

            {/* Stage 4 */}
            <StaggerItem>
              <MotionCard className="p-5 rounded-custom bg-[#fafaf8] dark:bg-[#1e2a21]/50 border border-border flex flex-col justify-between h-full">
                <div>
                  <div className="w-8 h-8 rounded-full bg-forest-900 text-white font-mono font-bold text-xs flex items-center justify-center mb-3.5 shadow-xs">
                    04
                  </div>
                  <h3 className="font-heading font-bold text-base text-foreground mb-1.5">
                    {t('how.s4_title')}
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-[#9ea8a0] leading-relaxed">
                    {t('how.s4_desc')}
                  </p>
                </div>
                <div className="mt-4 pt-2.5 border-t border-border text-[11px] font-semibold text-forest-900 dark:text-[#8FBF2E]">
                  Direct Farmgate Payout
                </div>
              </MotionCard>
            </StaggerItem>
          </StaggerContainer>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. VERIFIED SIH DEMONSTRATION SCENARIO (SUPPORTING PROOF) */}
      {/* ========================================================================= */}
      <section className="py-16 bg-[#fafaf8] dark:bg-[#080d0a] border-b border-border" id="demo-calculator">
        <div className="w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <Reveal className="lg:col-span-6 space-y-4">
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-forest-900 dark:text-[#8FBF2E]">
                {t('calc.tag')}
              </span>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-neutral-950 dark:text-[#f4f5f1]">
                Direct 800 kg Tomato Order Fulfillment
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-[#9ea8a0] leading-relaxed font-sans">
                This canonical scenario proves end-to-end direct consolidation: an institutional buyer orders 800 kg of Grade-A tomatoes. The platform automatically aggregates supply from Ramesh Kumar (500 kg) and Suresh FPO (300 kg), coordinates a milk-run vehicle route, and delivers 15% net savings.
              </p>

              <div className="space-y-2.5 pt-2 text-xs">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-forest-800 dark:text-[#8FBF2E]" />
                  <span>Ramesh Kumar (500 kg @ ₹25/kg) = ₹12,500 direct payout</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-forest-800 dark:text-[#8FBF2E]" />
                  <span>Suresh FPO (300 kg @ ₹22/kg) = ₹6,600 direct payout</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-forest-800 dark:text-[#8FBF2E]" />
                  <span>Total Farmgate Realization: ₹19,100 (100% fulfilled)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-forest-800 dark:text-[#8FBF2E]" />
                  <span>Verified 18.21 km route saves ₹436 transit cost</span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.15} className="lg:col-span-6">
              <div className="bg-white dark:bg-[#111713] rounded-custom border border-border shadow-md overflow-hidden p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <span className="font-bold text-foreground text-sm">{t('calc.title')}</span>
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    -15.0% Intermediary Savings
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-neutral-500 dark:text-[#9ea8a0]">
                    <span>Allocation Split</span>
                    <span className="font-mono font-semibold text-foreground">500 kg + 300 kg = 800 kg</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden flex">
                    <div style={{ width: '62.5%' }} className="h-full bg-forest-900 dark:bg-[#8FBF2E]" title="Ramesh Kumar (62.5%)" />
                    <div style={{ width: '37.5%' }} className="h-full bg-amber-500" title="Suresh FPO (37.5%)" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-3 rounded-custom bg-neutral-50 dark:bg-[#1e2a21]/50 border border-border">
                    <span className="text-neutral-500 dark:text-[#9ea8a0] text-[11px] block">Ramesh Kumar</span>
                    <span className="font-mono font-bold text-foreground text-sm">500 kg × ₹25</span>
                    <span className="font-mono font-semibold text-forest-900 dark:text-[#8FBF2E] block mt-0.5">₹12,500</span>
                  </div>
                  <div className="p-3 rounded-custom bg-neutral-50 dark:bg-[#1e2a21]/50 border border-border">
                    <span className="text-neutral-500 dark:text-[#9ea8a0] text-[11px] block">Suresh FPO</span>
                    <span className="font-mono font-bold text-foreground text-sm">300 kg × ₹22</span>
                    <span className="font-mono font-semibold text-forest-900 dark:text-[#8FBF2E] block mt-0.5">₹6,600</span>
                  </div>
                </div>

                {/* Simulation Action */}
                <div className="pt-2">
                  {simState === 'completed' ? (
                    <div className="p-3 rounded-custom bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Order Consolidated & Verified Dispatched</span>
                      </div>
                      <button onClick={handleResetSim} className="p-1 text-neutral-400 hover:text-foreground">
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleSimulate}
                      disabled={simState === 'processing'}
                      className="w-full py-2.5 rounded-custom bg-forest-900 hover:bg-forest-800 text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow-xs active:scale-[0.98]"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-300" />
                      <span>{simState === 'processing' ? 'Processing Algorithm...' : 'Simulate Order Execution'}</span>
                    </button>
                  )}
                </div>

                <div className="text-center text-[10px] text-neutral-400 font-mono">
                  Direct Farmgate Fulfillment Model
                </div>
              </div>
            </Reveal>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. FOR FARMERS SECTION */}
      {/* ========================================================================= */}
      <section className="py-16 bg-white dark:bg-[#111713] border-b border-border" id="for-farmers">
        <div className="w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          
          <Reveal>
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-forest-900 dark:text-[#8FBF2E]">
                {t('farmers.tag')}
              </span>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-neutral-950 dark:text-[#f4f5f1] mt-1">
                {t('farmers.title')}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-[#9ea8a0] mt-1.5">
                {t('farmers.subtitle')}
              </p>
            </div>
          </Reveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {/* F1 */}
            <StaggerItem>
              <MotionCard className="p-4.5 rounded-custom bg-card-bg border border-border space-y-2 h-full">
                <span className="text-xs font-mono font-bold text-forest-900 dark:text-[#8FBF2E]">01</span>
                <h4 className="font-heading font-bold text-sm text-foreground">{t('farmers.f1_title')}</h4>
                <p className="text-xs text-neutral-600 dark:text-[#9ea8a0] leading-relaxed">{t('farmers.f1_desc')}</p>
              </MotionCard>
            </StaggerItem>

            {/* F2 */}
            <StaggerItem>
              <MotionCard className="p-4.5 rounded-custom bg-card-bg border border-border space-y-2 h-full">
                <span className="text-xs font-mono font-bold text-forest-900 dark:text-[#8FBF2E]">02</span>
                <h4 className="font-heading font-bold text-sm text-foreground">{t('farmers.f2_title')}</h4>
                <p className="text-xs text-neutral-600 dark:text-[#9ea8a0] leading-relaxed">{t('farmers.f2_desc')}</p>
              </MotionCard>
            </StaggerItem>

            {/* F3 */}
            <StaggerItem>
              <MotionCard className="p-4.5 rounded-custom bg-card-bg border border-border space-y-2 h-full">
                <span className="text-xs font-mono font-bold text-forest-900 dark:text-[#8FBF2E]">03</span>
                <h4 className="font-heading font-bold text-sm text-foreground">{t('farmers.f3_title')}</h4>
                <p className="text-xs text-neutral-600 dark:text-[#9ea8a0] leading-relaxed">{t('farmers.f3_desc')}</p>
              </MotionCard>
            </StaggerItem>

            {/* F4 */}
            <StaggerItem>
              <MotionCard className="p-4.5 rounded-custom bg-card-bg border border-border space-y-2 h-full">
                <span className="text-xs font-mono font-bold text-forest-900 dark:text-[#8FBF2E]">04</span>
                <h4 className="font-heading font-bold text-sm text-foreground">{t('farmers.f4_title')}</h4>
                <p className="text-xs text-neutral-600 dark:text-[#9ea8a0] leading-relaxed">{t('farmers.f4_desc')}</p>
              </MotionCard>
            </StaggerItem>

            {/* F5 */}
            <StaggerItem>
              <MotionCard className="p-4.5 rounded-custom bg-card-bg border border-border space-y-2 h-full">
                <span className="text-xs font-mono font-bold text-forest-900 dark:text-[#8FBF2E]">05</span>
                <h4 className="font-heading font-bold text-sm text-foreground">{t('farmers.f5_title')}</h4>
                <p className="text-xs text-neutral-600 dark:text-[#9ea8a0] leading-relaxed">{t('farmers.f5_desc')}</p>
              </MotionCard>
            </StaggerItem>
          </StaggerContainer>

          <Reveal delay={0.2} className="mt-8 flex items-center justify-start">
            <Link
              href="/farmer/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-custom bg-forest-900 hover:bg-forest-800 text-white text-xs font-semibold shadow-xs transition border border-emerald-700/50 active:scale-[0.98]"
            >
              <Sprout className="w-4 h-4 text-emerald-300" />
              <span>{t('farmers.btn_portal')}</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-300" />
            </Link>
          </Reveal>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. WHY AGRIMARKETPLACE (TRANSPARENT COMPARISON) */}
      {/* ========================================================================= */}
      <section className="py-16 bg-[#fafafa] dark:bg-[#080d0a] border-b border-border" id="problem-comparison">
        <div className="w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <span className="text-xs font-mono font-bold tracking-wider uppercase text-forest-900 dark:text-[#8FBF2E]">
                  {t('compare.tag')}
                </span>
                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-neutral-950 dark:text-[#f4f5f1] mt-1">
                  {t('compare.title')}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-[#9ea8a0] max-w-md">
                {t('compare.subtitle')}
              </p>
            </div>
          </Reveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Traditional Chain */}
            <StaggerItem>
              <div className="p-6 rounded-custom bg-card-bg border border-red-200 dark:border-red-950/60 shadow-xs relative overflow-hidden h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-500" />
                    <h3 className="font-heading font-bold text-base text-foreground">{t('compare.mandi_title')}</h3>
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-red-600 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded border border-red-200 dark:border-red-900">
                    {t('compare.mandi_badge')}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-2.5 rounded bg-red-50/40 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                    <strong className="text-foreground block mb-0.5">{t('compare.mandi_p1_title')}</strong>
                    <p className="text-neutral-600 dark:text-[#9ea8a0]">{t('compare.mandi_p1_desc')}</p>
                  </div>
                  <div className="p-2.5 rounded bg-red-50/40 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                    <strong className="text-foreground block mb-0.5">{t('compare.mandi_p2_title')}</strong>
                    <p className="text-neutral-600 dark:text-[#9ea8a0]">{t('compare.mandi_p2_desc')}</p>
                  </div>
                  <div className="p-2.5 rounded bg-red-50/40 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                    <strong className="text-foreground block mb-0.5">{t('compare.mandi_p3_title')}</strong>
                    <p className="text-neutral-600 dark:text-[#9ea8a0]">{t('compare.mandi_p3_desc')}</p>
                  </div>
                </div>
              </div>
            </StaggerItem>

            {/* AgriMarketplace Direct Infrastructure */}
            <StaggerItem>
              <div className="p-6 rounded-custom bg-card-bg border border-emerald-300 dark:border-[#233027] shadow-xs relative overflow-hidden h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCheck className="w-5 h-5 text-forest-900 dark:text-[#8FBF2E]" />
                    <h3 className="font-heading font-bold text-base text-foreground">{t('compare.agri_title')}</h3>
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-forest-900 dark:text-[#8FBF2E] bg-emerald-50 dark:bg-[#1e2a21] px-2 py-0.5 rounded border border-emerald-200 dark:border-[#233027]">
                    {t('compare.agri_badge')}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-2.5 rounded bg-emerald-50/40 dark:bg-[#1e2a21]/50 border border-emerald-100 dark:border-[#233027]">
                    <strong className="text-foreground block mb-0.5">{t('compare.agri_p1_title')}</strong>
                    <p className="text-neutral-600 dark:text-[#9ea8a0]">{t('compare.agri_p1_desc')}</p>
                  </div>
                  <div className="p-2.5 rounded bg-emerald-50/40 dark:bg-[#1e2a21]/50 border border-emerald-100 dark:border-[#233027]">
                    <strong className="text-foreground block mb-0.5">{t('compare.agri_p2_title')}</strong>
                    <p className="text-neutral-600 dark:text-[#9ea8a0]">{t('compare.agri_p2_desc')}</p>
                  </div>
                  <div className="p-2.5 rounded bg-emerald-50/40 dark:bg-[#1e2a21]/50 border border-emerald-100 dark:border-[#233027]">
                    <strong className="text-foreground block mb-0.5">{t('compare.agri_p3_title')}</strong>
                    <p className="text-neutral-600 dark:text-[#9ea8a0]">{t('compare.agri_p3_desc')}</p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. ABOUT US SECTION */}
      {/* ========================================================================= */}
      <section className="py-16 bg-white dark:bg-[#111713] border-b border-border" id="about-us">
        <div className="w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          
          <Reveal>
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-forest-900 dark:text-[#8FBF2E]">
                {t('about.tag')}
              </span>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-neutral-950 dark:text-[#f4f5f1] mt-1">
                {t('about.title')}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-[#9ea8a0] mt-1.5">
                {t('about.subtitle')}
              </p>
            </div>
          </Reveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StaggerItem>
              <MotionCard className="p-5 rounded-custom bg-[#fafaf8] dark:bg-[#1e2a21]/40 border border-border space-y-2 h-full">
                <h4 className="font-heading font-bold text-base text-foreground">{t('about.what_title')}</h4>
                <p className="text-xs text-neutral-600 dark:text-[#9ea8a0] leading-relaxed font-sans">{t('about.what_desc')}</p>
              </MotionCard>
            </StaggerItem>

            <StaggerItem>
              <MotionCard className="p-5 rounded-custom bg-[#fafaf8] dark:bg-[#1e2a21]/40 border border-border space-y-2 h-full">
                <h4 className="font-heading font-bold text-base text-foreground">{t('about.who_title')}</h4>
                <p className="text-xs text-neutral-600 dark:text-[#9ea8a0] leading-relaxed font-sans">{t('about.who_desc')}</p>
              </MotionCard>
            </StaggerItem>

            <StaggerItem>
              <MotionCard className="p-5 rounded-custom bg-[#fafaf8] dark:bg-[#1e2a21]/40 border border-border space-y-2 h-full">
                <h4 className="font-heading font-bold text-base text-foreground">{t('about.direct_title')}</h4>
                <p className="text-xs text-neutral-600 dark:text-[#9ea8a0] leading-relaxed font-sans">{t('about.direct_desc')}</p>
              </MotionCard>
            </StaggerItem>

            <StaggerItem>
              <MotionCard className="p-5 rounded-custom bg-[#fafaf8] dark:bg-[#1e2a21]/40 border border-border space-y-2 h-full">
                <h4 className="font-heading font-bold text-base text-foreground">{t('about.sih_title')}</h4>
                <p className="text-xs text-neutral-600 dark:text-[#9ea8a0] leading-relaxed font-sans">{t('about.sih_desc')}</p>
              </MotionCard>
            </StaggerItem>
          </StaggerContainer>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. FINAL CALL TO ACTION */}
      {/* ========================================================================= */}
      <section className="py-14 bg-forest-950 text-white relative overflow-hidden border-b border-emerald-900/60" id="cta">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-5">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded text-xs font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <span>{t('cta.tag')}</span>
            </div>

            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl tracking-tight text-white max-w-2xl mx-auto mt-3">
              {t('cta.title')}
            </h2>

            <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mx-auto leading-relaxed mt-2">
              {t('cta.desc')}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <Link
                href="/marketplace"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-custom bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition shadow-md active:scale-[0.98]"
              >
                <Layers className="w-4 h-4" />
                <span>{t('cta.btn_browse')}</span>
              </Link>
              <Link
                href="/farmer/dashboard"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-custom bg-emerald-900/50 hover:bg-emerald-900/70 text-emerald-200 border border-emerald-700/60 font-semibold text-xs transition active:scale-[0.98]"
              >
                <Sprout className="w-4 h-4 text-emerald-300" />
                <span>{t('hero.btn_sell_produce')}</span>
              </Link>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-emerald-400/80 font-mono">
              <span>✓ {t('cta.p1')}</span>
              <span>•</span>
              <span>✓ {t('cta.p2')}</span>
              <span>•</span>
              <span>✓ {t('cta.p3')}</span>
            </div>
          </Reveal>
        </div>
      </section>

    </div>
  )
}
