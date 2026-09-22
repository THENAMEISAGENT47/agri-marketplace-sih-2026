'use client'

import React, { useEffect, useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  Button, 
  Alert, 
  LoadingSpinner, 
  Badge 
} from '@/components/ui'
import { 
  Sprout, 
  TrendingUp, 
  Package, 
  Plus, 
  ClipboardList, 
  User, 
  ArrowRight,
  ShieldCheck,
  Scale,
  Layers,
  MapPin
} from 'lucide-react'

import { useLanguage } from '@/contexts/LanguageContext'
import { useFarmerId, useFarmerProfile } from '@/hooks/useCurrentUser'
import { Order, formatOrderStatus } from '@/types/orders'
import { getCommodityImage, getCommodityAlt } from '@/lib/commodities'
import { Reveal, StaggerContainer, StaggerItem, MotionCard } from '@/components/motion'

interface FarmerInventoryItem {
  id: string
  product_id?: string
  product_name: string
  product_variety?: string
  variety?: string
  name?: string
  available_quantity?: number
  quantity?: number
  unit: string
  price_per_unit: number
  category?: string
  quality_grade?: string
}

interface FarmerAllocation {
  order_id: string
  product_name: string
  product_variety: string
  quantity: number
  unit: string
  price_per_unit: number
  total_payout: number
  status: Order['status']
  buyer_name: string
  created_at: string
}

export default function FarmerDashboardPage() {
  const { t } = useLanguage()
  const farmerId = useFarmerId()
  const farmerProfile = useFarmerProfile()

  const [inventory, setInventory] = useState<FarmerInventoryItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      // 1. Fetch live inventory for this farmer
      const invPromise = fetch(`/api/inventory?farmer_id=${farmerId}`).then(r => r.ok ? r.json() : [])
      
      // 2. Fetch synchronized order allocations for this farmer
      const ordersPromise = fetch(`/api/orders?farmer_id=${farmerId}`).then(r => r.ok ? r.json() : [])

      const [invData, ordersData]: [FarmerInventoryItem[], Order[]] = await Promise.all([
        invPromise,
        ordersPromise
      ])

      if (Array.isArray(invData)) {
        setInventory(invData)
      }

      if (Array.isArray(ordersData)) {
        setOrders(ordersData)
      }
    } catch (err: unknown) {
      console.error('Error fetching farmer dashboard data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }, [farmerId])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  // Extract allocations specifically belonging to this farmer from the shared orders data
  const allocations: FarmerAllocation[] = useMemo(() => {
    const list: FarmerAllocation[] = []
    orders.forEach(order => {
      if (Array.isArray(order.items)) {
        order.items.forEach(item => {
          if (item.farmer_id === farmerId) {
            list.push({
              order_id: order.id,
              product_name: item.product_name,
              product_variety: item.product_variety || '',
              quantity: item.quantity,
              unit: item.unit || 'kg',
              price_per_unit: item.price_per_unit,
              total_payout: item.subtotal || (item.quantity * item.price_per_unit),
              status: order.status,
              buyer_name: order.buyer_name || 'Designated Buyer',
              created_at: order.created_at
            })
          }
        })
      }
    })
    return list
  }, [orders, farmerId])

  // 100% Calculated Metrics (Per User Constraint #1 — ZERO hardcoding)
  const metrics = useMemo(() => {
    // Total realized payout for this farmer from verified allocations
    const realizedEarnings = allocations.reduce((sum, a) => sum + a.total_payout, 0)
    
    // Active allocations in progress
    const activeAllocationsCount = allocations.filter(a => 
      ['pending', 'confirmed', 'processing', 'ready_for_pickup', 'shipped'].includes(a.status)
    ).length

    // Total available stock across active crop lots
    const totalAvailableStock = inventory.reduce((sum, item) => {
      const qty = item.available_quantity != null ? item.available_quantity : (item.quantity != null ? item.quantity : 0)
      return sum + qty
    }, 0)

    // Total active lots listed
    const activeLotsCount = inventory.length

    return {
      realizedEarnings,
      activeAllocationsCount,
      totalAvailableStock,
      activeLotsCount
    }
  }, [allocations, inventory])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] py-16">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-xs font-mono text-muted-foreground">{t('common.loading')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {error && (
        <Alert type="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Hero Operational Banner */}
      <Reveal>
        <div className="relative rounded-2xl overflow-hidden border border-border bg-linear-to-r from-forest-900 via-primary-900 to-[#1F3D2B] text-white p-6 sm:p-8 shadow-xs">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-emerald-300 backdrop-blur-xs border border-white/10">
              <Sprout className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('farmer.dashboard.banner_tag')}</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white">
              {t('farmer.dashboard.banner_title')}
            </h1>
            
            <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed">
              {t('farmer.dashboard.banner_desc')}
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link href="/farmer/products">
                <Button variant="secondary" size="sm" className="bg-white text-forest-900 hover:bg-neutral-100 font-bold shadow-xs">
                  <Plus className="w-3.5 h-3.5 mr-1.5" />
                  {t('farmer.dashboard.btn_list')}
                </Button>
              </Link>
              <Link href="/farmer/orders">
                <Button variant="outline" size="sm" className="text-white border-white/30 hover:bg-white/10">
                  <ClipboardList className="w-3.5 h-3.5 mr-1.5" />
                  {t('farmer.dashboard.btn_orders')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Factual Producer KPI Cards */}
      <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Realized Earnings */}
        <StaggerItem>
          <MotionCard className="border border-border bg-card-bg shadow-xs h-full">
            <CardHeader className="pb-2">
              <CardDescription className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                {t('farmer.dashboard.kpi_revenue')}
              </CardDescription>
              <CardTitle className="text-2xl font-bold font-mono text-foreground mt-0.5">
                ₹{metrics.realizedEarnings.toLocaleString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-xs text-primary dark:text-[#8FBF2E] font-medium truncate">
                <TrendingUp className="w-3.5 h-3.5 mr-1 shrink-0" />
                <span>{t('farmer.dashboard.kpi_revenue_sub')}</span>
              </div>
            </CardContent>
          </MotionCard>
        </StaggerItem>

        {/* KPI 2: Active Allocations */}
        <StaggerItem>
          <MotionCard className="border border-border bg-card-bg shadow-xs h-full">
            <CardHeader className="pb-2">
              <CardDescription className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                {t('farmer.dashboard.kpi_allocations')}
              </CardDescription>
              <CardTitle className="text-2xl font-bold font-mono text-foreground mt-0.5">
                {metrics.activeAllocationsCount}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-xs text-muted-foreground truncate">
                <Package className="w-3.5 h-3.5 mr-1 shrink-0" />
                <span>{t('farmer.dashboard.kpi_allocations_sub')}</span>
              </div>
            </CardContent>
          </MotionCard>
        </StaggerItem>

        {/* KPI 3: Available Produce Stock */}
        <StaggerItem>
          <MotionCard className="border border-border bg-card-bg shadow-xs h-full">
            <CardHeader className="pb-2">
              <CardDescription className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                {t('farmer.dashboard.kpi_available_stock')}
              </CardDescription>
              <CardTitle className="text-2xl font-bold font-mono text-foreground mt-0.5">
                {metrics.totalAvailableStock.toLocaleString()} <span className="text-xs font-normal">kg</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-xs text-muted-foreground truncate">
                <Scale className="w-3.5 h-3.5 mr-1 shrink-0" />
                <span>{t('farmer.dashboard.kpi_available_stock_sub')}</span>
              </div>
            </CardContent>
          </MotionCard>
        </StaggerItem>

        {/* KPI 4: Active Lots Listed */}
        <StaggerItem>
          <MotionCard className="border border-border bg-card-bg shadow-xs h-full">
            <CardHeader className="pb-2">
              <CardDescription className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                {t('farmer.dashboard.kpi_active_lots')}
              </CardDescription>
              <CardTitle className="text-2xl font-bold font-mono text-foreground mt-0.5">
                {metrics.activeLotsCount}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-xs text-muted-foreground truncate">
                <Layers className="w-3.5 h-3.5 mr-1 shrink-0" />
                <span>{t('farmer.dashboard.kpi_active_lots_sub')}</span>
              </div>
            </CardContent>
          </MotionCard>
        </StaggerItem>
      </StaggerContainer>

      {/* Operational Shortcuts */}
      <StaggerContainer className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StaggerItem>
          <Link href="/farmer/products">
            <div className="p-4 rounded-xl border border-border bg-card-bg hover:border-primary/50 transition-colors flex items-center gap-3 shadow-xs h-full">
              <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary dark:text-[#8FBF2E] flex items-center justify-center shrink-0">
                <Plus className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground truncate">{t('farmer.dashboard.action_manage')}</p>
                <p className="text-[10px] text-muted-foreground truncate">{t('farmer.dashboard.action_manage_sub')}</p>
              </div>
            </div>
          </Link>
        </StaggerItem>

        <StaggerItem>
          <Link href="/farmer/orders">
            <div className="p-4 rounded-xl border border-border bg-card-bg hover:border-primary/50 transition-colors flex items-center gap-3 shadow-xs h-full">
              <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary dark:text-[#8FBF2E] flex items-center justify-center shrink-0">
                <ClipboardList className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground truncate">{t('farmer.dashboard.action_track')}</p>
                <p className="text-[10px] text-muted-foreground truncate">{t('farmer.dashboard.action_track_sub')}</p>
              </div>
            </div>
          </Link>
        </StaggerItem>

        <StaggerItem>
          <Link href="/farmer/profile">
            <div className="p-4 rounded-xl border border-border bg-card-bg hover:border-primary/50 transition-colors flex items-center gap-3 shadow-xs h-full">
              <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary dark:text-[#8FBF2E] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground truncate">{t('farmer.dashboard.action_payouts')}</p>
                <p className="text-[10px] text-muted-foreground truncate">{t('farmer.dashboard.action_payouts_sub')}</p>
              </div>
            </div>
          </Link>
        </StaggerItem>

        <StaggerItem>
          <Link href="/farmer/profile">
            <div className="p-4 rounded-xl border border-border bg-card-bg hover:border-primary/50 transition-colors flex items-center gap-3 shadow-xs h-full">
              <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary dark:text-[#8FBF2E] flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground truncate">{t('farmer.dashboard.action_profile')}</p>
                <p className="text-[10px] text-muted-foreground truncate">{farmerProfile.name}</p>
              </div>
            </div>
          </Link>
        </StaggerItem>
      </StaggerContainer>

      {/* Recent Produce Lot Allocations */}
      <Reveal delay={0.1}>
        <Card className="border border-border bg-card-bg shadow-xs overflow-hidden">
        <CardHeader className="p-5 border-b border-border pb-4 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold font-display text-foreground">
              {t('farmer.dashboard.recent_allocations')}
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              {t('farmer.dashboard.recent_allocations_sub')}
            </CardDescription>
          </div>
          <Link href="/farmer/orders">
            <Button variant="outline" size="sm" className="text-xs h-8">
              {t('farmer.dashboard.view_all_allocations')}
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {allocations.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground font-mono">
              {t('farmer.dashboard.empty_allocations')}
            </div>
          ) : (
            <div className="space-y-3">
              {allocations.map((alloc) => {
                const dateStr = new Date(alloc.created_at).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })

                return (
                  <div 
                    key={`${alloc.order_id}-${alloc.product_name}`}
                    className="p-4 rounded-xl border border-border bg-neutral-50/60 dark:bg-neutral-900/50 hover:border-primary/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      {/* Commodity Visual Image */}
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-border shrink-0 bg-neutral-100 dark:bg-neutral-800">
                        <Image
                          src={getCommodityImage(alloc.product_name)}
                          alt={getCommodityAlt(alloc.product_name, alloc.product_variety)}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>

                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <strong className="text-foreground text-sm font-semibold">
                            {alloc.product_name} {alloc.product_variety ? `(${alloc.product_variety})` : ''}
                          </strong>
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-primary/10 text-primary dark:text-[#8FBF2E] border border-primary/20">
                            {alloc.quantity} {alloc.unit}
                          </span>
                          <span className="text-xs font-mono text-muted-foreground">
                            @ ₹{alloc.price_per_unit}/{alloc.unit}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 flex-wrap">
                          <span className="font-mono font-bold text-foreground">#{alloc.order_id}</span>
                          <span>•</span>
                          <span>{t('farmer.dashboard.destination')}: <strong className="text-foreground">{alloc.buyer_name}</strong></span>
                          <span>•</span>
                          <span>{t('farmer.dashboard.placed_on')} {dateStr}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
                      <div className="text-left sm:text-right">
                        <span className="text-base font-bold font-mono text-foreground block">
                          ₹{alloc.total_payout.toLocaleString()}
                        </span>
                        <Badge 
                          variant={alloc.status === 'delivered' ? 'success' : alloc.status === 'confirmed' ? 'primary' : 'warning'} 
                          size="sm"
                        >
                          {formatOrderStatus(alloc.status)}
                        </Badge>
                      </div>
                      
                      <Link href="/farmer/orders">
                        <Button variant="outline" size="sm" className="text-xs h-8">
                          {t('farmer.dashboard.update_lot_btn')}
                        </Button>
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
      </Reveal>
    </div>
  )
}
