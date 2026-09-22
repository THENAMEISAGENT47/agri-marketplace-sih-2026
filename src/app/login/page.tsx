'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, useReducedMotion, Variants } from 'motion/react'
import {
  Sprout,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  Layers,
} from 'lucide-react'
import { Alert } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/contexts/LanguageContext'
import { cn } from '@/lib/utils'

// ============================================================================
// Pointer-Reactive Spotlight Input (Forest Green & Sage Halo)
// ============================================================================
interface SpotlightInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  icon?: React.ReactNode
}

function SpotlightInput({ label, error, icon, className, ...props }: SpotlightInputProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <div className="w-full space-y-1.5 text-left">
      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
        className="relative rounded-custom p-[1.5px] transition-all duration-300"
        style={{
          background: isHovered && !shouldReduceMotion
            ? `radial-gradient(130px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(143, 191, 46, 0.45), rgba(13, 74, 46, 0.25), transparent 70%)`
            : 'transparent',
        }}
      >
        <div className="relative flex items-center w-full">
          {icon && (
            <div className="absolute left-3.5 text-muted-foreground/80 pointer-events-none">
              {icon}
            </div>
          )}
          <input
            {...props}
            className={cn(
              'w-full py-2.5 text-sm rounded-custom border border-border bg-card-bg text-foreground placeholder:text-muted-foreground/60 transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary',
              icon ? 'pl-10 pr-3.5' : 'px-3.5',
              error && 'border-danger focus:ring-danger focus:border-danger',
              className
            )}
          />
        </div>
      </div>
      {error && <p className="text-xs text-danger mt-1">{error}</p>}
    </div>
  )
}

// ============================================================================
// Agricultural Supply Network Visualization (Left Hero Column)
// ============================================================================
function AgriNetworkVisual() {
  const shouldReduceMotion = useReducedMotion()
  const { t } = useLanguage()

  return (
    <div className="w-full h-full flex flex-col justify-between relative p-8 xl:p-12 select-none">
      {/* Restrained ambient background accents */}
      <div
        className="absolute -top-24 -left-24 w-96 h-96 bg-[radial-gradient(ellipse_at_center,_rgba(13,74,46,0.35),_transparent_70%)] pointer-events-none z-0"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(#15803d_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.04] pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* Top Brand Identity & Decorative Tokens */}
      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-custom bg-forest-900 flex items-center justify-center text-white ring-1 ring-emerald-500/30 shadow-xs">
            <Sprout className="w-5 h-5 text-[#8FBF2E]" />
          </div>
          <div>
            <span className="font-heading font-extrabold text-base text-white tracking-tight block">
              AgriMarketplace
            </span>
            <span className="text-[10px] font-mono text-emerald-400/80 uppercase tracking-widest">
              {t('footer.sih')}
            </span>
          </div>
        </div>

        {/* Subtle Decorative Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] font-mono font-semibold">
          <span className="px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-400 border border-emerald-800/40">
            {t('auth.tag_direct')}
          </span>
          <span className="px-2 py-0.5 rounded bg-neutral-900/80 text-neutral-400 border border-neutral-800">
            {t('auth.tag_market')}
          </span>
          <span className="px-2 py-0.5 rounded bg-neutral-900/80 text-neutral-400 border border-neutral-800">
            {t('auth.tag_matching')}
          </span>
        </div>
      </div>

      {/* Center: The Agricultural Network Diagram */}
      <div className="relative z-10 my-auto py-8">
        <motion.div
          animate={shouldReduceMotion ? {} : { y: [0, -3, 2, 0], x: [0, 2, -2, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
          className="w-full max-w-lg mx-auto"
        >
          <svg viewBox="0 0 500 360" className="w-full h-auto overflow-visible">
            <defs>
              <linearGradient id="corridor-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#15803d" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#8FBF2E" stopOpacity="0.6" />
              </linearGradient>
            </defs>

            {/* Connecting Supply Network Lines */}
            <g stroke="rgba(21, 128, 61, 0.35)" strokeWidth="1.5" strokeDasharray="3 3">
              {/* Ramesh Kumar -> Consolidation */}
              <line x1="110" y1="80" x2="250" y2="170" />
              {/* Suresh FPO -> Consolidation */}
              <line x1="390" y1="90" x2="250" y2="170" />
              {/* Consolidation -> Milk Run Route */}
              <line x1="250" y1="170" x2="380" y2="260" />
              {/* Milk Run -> Buyer */}
              <line x1="380" y1="260" x2="140" y2="280" />
              {/* Direct Escrow Line */}
              <line x1="110" y1="80" x2="140" y2="280" stroke="rgba(143, 191, 46, 0.25)" strokeDasharray="2 4" />
            </g>

            {/* Node 1: Nashik Farmer Cluster */}
            <g transform="translate(110, 80)">
              <circle r="7" fill="#080d0a" stroke="#8FBF2E" strokeWidth="2" />
              <circle r="3" fill="#8FBF2E" />
              <text x="-12" y="-14" fill="#f4f5f1" fontSize="10" fontFamily="sans-serif" fontWeight="bold">
                Nashik Cluster
              </text>
              <text x="-12" y="24" fill="#9ea8a0" fontSize="9" fontFamily="monospace">
                Ramesh Kumar (500kg)
              </text>
            </g>

            {/* Node 2: Pune FPO Hub */}
            <g transform="translate(390, 90)">
              <circle r="7" fill="#080d0a" stroke="#10b981" strokeWidth="2" />
              <circle r="3" fill="#10b981" />
              <text x="-40" y="-14" fill="#f4f5f1" fontSize="10" fontFamily="sans-serif" fontWeight="bold">
                Pune Agri Hub
              </text>
              <text x="-40" y="24" fill="#9ea8a0" fontSize="9" fontFamily="monospace">
                Suresh FPO (300kg)
              </text>
            </g>

            {/* Node 3: Center Consolidation & Grade Verification (Subtle Pulse) */}
            <g transform="translate(250, 170)">
              {!shouldReduceMotion && (
                <motion.circle
                  r="18"
                  fill="none"
                  stroke="rgba(217, 119, 6, 0.4)"
                  strokeWidth="1.5"
                  animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
              <circle r="9" fill="#080d0a" stroke="#d97706" strokeWidth="2" />
              <circle r="4" fill="#d97706" />
              <text x="18" y="-4" fill="#f4f5f1" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
                Lot Consolidation
              </text>
              <text x="18" y="12" fill="#fbbf24" fontSize="9" fontFamily="monospace">
                AGMARK Grade-A Verified
              </text>
            </g>

            {/* Node 4: Milk-Run Optimized Corridor */}
            <g transform="translate(380, 260)">
              <circle r="6" fill="#080d0a" stroke="#8FBF2E" strokeWidth="1.8" />
              <circle r="2.5" fill="#8FBF2E" />
              <text x="-50" y="-12" fill="#f4f5f1" fontSize="10" fontFamily="sans-serif" fontWeight="bold">
                Coordinated Route
              </text>
              <text x="-50" y="20" fill="#9ea8a0" fontSize="9" fontFamily="monospace">
                18.21 km Milk Run (-15%)
              </text>
            </g>

            {/* Node 5: Institutional Buyer Terminal */}
            <g transform="translate(140, 280)">
              <circle r="7" fill="#080d0a" stroke="#15803d" strokeWidth="2" />
              <circle r="3" fill="#15803d" />
              <text x="-12" y="-14" fill="#f4f5f1" fontSize="10" fontFamily="sans-serif" fontWeight="bold">
                Buyer Terminal
              </text>
              <text x="-12" y="24" fill="#9ea8a0" fontSize="9" fontFamily="monospace">
                PO #ORD-8812 (800kg)
              </text>
            </g>
          </svg>
        </motion.div>
      </div>

      {/* Bottom Architectural Status Strip */}
      <div className="relative z-10 border-t border-[#16271c] pt-5 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Agricultural Supply Network Online</span>
        </div>
        <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
          Deterministic farmgate allocation connecting verified growers directly with institutional buyers.
        </p>
      </div>
    </div>
  )
}

// ============================================================================
// Main Login Page Component
// ============================================================================
export default function LoginPage() {
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()
  const shouldReduceMotion = useReducedMotion()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await signIn(email, password)
      router.push('/marketplace')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Quick-fill helper for demo accounts
  const fillCredentials = (demoEmail: string) => {
    setEmail(demoEmail)
    setPassword('demo123')
    setError('')
  }

  // BoxReveal-style staggered animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.06,
        delayChildren: shouldReduceMotion ? 0 : 0.08,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.45,
        ease: [0.21, 0.47, 0.32, 0.98],
      },
    },
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-background transition-colors duration-200">
      {/* ===================================================================== */}
      {/* LEFT COLUMN: Agricultural Network Visualization (Desktop Only) */}
      {/* ===================================================================== */}
      <div className="hidden lg:flex lg:col-span-5 xl:col-span-6 bg-[#080d0a] text-white border-r border-[#16271c]">
        <AgriNetworkVisual />
      </div>

      {/* ===================================================================== */}
      {/* RIGHT COLUMN: Sign-in Form Container */}
      {/* ===================================================================== */}
      <div className="col-span-12 lg:col-span-7 xl:col-span-6 flex items-center justify-center p-6 sm:p-10 lg:p-14 overflow-y-auto">
        <div className="max-w-md w-full mx-auto">
          {/* Staggered BoxReveal Container */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* 1. Brand & Heading */}
            <motion.div variants={itemVariants} className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-custom bg-forest-900 text-white ring-1 ring-emerald-500/30 shadow-md mb-2">
                <Sprout className="w-6 h-6 text-[#8FBF2E]" />
              </div>
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-foreground tracking-tight">
                {t('auth.welcome_back')}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground font-sans max-w-sm mx-auto">
                {t('auth.signin_desc')}
              </p>
            </motion.div>

            {/* 2. Error Alert (Conditional) */}
            {error && (
              <motion.div variants={itemVariants}>
                <Alert type="error" onClose={() => setError('')}>
                  {error}
                </Alert>
              </motion.div>
            )}

            {/* 3. Main Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email with Pointer-Reactive Halo */}
              <motion.div variants={itemVariants}>
                <SpotlightInput
                  label={t('auth.email')}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="farmer1@demo.com"
                  icon={<Mail className="w-4 h-4" />}
                  required
                />
              </motion.div>

              {/* Password with Pointer-Reactive Halo */}
              <motion.div variants={itemVariants}>
                <SpotlightInput
                  label={t('auth.password')}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  icon={<Lock className="w-4 h-4" />}
                  required
                />
              </motion.div>

              {/* 4. Primary Sign-in Button */}
              <motion.div variants={itemVariants} className="pt-2">
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={shouldReduceMotion ? {} : { y: -2 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                  className="relative w-full py-3 px-4 rounded-custom bg-forest-900 hover:bg-forest-800 text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-colors duration-150 flex items-center justify-center gap-2 border border-emerald-700/40 group overflow-hidden active:scale-[0.98] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {/* Subtle sweep highlight on hover */}
                  <span className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-emerald-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                  
                  {isLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{t('auth.signing_in')}</span>
                    </span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-emerald-300" />
                      <span>{t('auth.btn_signin')}</span>
                      <ArrowRight className="w-4 h-4 text-emerald-300 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </motion.button>
              </motion.div>
            </form>

            {/* 5. Secondary Actions & Registration Link */}
            <motion.div variants={itemVariants} className="space-y-5 pt-1">
              <div className="text-center text-xs text-muted-foreground">
                <span>{t('auth.no_account')} </span>
                <Link
                  href="/register"
                  className="font-bold text-forest-900 dark:text-[#8FBF2E] hover:underline ml-1"
                >
                  {t('auth.register_link')}
                </Link>
              </div>

              {/* Interactive Demo Credentials Panel */}
              <div className="p-4 rounded-custom bg-[#fafaf8] dark:bg-[#111713] border border-border shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>{t('auth.demo_creds_title')}</span>
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {t('auth.quick_fill')}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                  {/* Farmer */}
                  <button
                    type="button"
                    onClick={() => fillCredentials('farmer1@demo.com')}
                    className="p-2 rounded bg-card-bg hover:bg-neutral-100 dark:hover:bg-[#1e2a21] border border-border hover:border-emerald-600/40 text-left transition cursor-pointer active:scale-95 group"
                    title="Fill farmer credentials"
                  >
                    <span className="text-[10px] text-muted-foreground block group-hover:text-forest-900 dark:group-hover:text-[#8FBF2E] font-sans font-semibold">
                      {t('auth.demo_farmer_label')}
                    </span>
                    <span className="text-[11px] text-foreground font-bold truncate block">farmer1@demo.com</span>
                    <span className="text-[10px] text-neutral-400 block font-mono">demo123</span>
                  </button>

                  {/* Buyer */}
                  <button
                    type="button"
                    onClick={() => fillCredentials('buyer1@demo.com')}
                    className="p-2 rounded bg-card-bg hover:bg-neutral-100 dark:hover:bg-[#1e2a21] border border-border hover:border-emerald-600/40 text-left transition cursor-pointer active:scale-95 group"
                    title="Fill buyer credentials"
                  >
                    <span className="text-[10px] text-muted-foreground block group-hover:text-forest-900 dark:group-hover:text-[#8FBF2E] font-sans font-semibold">
                      {t('auth.demo_buyer_label')}
                    </span>
                    <span className="text-[11px] text-foreground font-bold truncate block">buyer1@demo.com</span>
                    <span className="text-[10px] text-neutral-400 block font-mono">demo123</span>
                  </button>

                  {/* Admin */}
                  <button
                    type="button"
                    onClick={() => fillCredentials('admin@demo.com')}
                    className="p-2 rounded bg-card-bg hover:bg-neutral-100 dark:hover:bg-[#1e2a21] border border-border hover:border-emerald-600/40 text-left transition cursor-pointer active:scale-95 group"
                    title="Fill admin credentials"
                  >
                    <span className="text-[10px] text-muted-foreground block group-hover:text-forest-900 dark:group-hover:text-[#8FBF2E] font-sans font-semibold">
                      {t('auth.demo_admin_label')}
                    </span>
                    <span className="text-[11px] text-foreground font-bold truncate block">admin@demo.com</span>
                    <span className="text-[10px] text-neutral-400 block font-mono">demo123</span>
                  </button>
                </div>
              </div>

              {/* Navigation Back */}
              <div className="text-center pt-1">
                <Link
                  href="/marketplace"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{t('auth.back_home')}</span>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}