'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { Reveal } from '@/components/motion'
import { Card, CardContent, Button, LoadingSpinner, Alert } from '@/components/ui'
import { 
  ArrowLeft, 
  Printer, 
  Truck, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  FileJson, 
  Copy, 
  CheckCheck, 
  X, 
  Download,
  AlertCircle
} from 'lucide-react'
import { getCommodityImage, getCommodityAlt } from '@/lib/commodities'
import { useLanguage } from '@/contexts/LanguageContext'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { Order, OrderStatus } from '@/types/orders'
import { demoOrders } from '@/lib/demo/orders'
import { cn } from '@/lib/utils'

export default function OrderDetailPage() {
  const { t } = useLanguage()
  const { userId } = useCurrentUser()
  const params = useParams()
  const orderId = (params?.id as string) || 'ORD-001'

  const [order, setOrder] = useState<Order | null>(() => {
    return demoOrders.find(o => o.id.toLowerCase() === orderId.toLowerCase()) || null
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showManifestModal, setShowManifestModal] = useState(false)
  const [copiedManifest, setCopiedManifest] = useState(false)

  // Fetch genuine order by querying /api/orders
  const fetchOrder = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`/api/orders?buyer_id=${userId || 'buyer1'}`)
      if (response.ok) {
        const orders: Order[] = await response.json()
        const found = orders.find(o => o.id.toLowerCase() === orderId.toLowerCase())
        if (found) {
          setOrder(found)
        } else {
          setOrder(null)
          setError(t('order_detail.order_not_found'))
        }
      } else {
        const errData = await response.json()
        throw new Error(errData.error || 'Failed to fetch order details')
      }
    } catch (err: unknown) {
      console.error('Order fetch error:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch order')
    } finally {
      setLoading(false)
    }
  }, [orderId, userId, t])

  useEffect(() => {
    fetchOrder()
  }, [fetchOrder])

  // Supported deterministic lifecycle stages
  const LIFECYCLE_STAGES: Array<{ key: OrderStatus; labelKey: string }> = [
    { key: 'pending', labelKey: 'order.status.pending' },
    { key: 'confirmed', labelKey: 'order.status.confirmed' },
    { key: 'processing', labelKey: 'order.status.processing' },
    { key: 'ready_for_pickup', labelKey: 'order.status.ready_for_pickup' },
    { key: 'shipped', labelKey: 'order.status.shipped' },
    { key: 'delivered', labelKey: 'order.status.delivered' },
  ]

  // Determine current lifecycle progress index
  const currentStageIndex = useMemo(() => {
    if (!order) return 0
    if (order.status === 'cancelled' || order.status === 'rejected') return -1
    const idx = LIFECYCLE_STAGES.findIndex(s => s.key === order.status)
    return idx >= 0 ? idx : 0
  }, [order, LIFECYCLE_STAGES])

  // Farmgate supplier allocations total
  const farmgateTotal = useMemo(() => {
    if (!order?.items) return 0
    return order.items.reduce((acc, i) => acc + (i.subtotal || i.quantity * i.price_per_unit), 0)
  }, [order])

  const totalQuantity = useMemo(() => {
    if (!order?.items) return 0
    return order.items.reduce((acc, i) => acc + (i.quantity || 0), 0)
  }, [order])

  const primaryCommodity = order?.items?.[0]?.product_name || 'Produce'

  // Copy raw manifest JSON
  const handleCopyManifest = () => {
    if (!order) return
    navigator.clipboard.writeText(JSON.stringify(order, null, 2))
    setCopiedManifest(true)
    setTimeout(() => setCopiedManifest(false), 2000)
  }

  // Download raw manifest JSON file
  const handleDownloadManifest = () => {
    if (!order) return
    const blob = new Blob([JSON.stringify(order, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `manifest-${order.id}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Status Badge Helper
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
      <span className={cn('inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider', colorClasses)}>
        {label}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] py-16">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-xs font-mono text-muted-foreground">
          {t('orders.operations_title')} — Loading order record...
        </p>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-6">
        <Link href="/buyer/orders" className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" />
          {t('order_detail.back')}
        </Link>
        <Card className="border border-border bg-card-bg p-8 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
          <h2 className="text-xl font-bold font-display text-foreground">{t('order_detail.order_not_found')}</h2>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Order ID <span className="font-mono font-bold text-foreground">{orderId}</span> is not present in the current procurement registry.
          </p>
          <div className="pt-2">
            <Link href="/buyer/orders">
              <Button variant="primary" size="sm">
                {t('order_detail.btn_all_orders')}
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  const formattedCreatedDate = new Date(order.created_at).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* 1. Top Navigation & Action Controls */}
      <Reveal>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <Link 
            href="/buyer/orders" 
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('order_detail.back')}
          </Link>

          <div className="flex items-center gap-2.5">
            <Link href={`/buyer/route?order_id=${order.id}`}>
              <Button variant="outline" size="sm" className="text-xs font-semibold border-border">
                <Truck className="w-3.5 h-3.5 mr-1.5 text-primary" />
                {t('common.view_route')}
              </Button>
            </Link>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowManifestModal(true)}
              className="text-xs font-semibold border-border"
            >
              <FileJson className="w-3.5 h-3.5 mr-1.5" />
              {t('order_detail.view_manifest_btn')}
            </Button>

            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.print()}
              className="text-xs font-semibold border-border"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              Print Order
            </Button>
          </div>
        </div>
      </Reveal>

      {/* 2. Order Header Identity */}
      <Reveal delay={0.05}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
          <div>
            <div className="flex items-center gap-2 mb-1 text-xs text-muted-foreground font-mono">
              <span className="font-bold text-foreground">Order ID: {order.id}</span>
              <span>•</span>
              <span>{t('order_detail.placed_on')} {formattedCreatedDate}</span>
              {order.buyer_name && (
                <>
                  <span>•</span>
                  <span>{order.buyer_name}</span>
                </>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-foreground">
              {t('order_detail.consignment_title')}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              {t('order_detail.consignment_desc')}
            </p>
          </div>

          <div className="shrink-0">
            {renderStatusBadge(order.status)}
          </div>
        </div>
      </Reveal>

      {/* 3. Lifecycle Timeline */}
      <Reveal delay={0.1}>
        <Card className="border border-border bg-card-bg shadow-sm">
        <CardContent className="p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-border pb-2.5">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-foreground">
                {t('order_detail.timeline_heading')}
              </h3>
            </div>
            <span className="text-[11px] text-muted-foreground italic">
              {t('order_detail.status_supported_note')}
            </span>
          </div>

          {/* Timeline Bar */}
          {order.status === 'cancelled' || order.status === 'rejected' ? (
            <Alert type="error">
              This procurement order was marked as {order.status.toUpperCase()} and removed from active fulfillment.
            </Alert>
          ) : (
            <div className="overflow-x-auto pb-2">
              <div className="flex items-center justify-between min-w-[620px] pt-2">
                {LIFECYCLE_STAGES.map((stage, idx) => {
                  const isCompleted = idx < currentStageIndex
                  const isCurrent = idx === currentStageIndex
                  const isUpcoming = idx > currentStageIndex

                  return (
                    <div key={stage.key} className="flex-1 flex flex-col items-center relative">
                      {/* Connecting Line */}
                      {idx < LIFECYCLE_STAGES.length - 1 && (
                        <div className={cn(
                          'absolute top-4 left-1/2 w-full h-0.5 -z-0',
                          idx < currentStageIndex ? 'bg-primary' : 'bg-neutral-200 dark:bg-neutral-800'
                        )} />
                      )}

                      {/* Node Icon */}
                      <div className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold border-2 transition-all relative z-10',
                        isCurrent && 'bg-primary text-white border-primary ring-4 ring-primary/20',
                        isCompleted && 'bg-primary text-white border-primary',
                        isUpcoming && 'bg-card-bg text-muted-foreground border-border'
                      )}>
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>

                      {/* Label */}
                      <div className="text-center mt-2 px-1">
                        <span className={cn(
                          'text-xs font-semibold block leading-tight',
                          isCurrent ? 'text-primary font-bold' : isCompleted ? 'text-foreground' : 'text-muted-foreground'
                        )}>
                          {t(stage.labelKey)}
                        </span>

                        {/* Real timestamps: only shown if genuinely provided by order record */}
                        {idx === 0 && order.created_at && (
                          <span className="text-[10px] font-mono text-muted-foreground block mt-0.5">
                            {formattedCreatedDate}
                          </span>
                        )}
                        {isCurrent && idx > 0 && order.updated_at && order.updated_at !== order.created_at && (
                          <span className="text-[10px] font-mono text-primary block mt-0.5">
                            {new Date(order.updated_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      </Reveal>

      {/* 4. Batch PO Summary Banner */}
      <Reveal delay={0.15}>
        <Card className="border border-border bg-card-bg shadow-sm overflow-hidden">
          <div className="p-5 sm:p-6 bg-primary/5 dark:bg-primary-950/30 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-border shrink-0 bg-neutral-100 dark:bg-neutral-800">
                <Image
                  src={getCommodityImage(primaryCommodity)}
                  alt={getCommodityAlt(primaryCommodity)}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary dark:text-[#8FBF2E]">
                  {t('order_detail.batch_po')}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold font-display text-foreground mt-0.5">
                  {totalQuantity.toLocaleString()} kg {primaryCommodity}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 font-mono">
                  {order.items?.length || 0} consolidated lot(s) aggregated direct from farmgate
                </p>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 md:border-l md:border-border md:pl-6">
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider block">{t('order_detail.total_net_val')}</span>
                <span className="text-2xl font-bold font-mono text-foreground">
                  ₹{(order.total_amount || farmgateTotal).toLocaleString()}
                </span>
              </div>

              {order.intermediary_savings ? (
                <div className="p-3 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{t('orders.col_savings')}</span>
                  </div>
                  <span className="text-base font-bold font-mono text-emerald-700 dark:text-emerald-400 block mt-0.5">
                    ₹{order.intermediary_savings.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block">
                    {t('order_detail.sih_calculation_note')}
                  </span>
                </div>
              ) : null}
            </div>
          </div>

          {/* 5. Supplier Lot Allocations Table */}
          <CardContent className="p-6 space-y-6">
            <div>
              <h3 className="font-display font-bold text-sm text-foreground uppercase tracking-wider mb-3">
                {t('order_detail.matched_producers')} ({order.items?.length || 0})
              </h3>

              <div className="overflow-x-auto border border-border rounded-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-neutral-50 dark:bg-neutral-900/60 border-b border-border text-muted-foreground uppercase tracking-wider font-semibold text-[11px]">
                      <th className="py-3 px-4">{t('order_detail.col_supplier')}</th>
                      <th className="py-3 px-4 font-mono">{t('order_detail.volume')}</th>
                      <th className="py-3 px-4 font-mono">Price / Unit</th>
                      <th className="py-3 px-4 font-mono text-right">{t('order_detail.col_payout')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {(order.items || []).map((item, idx) => (
                      <tr key={item.id || idx} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-foreground text-sm">{item.farmer_name}</div>
                          <span className="text-[11px] text-muted-foreground font-mono">
                            {item.product_name} {item.product_variety ? `(${item.product_variety})` : ''} • Lot ID: {item.id}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                          {item.quantity} {item.unit || 'kg'}
                        </td>

                        <td className="py-3.5 px-4 font-mono text-muted-foreground">
                          ₹{item.price_per_unit} / {item.unit || 'kg'}
                        </td>

                        <td className="py-3.5 px-4 font-mono font-bold text-foreground text-right text-sm">
                          ₹{(item.subtotal || item.quantity * item.price_per_unit).toLocaleString()}
                        </td>
                      </tr>
                    ))}

                    {/* Subtotal Row */}
                    <tr className="bg-neutral-50 dark:bg-neutral-900/50 font-bold border-t-2 border-border">
                      <td className="py-3.5 px-4 text-foreground">
                        {t('order_detail.farmgate_total')}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-foreground">
                        {totalQuantity} kg
                      </td>
                      <td className="py-3.5 px-4 font-mono text-muted-foreground text-xs">
                        Avg ₹{(farmgateTotal / (totalQuantity || 1)).toFixed(2)} / kg
                      </td>
                      <td className="py-3.5 px-4 font-mono text-foreground text-right text-sm">
                        ₹{farmgateTotal.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 6. Financial Settlement Card & Delivery Specs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Financial Settlement Breakdown */}
              <div className="p-4 rounded-xl border border-border bg-neutral-50/50 dark:bg-neutral-900/40 space-y-3">
                <span className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground block">
                  Financial Settlement Breakdown
                </span>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t('order_detail.farmgate_total')}:</span>
                    <span className="font-mono font-bold text-foreground">₹{farmgateTotal.toLocaleString()}</span>
                  </div>

                  {/* Logistics cost row */}
                  {order.logistics_cost && order.logistics_cost > 0 ? (
                    <div className="flex items-center justify-between border-t border-border pt-1">
                      <span className="text-muted-foreground">{t('order_detail.logistics_cost_label')}:</span>
                      <span className="font-mono font-semibold text-foreground">₹{order.logistics_cost.toLocaleString()}</span>
                    </div>
                  ) : null}

                  <div className="flex items-center justify-between border-t-2 border-border pt-2 text-sm font-bold">
                    <span className="text-foreground">{t('order_detail.net_settlement')}:</span>
                    <span className="font-mono text-primary dark:text-[#8FBF2E]">
                      ₹{(order.total_amount || farmgateTotal).toLocaleString()}
                    </span>
                  </div>

                  {order.intermediary_savings ? (
                    <div className="flex items-center justify-between pt-1 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
                      <span>{t('order_detail.market_savings')}:</span>
                      <span className="font-mono font-bold">₹{order.intermediary_savings.toLocaleString()}</span>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Delivery Destination & Route Integration */}
              <div className="p-4 rounded-xl border border-border bg-neutral-50/50 dark:bg-neutral-900/40 space-y-3 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground block">
                    {t('order_detail.delivery_address')}
                  </span>
                  <p className="text-sm font-semibold text-foreground mt-1">
                    {order.delivery_address || 'Designated Delivery Depot'}
                  </p>
                  {order.delivery_lat && order.delivery_lng && (
                    <p className="text-xs font-mono text-muted-foreground mt-0.5">
                      Depot Coords: {order.delivery_lat.toFixed(4)}° N, {order.delivery_lng.toFixed(4)}° E
                    </p>
                  )}
                  {order.notes && (
                    <p className="text-xs text-muted-foreground italic mt-1.5">
                      Note: {order.notes}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Logistics Planning:</span>
                  <Link href={`/buyer/route?order_id=${order.id}`}>
                    <Button variant="primary" size="sm" className="text-xs">
                      <Truck className="w-3.5 h-3.5 mr-1" />
                      {t('common.view_route')}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Reveal>

      {/* 7. Raw Manifest Modal */}
      <AnimatePresence>
        {showManifestModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.98, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 8 }}
              transition={{ duration: 0.2 }}
              className="bg-card-bg border border-border rounded-xl shadow-xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <FileJson className="w-5 h-5 text-primary" />
                  <h3 className="font-display font-bold text-base text-foreground">
                    Order Manifest: {order.id}
                  </h3>
                </div>
                <button
                  onClick={() => setShowManifestModal(false)}
                  className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-muted-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 overflow-y-auto flex-1 bg-neutral-950 text-neutral-100 text-xs font-mono rounded-b-xl">
                <pre className="whitespace-pre-wrap">{JSON.stringify(order, null, 2)}</pre>
              </div>

              <div className="p-3 border-t border-border flex items-center justify-between bg-card-bg">
                <span className="text-xs text-muted-foreground font-mono">
                  {order.items?.length || 0} items • Status: {order.status}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDownloadManifest}
                    className="text-xs"
                  >
                    <Download className="w-3.5 h-3.5 mr-1" />
                    Save JSON
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopyManifest}
                    className="text-xs"
                  >
                    {copiedManifest ? (
                      <>
                        <CheckCheck className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                        {t('matching.copied')}
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 mr-1" />
                        {t('matching.btn_copy_json')}
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => setShowManifestModal(false)}
                    className="text-xs"
                  >
                    {t('matching.btn_close')}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
