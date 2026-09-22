'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { Card, CardContent, Button, Alert, Input } from '@/components/ui'
import { 
  Search, 
  RotateCw, 
  ArrowUpDown, 
  Plus, 
  Package, 
  CheckCircle2, 
  Clock, 
  IndianRupee, 
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { Order, OrderStatus, isCancellable } from '@/types/orders'
import { demoOrders } from '@/lib/demo/orders'
import { useLanguage } from '@/contexts/LanguageContext'
import { cn } from '@/lib/utils'
import { Reveal, StaggerContainer, StaggerItem } from '@/components/motion'

export default function BuyerOrdersPage() {
  const { t } = useLanguage()
  const { userId } = useCurrentUser()
  const [orders, setOrders] = useState<Order[]>(() => [...demoOrders])
  const [loading, setLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'amount_desc' | 'volume_desc'>('date_desc')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`/api/orders?buyer_id=${userId || 'buyer1'}`)
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      } else {
        const errData = await response.json()
        throw new Error(errData.error || 'Failed to fetch orders')
      }
    } catch (err: unknown) {
      console.error('Error fetching orders:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  // Cancel order action
  const cancelOrder = async (orderId: string) => {
    if (!confirm(t('orders.confirm_cancel'))) return
    
    try {
      setCancellingOrderId(orderId)
      const response = await fetch('/api/orders/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderId,
          status: 'cancelled',
        }),
      })

      if (response.ok) {
        setSuccess(t('orders.cancel_success'))
        setError('')
        await fetchOrders()
      } else {
        const errorData = await response.json()
        setError(`Failed to cancel order: ${errorData.error}`)
        setSuccess('')
      }
    } catch (err: unknown) {
      console.error('Error cancelling order:', err)
      setError(t('orders.cancel_error'))
      setSuccess('')
    } finally {
      setCancellingOrderId(null)
    }
  }

  // Real KPI metrics calculated exclusively from actual order data
  const metrics = useMemo(() => {
    let activeCount = 0
    let completedCount = 0
    let totalSpend = 0
    let totalVolume = 0
    let totalSavings = 0

    orders.forEach(order => {
      totalSpend += order.total_amount || 0
      totalSavings += order.intermediary_savings || 0

      if (order.status === 'delivered') {
        completedCount++
      } else if (order.status !== 'cancelled' && order.status !== 'rejected') {
        activeCount++
      }

      if (order.items && order.items.length > 0) {
        order.items.forEach(item => {
          totalVolume += item.quantity || 0
        })
      }
    })

    return {
      activeCount,
      completedCount,
      totalSpend,
      totalVolume,
      totalSavings,
    }
  }, [orders])

  // Filter and sort orders
  const filteredAndSortedOrders = useMemo(() => {
    let result = [...orders]

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(o => o.status === statusFilter)
    }

    // Text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(o => {
        const matchId = o.id.toLowerCase().includes(q)
        const matchAddress = o.delivery_address?.toLowerCase().includes(q)
        const matchItem = o.items?.some(i => 
          i.product_name.toLowerCase().includes(q) || 
          i.farmer_name.toLowerCase().includes(q)
        )
        return matchId || matchAddress || matchItem
      })
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'date_desc') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
      if (sortBy === 'date_asc') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      }
      if (sortBy === 'amount_desc') {
        return (b.total_amount || 0) - (a.total_amount || 0)
      }
      if (sortBy === 'volume_desc') {
        const volA = (a.items || []).reduce((acc, i) => acc + (i.quantity || 0), 0)
        const volB = (b.items || []).reduce((acc, i) => acc + (i.quantity || 0), 0)
        return volB - volA
      }
      return 0
    })

    return result
  }, [orders, statusFilter, searchQuery, sortBy])

  // Centralized human-readable status badge styling
  const renderStatusBadge = (status: OrderStatus) => {
    const label = t(`order.status.${status}`) || status.replace(/_/g, ' ')
    
    let colorClasses = 'bg-neutral-100 text-neutral-800 border-neutral-300 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700'
    if (status === 'delivered') {
      colorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
    } else if (status === 'pending') {
      colorClasses = 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800'
    } else if (status === 'confirmed') {
      colorClasses = 'bg-blue-50 text-blue-800 border-blue-300 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800'
    } else if (status === 'processing') {
      colorClasses = 'bg-purple-50 text-purple-800 border-purple-300 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800'
    } else if (status === 'ready_for_pickup') {
      colorClasses = 'bg-sky-50 text-sky-800 border-sky-300 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800'
    } else if (status === 'shipped') {
      colorClasses = 'bg-primary/10 text-primary border-primary/20 dark:text-[#8FBF2E] dark:border-primary-800'
    } else if (status === 'cancelled' || status === 'rejected') {
      colorClasses = 'bg-red-50 text-red-800 border-red-300 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800'
    }

    return (
      <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border uppercase tracking-wider', colorClasses)}>
        {label}
      </span>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* 1. Breadcrumb & Workspace Header */}
      <Reveal>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-5">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
            <Link href="/" className="hover:text-foreground transition-colors">{t('nav.title')}</Link>
            <span>/</span>
            <Link href="/buyer" className="hover:text-foreground transition-colors">{t('portal.buyer_portal')}</Link>
            <span>/</span>
            <span className="text-foreground font-medium">{t('orders.operations_title')}</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground tracking-tight">
            {t('orders.operations_title')}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-3xl leading-relaxed">
            {t('orders.operations_subtitle')}
          </p>
        </div>

        {/* Utility Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchOrders}
            className="border-border text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold"
            disabled={loading}
          >
            <RotateCw className={cn('w-3.5 h-3.5 mr-1.5 text-primary', loading && 'animate-spin')} />
            {t('orders.btn_refresh')}
          </Button>

          <Link href="/buyer/matching">
            <Button
              variant="primary"
              size="sm"
              className="text-xs font-semibold shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              {t('orders.btn_new_requisition')}
            </Button>
          </Link>
        </div>
      </div>
      </Reveal>

      {/* Notifications / Alerts */}
      {error && (
        <Alert type="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert type="success" onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* 2. Operational KPIs Bar (Computed strictly from real order data) */}
      <Reveal delay={0.08}>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
        <Card className="border border-border bg-card-bg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">{t('orders.stat_active')}</span>
              <Clock className="w-4 h-4 text-primary" />
            </div>
            <p className="text-2xl font-bold font-mono text-foreground mt-0.5">{metrics.activeCount}</p>
            <span className="text-[10px] text-muted-foreground">In pipeline</span>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card-bg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">{t('orders.stat_completed')}</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-2xl font-bold font-mono text-foreground mt-0.5">{metrics.completedCount}</p>
            <span className="text-[10px] text-muted-foreground">Settled farmgate</span>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card-bg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">{t('orders.stat_volume')}</span>
              <Package className="w-4 h-4 text-primary" />
            </div>
            <p className="text-2xl font-bold font-mono text-foreground mt-0.5">
              {metrics.totalVolume.toLocaleString()} <span className="text-xs font-normal">kg</span>
            </p>
            <span className="text-[10px] text-muted-foreground">Aggregated produce</span>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card-bg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">{t('orders.stat_spend')}</span>
              <IndianRupee className="w-4 h-4 text-primary" />
            </div>
            <p className="text-2xl font-bold font-mono text-foreground mt-0.5">
              ₹{metrics.totalSpend.toLocaleString()}
            </p>
            <span className="text-[10px] text-muted-foreground font-mono">
              {orders.length} order(s) total
            </span>
          </CardContent>
        </Card>

        <Card className="border border-emerald-200 dark:border-emerald-800 bg-emerald-50/80 dark:bg-emerald-950/40 col-span-2 md:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-emerald-900 dark:text-emerald-300 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">{t('orders.stat_savings_val')}</span>
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-2xl font-bold font-mono text-emerald-700 dark:text-emerald-400 mt-0.5">
              ₹{metrics.totalSavings.toLocaleString()}
            </p>
            <span className="text-[10px] text-emerald-800 dark:text-emerald-300 block">
              * Direct procurement savings
            </span>
          </CardContent>
        </Card>
      </div>
      </Reveal>

      {/* 3. Search & Filter Toolbar */}
      <Reveal delay={0.12}>
      <Card className="border border-border bg-card-bg shadow-xs">
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('orders.search_placeholder')}
                className="pl-9 text-xs h-9"
              />
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5" />
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-3 py-1.5 border border-border rounded-lg bg-card-bg text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="date_desc">{t('orders.sort_newest')}</option>
                <option value="date_asc">{t('orders.sort_oldest')}</option>
                <option value="amount_desc">{t('orders.sort_highest_val')}</option>
                <option value="volume_desc">{t('orders.sort_highest_vol')}</option>
              </select>
            </div>
          </div>

          {/* Status Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-xs">
            <span className="text-muted-foreground flex items-center gap-1 mr-1 text-[11px] font-semibold shrink-0">
              <Filter className="w-3 h-3" /> {t('common.filter')}:
            </span>
            {(['all', 'pending', 'confirmed', 'processing', 'ready_for_pickup', 'shipped', 'delivered', 'cancelled'] as const).map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={cn(
                  'px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors shrink-0 border',
                  statusFilter === status
                    ? 'bg-primary text-white border-primary'
                    : 'bg-neutral-50 dark:bg-neutral-900 border-border text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800'
                )}
              >
                {status === 'all' ? t('orders.filter_all') : t(`order.status.${status}`)}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
      </Reveal>

      {/* 4. Orders Data Register Table */}
      <Reveal delay={0.16}>
      <Card className="border border-border bg-card-bg shadow-sm overflow-hidden">
        {filteredAndSortedOrders.length === 0 ? (
          <div className="text-center py-16 px-4">
            <Package className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <h3 className="font-display font-bold text-base text-foreground">
              {t('orders.no_orders')}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              No orders match the selected filters. You can clear filters or start a new requisition in Supplier Matching.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <Button size="sm" variant="outline" onClick={() => { setStatusFilter('all'); setSearchQuery(''); }}>
                Clear Filters
              </Button>
              <Link href="/buyer/matching">
                <Button size="sm" variant="primary">
                  {t('orders.btn_new_requisition')}
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop Table View (>= 768px) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-neutral-50 dark:bg-neutral-900/60 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">{t('orders.col_id')}</th>
                    <th className="py-3 px-4">{t('orders.col_date')}</th>
                    <th className="py-3 px-4">{t('orders.col_commodity')}</th>
                    <th className="py-3 px-4 font-mono">{t('orders.col_volume')}</th>
                    <th className="py-3 px-4">{t('orders.col_suppliers')}</th>
                    <th className="py-3 px-4 font-mono">{t('orders.col_amount')}</th>
                    <th className="py-3 px-4">{t('orders.col_status')}</th>
                    <th className="py-3 px-4 text-right">{t('orders.col_actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredAndSortedOrders.map((order) => {
                    const totalVolume = (order.items || []).reduce((acc, i) => acc + (i.quantity || 0), 0)
                    const commodityNames = Array.from(new Set((order.items || []).map(i => i.product_name))).join(', ') || 'Produce'
                    const supplierNames = (order.items || []).map(i => i.farmer_name).filter(Boolean)
                    const formattedDate = new Date(order.created_at).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })

                    return (
                      <tr key={order.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                          <Link href={`/buyer/orders/${order.id}`} className="hover:text-primary transition-colors">
                            {order.id}
                          </Link>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-muted-foreground">
                          {formattedDate}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-foreground block">{commodityNames}</span>
                          <span className="text-[10px] text-muted-foreground">
                            {order.items?.length || 0} consolidated lot(s)
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                          {totalVolume > 0 ? `${totalVolume.toLocaleString()} kg` : '—'}
                        </td>

                        <td className="py-3.5 px-4 text-muted-foreground">
                          {supplierNames.length > 0 ? (
                            <span className="truncate max-w-[180px] block" title={supplierNames.join(', ')}>
                              {supplierNames.join(' + ')}
                            </span>
                          ) : (
                            'Direct Farmgate'
                          )}
                        </td>

                        <td className="py-3.5 px-4 font-mono">
                          <span className="font-bold text-foreground text-sm block">
                            ₹{(order.total_amount || 0).toLocaleString()}
                          </span>
                          {order.intermediary_savings ? (
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block">
                              ₹{order.intermediary_savings.toLocaleString()} saved
                            </span>
                          ) : null}
                        </td>

                        <td className="py-3.5 px-4">
                          {renderStatusBadge(order.status)}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/buyer/orders/${order.id}`}>
                              <Button variant="outline" size="sm" className="text-xs h-7 px-2.5">
                                {t('orders.view_record')}
                              </Button>
                            </Link>

                            {isCancellable(order.status) && (
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => cancelOrder(order.id)}
                                disabled={cancellingOrderId === order.id}
                                className="text-xs h-7 px-2"
                              >
                                {cancellingOrderId === order.id ? t('orders.cancelling') : t('orders.cancel')}
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked Card View (< 768px) with No Horizontal Overflow */}
            <StaggerContainer className="md:hidden divide-y divide-border">
              {filteredAndSortedOrders.map((order) => {
                const totalVolume = (order.items || []).reduce((acc, i) => acc + (i.quantity || 0), 0)
                const commodityNames = Array.from(new Set((order.items || []).map(i => i.product_name))).join(', ') || 'Produce'
                const supplierNames = (order.items || []).map(i => i.farmer_name).filter(Boolean)
                const formattedDate = new Date(order.created_at).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })

                return (
                  <StaggerItem key={order.id}>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <Link href={`/buyer/orders/${order.id}`} className="font-mono font-bold text-sm text-primary">
                        {order.id}
                      </Link>
                      {renderStatusBadge(order.status)}
                    </div>

                    <div className="flex items-start justify-between text-xs">
                      <div>
                        <span className="font-semibold text-foreground text-sm block">{commodityNames}</span>
                        <span className="text-muted-foreground font-mono">{formattedDate}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-foreground text-base block">
                          ₹{(order.total_amount || 0).toLocaleString()}
                        </span>
                        <span className="font-mono text-muted-foreground text-xs">
                          {totalVolume} kg
                        </span>
                      </div>
                    </div>

                    {supplierNames.length > 0 && (
                      <div className="p-2 rounded bg-neutral-50 dark:bg-neutral-900 border border-border text-[11px] text-muted-foreground">
                        <span className="font-semibold text-foreground">Suppliers: </span>
                        {supplierNames.join(' + ')}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      {order.intermediary_savings ? (
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono font-semibold">
                          ₹{order.intermediary_savings.toLocaleString()} savings
                        </span>
                      ) : <span />}

                      <div className="flex items-center gap-2">
                        {isCancellable(order.status) && (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => cancelOrder(order.id)}
                            disabled={cancellingOrderId === order.id}
                            className="text-xs h-8 px-2.5"
                          >
                            {cancellingOrderId === order.id ? t('orders.cancelling') : t('orders.cancel')}
                          </Button>
                        )}
                        <Link href={`/buyer/orders/${order.id}`}>
                          <Button variant="primary" size="sm" className="text-xs h-8">
                            {t('orders.view_record')}
                            <ArrowRight className="w-3.5 h-3.5 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                  </StaggerItem>
                )
              })}
            </StaggerContainer>
          </>
        )}
      </Card>
      </Reveal>
    </div>
  )
}