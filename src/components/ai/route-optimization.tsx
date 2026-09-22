import React, { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import { Reveal } from '@/components/motion'
import { Card, CardContent, CardHeader, CardTitle, Button, Alert, LoadingSpinner, Badge } from '../ui'
import { 
  Route as RouteIcon, 
  Truck, 
  RotateCw, 
  Info, 
  Navigation, 
  Compass, 
  ShieldCheck,
  CheckCircle2,
  Download,
  Copy,
  Check,
  ArrowLeft,
  FileJson,
  X,
  ExternalLink,
  MapPin,
  Warehouse,
  Boxes
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Order } from '@/types/orders'

export interface RouteStop {
  order: number
  type: 'pickup' | 'delivery'
  farmer_id?: string
  farmer_name?: string
  buyer_id?: string
  buyer_name?: string
  location: { lat: number; lng: number }
  address?: string
  quantity?: number
  status: string
  estimated_arrival?: string
}

export interface RouteOptimizationResult {
  optimized_route: {
    total_distance: number
    estimated_duration: number
    stops: RouteStop[]
    route_geometry: unknown
  }
  cost_analysis: {
    optimized_cost: number
    direct_cost: number
    savings: number
    savings_percentage: number
  }
  route_data: {
    total_quantity: number
    num_pickups: number
    optimization_algorithm: string
    demo_mode: boolean
    note: string
  }
}

export interface PickupLocation {
  farmer_id: string
  farmer_name: string
  location: { lat: number; lng: number }
  address: string
  quantity: number
}

export interface DeliveryLocation {
  buyer_id: string
  buyer_name: string
  location: { lat: number; lng: number }
  address: string
}

export interface RouteOptimizationProps {
  initialOrderId?: string
  showFullUI?: boolean
  onOrderPlacement?: (routeData: RouteOptimizationResult) => void
}

// Canonical fallback demo coordinates in Western Maharashtra (Nashik - Thane corridor)
const DEMO_PICKUPS: PickupLocation[] = [
  {
    farmer_id: 'farmer1',
    farmer_name: 'Ramesh Kumar',
    location: { lat: 19.0760, lng: 72.8777 },
    address: 'Village Road, Nashik',
    quantity: 500
  },
  {
    farmer_id: 'farmer2',
    farmer_name: 'Suresh FPO',
    location: { lat: 19.0860, lng: 72.8877 },
    address: 'FPO Office, Nashik',
    quantity: 300
  }
]

const DEMO_DELIVERY: DeliveryLocation = {
  buyer_id: 'buyer1',
  buyer_name: 'Sharma Traders / Buyer Depot',
  location: { lat: 19.0330, lng: 73.0297 },
  address: 'Market Area, Thane'
}

export function RouteOptimization({ initialOrderId, onOrderPlacement }: RouteOptimizationProps) {
  const { t } = useLanguage()

  // Active Order Context
  const [orderId, setOrderId] = useState<string>(initialOrderId || 'ORD-001')
  const [order, setOrder] = useState<Order | null>(null)
  const [orderLoading, setOrderLoading] = useState<boolean>(false)

  // Route Parameters
  const [pickupLocations, setPickupLocations] = useState<PickupLocation[]>(DEMO_PICKUPS)
  const [deliveryLocation, setDeliveryLocation] = useState<DeliveryLocation>(DEMO_DELIVERY)
  const [vehicleCapacity] = useState<number>(1000)

  // Execution & Results State
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [result, setResult] = useState<RouteOptimizationResult | null>(null)
  
  // Interactive UI State
  const [activeStop, setActiveStop] = useState<number | null>(null)
  const [mapZoom, setMapZoom] = useState<number>(1)
  const [mapLayer, setMapLayer] = useState<'corridor' | 'terrain' | 'schematic'>('corridor')
  const [showManifestModal, setShowManifestModal] = useState<boolean>(false)
  const [copyFeedback, setCopyFeedback] = useState<boolean>(false)

  // 1. Fetch Order Context if orderId is provided
  useEffect(() => {
    let ignore = false

    const fetchOrderContext = async () => {
      setOrderLoading(true)
      try {
        const res = await fetch('/api/orders')
        if (res.ok) {
          const orders: Order[] = await res.json()
          const matched = orders.find(o => o.id.toLowerCase() === orderId.toLowerCase())
          if (matched && !ignore) {
            setOrder(matched)

            // Derive actual pickup stops from order items if available
            if (Array.isArray(matched.items) && matched.items.length > 0) {
              const derivedPickups: PickupLocation[] = matched.items.map((item, idx) => {
                // Map to known prototype farm coordinates or fallback
                let loc = { lat: 19.0760 + (idx * 0.01), lng: 72.8777 + (idx * 0.01) }
                let addr = 'Nashik Farm Cluster'
                if (item.farmer_id === 'farmer1' || item.farmer_name.includes('Ramesh')) {
                  loc = { lat: 19.0760, lng: 72.8777 }
                  addr = 'Village Road, Nashik'
                } else if (item.farmer_id === 'farmer2' || item.farmer_name.includes('Suresh')) {
                  loc = { lat: 19.0860, lng: 72.8877 }
                  addr = 'FPO Office, Nashik'
                }

                return {
                  farmer_id: item.farmer_id,
                  farmer_name: item.farmer_name,
                  location: loc,
                  address: addr,
                  quantity: item.quantity
                }
              })
              setPickupLocations(derivedPickups)
            }

            // Derive delivery destination
            setDeliveryLocation({
              buyer_id: matched.buyer_id || 'buyer1',
              buyer_name: matched.buyer_name || 'Designated Buyer Depot',
              location: {
                lat: matched.delivery_lat || 19.0330,
                lng: matched.delivery_lng || 73.0297
              },
              address: matched.delivery_address || 'Market Area, Thane'
            })
          }
        }
      } catch (err) {
        console.error('Failed to load order context for route:', err)
      } finally {
        if (!ignore) setOrderLoading(false)
      }
    }

    fetchOrderContext()
    return () => {
      ignore = true
    }
  }, [orderId])

  // 2. Real Route Optimizer Invocation (Strictly Preserving Route Business Logic)
  const runRouteOptimization = useCallback(async (
    pickups: PickupLocation[], 
    delivery: DeliveryLocation, 
    capacity: number
  ) => {
    if (pickups.length === 0) {
      setError('Please provide at least one pickup location')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/ai/route-optimization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pickup_locations: pickups,
          delivery_location: delivery,
          vehicle_capacity: capacity,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Route optimization failed')
      }

      const data: RouteOptimizationResult = await response.json()
      setResult(data)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to calculate route'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Auto-run on mount or when pickup/delivery locations change
  useEffect(() => {
    runRouteOptimization(pickupLocations, deliveryLocation, vehicleCapacity)
  }, [pickupLocations, deliveryLocation, vehicleCapacity, runRouteOptimization])

  // Manual Trigger: Re-run Heuristic (Direct Real API Call per Constraint #5)
  const handleRerunHeuristic = () => {
    runRouteOptimization(pickupLocations, deliveryLocation, vehicleCapacity)
  }

  // Copy Route Summary Action
  const handleCopySummary = () => {
    if (!result?.optimized_route) return
    const stopsList = result.optimized_route.stops
      .map(s => `Stop ${s.order} (${s.type === 'pickup' ? 'Pickup' : 'Delivery'}): ${s.type === 'pickup' ? s.farmer_name : s.buyer_name} - ${s.quantity || result.route_data.total_quantity} kg [${s.address || 'Corridor Point'}]`)
      .join('\n')

    const summaryText = `AgriMarketplace B2B Logistics Route Summary
Order: ${orderId}
Total Distance: ${result.optimized_route.total_distance} km
Estimated Duration: ${result.optimized_route.estimated_duration} min
Total Quantity: ${result.route_data.total_quantity} kg
Stops (${result.optimized_route.stops.length}):
${stopsList}
Algorithm: Haversine distance nearest-neighbor milk-run heuristic.`

    navigator.clipboard.writeText(summaryText)
    setCopyFeedback(true)
    setTimeout(() => setCopyFeedback(false), 2500)
  }

  // Copy Raw JSON
  const handleCopyManifestJson = () => {
    if (!result) return
    navigator.clipboard.writeText(JSON.stringify(result, null, 2))
    setCopyFeedback(true)
    setTimeout(() => setCopyFeedback(false), 2500)
  }

  // Download Manifest JSON
  const handleDownloadManifestJson = () => {
    if (!result) return
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `route-manifest-${orderId}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Commodity context summary
  const commodityTitle = useMemo(() => {
    if (order?.items && order.items.length > 0) {
      const names = Array.from(new Set(order.items.map(i => i.product_name))).join(', ')
      const variety = order.items[0]?.product_variety ? ` (${order.items[0].product_variety})` : ''
      return `${names}${variety}`
    }
    return 'Tomatoes (Grade A)'
  }, [order])

  const totalConsignmentVolume = useMemo(() => {
    if (result?.route_data?.total_quantity) {
      return result.route_data.total_quantity
    }
    return pickupLocations.reduce((sum, p) => sum + (p.quantity || 0), 0)
  }, [result, pickupLocations])

  // Map Coordinates Projection: Dynamically compute bounds from actual calculated stops
  const projectedStops = useMemo(() => {
    const stops = result?.optimized_route?.stops || []
    if (stops.length === 0) {
      return [
        { ...DEMO_PICKUPS[1], order: 1, type: 'pickup' as const, svgX: 590, svgY: 180 },
        { ...DEMO_PICKUPS[0], order: 2, type: 'pickup' as const, svgX: 530, svgY: 260 },
        { ...DEMO_DELIVERY, order: 3, type: 'delivery' as const, svgX: 230, svgY: 460 }
      ]
    }

    // Dynamic projection: map actual lat/lng onto SVG 800x600 canvas
    const lats = stops.map(s => s.location.lat)
    const lngs = stops.map(s => s.location.lng)
    const minLat = Math.min(...lats)
    const maxLat = Math.max(...lats)
    const minLng = Math.min(...lngs)
    const maxLng = Math.max(...lngs)

    const latSpan = maxLat - minLat || 0.05
    const lngSpan = maxLng - minLng || 0.15

    return stops.map(s => {
      // Invert lat because SVG Y goes downward; lng goes rightward
      const normX = (s.location.lng - minLng) / lngSpan
      const normY = (maxLat - s.location.lat) / latSpan

      // Map into SVG viewport with padding
      // West is Thane (lower lat, higher lng) vs Nashik (higher lat, lower lng)
      const svgX = Math.round(180 + normX * 460)
      const svgY = Math.round(130 + normY * 340)

      return {
        ...s,
        svgX,
        svgY
      }
    })
  }, [result])

  // Polyline string connecting projected stops
  const routeSvgPath = useMemo(() => {
    if (projectedStops.length < 2) return ''
    const [first, ...rest] = projectedStops
    let d = `M ${first.svgX} ${first.svgY}`
    rest.forEach(pt => {
      d += ` L ${pt.svgX} ${pt.svgY}`
    })
    return d
  }, [projectedStops])

  return (
    <div className="space-y-6">
      {/* 1. Sub-Header & Breadcrumb Bar */}
      <Reveal>
        <div className="bg-surface-elevated/70 dark:bg-neutral-900/80 border border-border rounded-xl p-4 sm:p-5 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <nav className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-1.5 flex-wrap">
                <Link href="/" className="hover:text-foreground transition-colors">{t('route.breadcrumb_home')}</Link>
                <span>/</span>
                <Link href="/buyer/dashboard" className="hover:text-foreground transition-colors">{t('route.breadcrumb_buyer')}</Link>
                <span>/</span>
                <Link href="/buyer/orders" className="hover:text-foreground transition-colors">{t('route.breadcrumb_orders')}</Link>
                <span>/</span>
                <Link href={`/buyer/orders/${orderId}`} className="text-primary font-semibold hover:underline">
                  Order #{orderId}
                </Link>
                <span>/</span>
                <span className="text-foreground font-semibold">{t('route.title')}</span>
              </nav>

              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-foreground">
                  {t('route.title')}
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  {t('route.status_calculated')}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-3xl">
                {t('route.subtitle')}
              </p>
            </div>

            {/* Header Status Badges & Working Action Triggers */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <div className="flex items-center gap-2 bg-card-bg border border-border px-3 py-1.5 rounded-lg text-xs font-mono">
                <span className="text-muted-foreground font-sans">{t('route.engine_heuristic')}:</span>
                <strong className="text-primary font-bold">{t('route.nearest_neighbor')}</strong>
              </div>

              <div className="flex items-center gap-2 bg-card-bg border border-border px-3 py-1.5 rounded-lg text-xs font-mono">
                <span className="text-muted-foreground font-sans">{t('route.batch_target_label')}:</span>
                <strong className="text-foreground font-bold">{totalConsignmentVolume} kg {commodityTitle}</strong>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleRerunHeuristic}
                isLoading={loading}
                className="text-xs font-semibold border-border hover:bg-neutral-100 dark:hover:bg-neutral-800"
                title="Invokes real route API calculation"
              >
                <RotateCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
                {t('route.rerun_heuristic')}
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowManifestModal(true)}
                className="text-xs font-semibold shadow-xs"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                {t('route.export_manifest')}
              </Button>
            </div>
          </div>
        </div>
      </Reveal>

      {error && (
        <Alert type="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* 2. Main Workspace Split Grid (5 Cols Left, 7 Cols Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Route Parameters, Sequential Stops Pipeline & Decision Engine (5 Cols) */}
        <section className="lg:col-span-5 flex flex-col gap-5">
          {/* Card 1: Route Consolidation Parameters (No invented capacity utilization bar per Constraint #1) */}
          <Card className="border border-border bg-card-bg shadow-xs">
            <CardHeader className="p-4 border-b border-border pb-3 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-primary" />
                <CardTitle className="text-sm font-bold font-display text-foreground">
                  {t('route.consolidation_params')}
                </CardTitle>
              </div>
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-foreground border border-border">
                #{orderId}
              </span>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <div className="flex justify-between items-center py-0.5">
                <span className="text-muted-foreground">{t('route.target_order_label')}:</span>
                <span className="font-semibold text-foreground font-mono">
                  {totalConsignmentVolume} kg {commodityTitle}
                </span>
              </div>

              <div className="flex justify-between items-center py-0.5">
                <span className="text-muted-foreground">{t('route.consolidation_strategy')}:</span>
                <span className="font-medium text-primary bg-primary/10 dark:bg-primary-950/60 px-2 py-0.5 rounded border border-primary/20">
                  {t('route.strategy_multistop')}
                </span>
              </div>

              <div className="flex justify-between items-center py-0.5">
                <span className="text-muted-foreground">{t('route.transit_model')}:</span>
                <span className="font-medium text-foreground">
                  {t('route.transit_model_val')}
                </span>
              </div>

              {/* Simple vehicle capacity parameter notice (truthful without fake utilization claims) */}
              <div className="flex justify-between items-center py-0.5 border-t border-border/60 pt-2.5">
                <span className="text-muted-foreground">{t('route.param_vehicle_cap')}:</span>
                <span className="font-mono font-semibold text-muted-foreground">
                  {vehicleCapacity.toLocaleString()} kg
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Three Distinct KPI Metrics (Displaying strictly real values per Constraint #3) */}
          <div className="grid grid-cols-3 gap-3">
            {/* KPI 1: Total Stops */}
            <div className="bg-card-bg border border-border rounded-xl p-3.5 flex flex-col justify-between shadow-xs">
              <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                {t('route.total_stops')}
              </span>
              <div className="mt-2">
                <span className="font-headline font-extrabold text-xl text-foreground font-mono">
                  {result?.optimized_route?.stops?.length || (pickupLocations.length + 1)}
                </span>
                <span className="text-[10px] text-muted-foreground block leading-tight mt-0.5">
                  {pickupLocations.length} + 1 {t('route.stops_breakdown')}
                </span>
              </div>
            </div>

            {/* KPI 2: Total Quantity */}
            <div className="bg-card-bg border border-border rounded-xl p-3.5 flex flex-col justify-between shadow-xs">
              <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                <Boxes className="w-3.5 h-3.5 text-primary" />
                {t('route.total_volume')}
              </span>
              <div className="mt-2">
                <span className="font-headline font-extrabold text-xl text-foreground font-mono">
                  {totalConsignmentVolume} <span className="text-xs font-normal">kg</span>
                </span>
                <span className="text-[10px] text-primary font-medium block leading-tight mt-0.5">
                  {t('route.requisition_met')}
                </span>
              </div>
            </div>

            {/* KPI 3: Distance & Savings (Honest real values only per Constraint #3) */}
            <div className="bg-card-bg border border-border rounded-xl p-3.5 flex flex-col justify-between shadow-xs">
              <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                <Navigation className="w-3.5 h-3.5 text-primary" />
                {t('route.total_distance')}
              </span>
              <div className="mt-2">
                <span className="font-headline font-extrabold text-xl text-foreground font-mono">
                  {result?.optimized_route?.total_distance != null ? `${result.optimized_route.total_distance} km` : '—'}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono block leading-tight mt-0.5 truncate">
                  {result?.cost_analysis?.savings && result.cost_analysis.savings > 0 
                    ? `Save ₹${result.cost_analysis.savings.toLocaleString()} (${Math.round(result.cost_analysis.savings_percentage)}%)` 
                    : `${result?.optimized_route?.estimated_duration || '—'} min est`}
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Sequence & Stop Details (Connected Pipeline with Real Calculated Output) */}
          <Card className="border border-border bg-card-bg shadow-xs flex-1">
            <CardHeader className="p-4 border-b border-border pb-3 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <RouteIcon className="w-4 h-4 text-primary" />
                <CardTitle className="text-sm font-bold font-display text-foreground">
                  {t('route.execution_sequence')}
                </CardTitle>
              </div>
              <span className="text-[11px] text-muted-foreground font-mono">
                {t('route.deterministic_waypoints')}
              </span>
            </CardHeader>
            <CardContent className="p-4">
              {loading ? (
                <div className="py-8 flex flex-col items-center justify-center">
                  <LoadingSpinner size="md" />
                  <p className="mt-2 text-xs font-mono text-muted-foreground">{t('common.loading')}</p>
                </div>
              ) : (
                <div className="relative pl-6 space-y-4">
                  {/* Continuous Connector Line */}
                  <div aria-hidden="true" className="absolute left-2.5 top-3 bottom-6 w-0.5 bg-border"></div>

                  {/* Render Calculated Sequence Stops */}
                  {(result?.optimized_route?.stops || []).map((stop: RouteStop, index: number) => {
                    const isDelivery = stop.type === 'delivery'
                    const isActive = activeStop === stop.order

                    // Compute cumulative load
                    let cumulativeLoad = 0
                    if (result?.optimized_route?.stops) {
                      for (let i = 0; i <= index; i++) {
                        const st = result.optimized_route.stops[i]
                        if (st.type === 'pickup') {
                          cumulativeLoad += st.quantity || 0
                        }
                      }
                    }

                    return (
                      <div 
                        key={`${stop.type}-${index}`} 
                        className="relative group"
                        onMouseEnter={() => setActiveStop(stop.order)}
                        onMouseLeave={() => setActiveStop(null)}
                      >
                        {/* Timeline Step Marker */}
                        <div className={`absolute -left-6 top-1 w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-xs shadow-xs transition-colors ${
                          isDelivery 
                            ? 'bg-emerald-600 text-white border-2 border-emerald-400' 
                            : isActive 
                              ? 'bg-primary text-white scale-110' 
                              : 'bg-primary/90 text-white'
                        }`}>
                          {stop.order}
                        </div>

                        {/* Stop Card */}
                        <div className={`p-3 rounded-lg border transition-all text-xs ${
                          isActive 
                            ? 'border-primary bg-primary/5 dark:bg-primary-950/30 shadow-xs' 
                            : isDelivery 
                              ? 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20' 
                              : 'border-border bg-neutral-50/60 dark:bg-neutral-900/50'
                        }`}>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className={`text-[10px] font-mono uppercase tracking-wider font-bold block ${
                                isDelivery ? 'text-emerald-700 dark:text-emerald-400' : 'text-primary'
                              }`}>
                                {isDelivery 
                                  ? `${t('route.stop')} 0${stop.order} • ${t('route.final_delivery_dest')}` 
                                  : `${t('route.stop')} 0${stop.order} • ${stop.farmer_id === 'farmer2' ? t('route.producer_org') : t('route.producer_individual')}`
                                }
                              </span>
                              <h3 className="font-display font-bold text-sm text-foreground mt-0.5">
                                {isDelivery ? (stop.buyer_name || deliveryLocation.buyer_name) : stop.farmer_name}
                              </h3>
                              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3 shrink-0" />
                                <span>{stop.address || (isDelivery ? deliveryLocation.address : 'Nashik Corridor')}</span>
                              </p>

                              {/* Prototype demo coordinates disclosure per Constraint #2 */}
                              {stop.location && (
                                <span className="inline-block mt-1 font-mono text-[10px] text-muted-foreground">
                                  {stop.location.lat.toFixed(4)}° N, {stop.location.lng.toFixed(4)}° E ({t('route.demo_coords_badge')})
                                </span>
                              )}
                            </div>

                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border font-mono shrink-0 ${
                              isDelivery 
                                ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700' 
                                : 'bg-neutral-100 dark:bg-neutral-800 text-muted-foreground border-border'
                            }`}>
                              {isDelivery 
                                ? t('route.designated_dest') 
                                : index === 0 ? t('route.scheduled_first') : t('route.scheduled_second')}
                            </span>
                          </div>

                          {/* Stop Metrics Breakdown */}
                          <div className="mt-2.5 pt-2 border-t border-border/60 grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-muted-foreground text-[11px] block">
                                {isDelivery ? t('route.consignment_handover') : t('route.consignment_pickup')}
                              </span>
                              <strong className="font-mono font-bold text-foreground">
                                {isDelivery ? `${totalConsignmentVolume} kg Total` : `${stop.quantity || '—'} kg`}
                              </strong>
                            </div>
                            <div className="border-l border-border/60 pl-2">
                              <span className="text-muted-foreground text-[11px] block">
                                {isDelivery ? t('route.load_after_stop') : t('route.vehicle_cumulative')}
                              </span>
                              <strong className={`font-mono font-bold ${isDelivery ? 'text-emerald-700 dark:text-emerald-400' : 'text-primary'}`}>
                                {isDelivery ? `0 kg (${t('route.consignment_completed')})` : `${cumulativeLoad} kg`}
                              </strong>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card 4: Prototype Heuristic Explanation & Working Actions */}
          <div className="bg-surface-elevated/80 dark:bg-neutral-900/70 border border-border rounded-xl p-4 space-y-3">
            <div className="flex items-start gap-2.5">
              <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-display font-bold text-xs text-foreground">
                  {t('route.rationale')}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t('route.rationale_desc')}
                </p>
              </div>
            </div>

            {/* Real Working Actions */}
            <div className="pt-2 border-t border-border/70 flex flex-wrap items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowManifestModal(true)}
                className="w-full text-xs font-semibold"
              >
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                {t('route.btn_confirm_dispatch')}
              </Button>

              <div className="grid grid-cols-2 gap-2 w-full pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopySummary}
                  className="text-xs font-semibold border-border"
                >
                  {copyFeedback ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                  {copyFeedback ? t('route.summary_copied') : t('route.btn_copy_summary')}
                </Button>

                <Link href={`/buyer/orders/${orderId}`} className="w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs font-semibold border-border"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                    {t('route.btn_back_order')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: Restrained, High-Contrast Agricultural Logistics Cartography Canvas (7 Cols) */}
        <section className="lg:col-span-7 flex flex-col gap-4">
          <Card className="border border-border bg-card-bg shadow-sm overflow-hidden flex flex-col min-h-[580px]">
            {/* Map Control Toolbar Overlay (Top) */}
            <div className="p-3 border-b border-border bg-surface-elevated/90 dark:bg-neutral-900/90 flex flex-wrap items-center justify-between gap-2">
              {/* Layer Selection Pills */}
              <div className="flex items-center gap-1 bg-card-bg border border-border rounded-lg p-0.5 text-xs">
                <button
                  onClick={() => setMapLayer('corridor')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                    mapLayer === 'corridor' 
                      ? 'bg-primary text-white shadow-xs' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t('route.layer_corridor')}
                </button>
                <button
                  onClick={() => setMapLayer('terrain')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                    mapLayer === 'terrain' 
                      ? 'bg-primary text-white shadow-xs' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t('route.layer_terrain')}
                </button>
                <button
                  onClick={() => setMapLayer('schematic')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                    mapLayer === 'schematic' 
                      ? 'bg-primary text-white shadow-xs' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t('route.layer_schematic')}
                </button>
              </div>

              {/* Map Zoom & Reset Utilities */}
              <div className="flex items-center gap-1.5 bg-card-bg border border-border rounded-lg p-0.5 text-xs">
                <button 
                  onClick={() => setMapZoom(Math.max(0.7, mapZoom - 0.15))}
                  className="w-7 h-7 flex items-center justify-center rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-foreground"
                  title={t('route.zoom_out')}
                >
                  -
                </button>
                <span className="px-2 font-mono text-[11px] text-muted-foreground">
                  {Math.round(mapZoom * 100)}%
                </span>
                <button 
                  onClick={() => setMapZoom(Math.min(1.8, mapZoom + 0.15))}
                  className="w-7 h-7 flex items-center justify-center rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-foreground"
                  title={t('route.zoom_in')}
                >
                  +
                </button>
                <span className="w-px h-4 bg-border"></span>
                <button 
                  onClick={() => setMapZoom(1)}
                  className="px-2 py-1 text-xs font-mono text-muted-foreground hover:text-foreground"
                >
                  {t('route.reset_view')}
                </button>
              </div>
            </div>

            {/* Restrained Vector GIS Cartography Canvas (NO neon / glowing effects per Constraint #4) */}
            <div className="relative flex-1 w-full bg-[#F5F2EB] dark:bg-[#0E1310] overflow-hidden min-h-[460px] select-none flex items-center justify-center">
              <svg 
                viewBox="0 0 800 600" 
                className="w-full h-full max-h-[580px] transition-transform duration-200"
                style={{ transform: `scale(${mapZoom})`, transformOrigin: 'center center' }}
              >
                <defs>
                  {/* Subtle Topo Grid Pattern */}
                  <pattern id="cartoGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" className="text-neutral-300 dark:text-neutral-800" strokeWidth="0.5" strokeOpacity="0.5" />
                  </pattern>

                  {/* Terrain Elevation Pattern */}
                  <pattern id="contourPattern" width="120" height="120" patternUnits="userSpaceOnUse">
                    <path d="M 0 60 Q 30 20 60 60 T 120 60" fill="none" stroke="currentColor" className="text-neutral-400 dark:text-neutral-700" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.3" />
                  </pattern>

                  {/* Direction Arrow Marker */}
                  <marker id="routeArrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1 L 9 5 L 0 9 z" fill="#0d4a2e" className="dark:fill-[#34D399]" />
                  </marker>
                </defs>

                {/* Base Cartographic Background */}
                <rect width="800" height="600" fill="transparent" />
                <rect width="800" height="600" fill="url(#cartoGrid)" />
                {mapLayer === 'terrain' && (
                  <rect width="800" height="600" fill="url(#contourPattern)" />
                )}

                {/* Regional Agricultural Context Polygons */}
                {/* 1. Nashik Agri-Belt */}
                <path 
                  d="M 380 60 Q 580 40 680 120 T 720 280 T 560 320 T 400 240 Z" 
                  fill="#0d4a2e" 
                  fillOpacity={mapLayer === 'schematic' ? '0.02' : '0.06'} 
                  stroke="#0d4a2e" 
                  strokeOpacity="0.25"
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                />
                <text x="590" y="95" className="fill-neutral-500 dark:fill-neutral-400 font-sans font-bold text-[10px] tracking-wider">
                  NASHIK AGRI-CORRIDOR (PRODUCE ZONE)
                </text>

                {/* 2. Kasara Ghat Passageway Ridge */}
                <path 
                  d="M 340 200 Q 390 280 350 370 T 260 480" 
                  fill="none" 
                  stroke="currentColor" 
                  className="text-neutral-400 dark:text-neutral-600" 
                  strokeWidth="1.5" 
                  strokeDasharray="6 4" 
                  opacity="0.6"
                />
                <text x="350" y="310" transform="rotate(62 350, 310)" className="fill-neutral-400 dark:fill-neutral-500 font-sans text-[9px]">
                  KASARA GHAT TRANSIT CORRIDOR
                </text>

                {/* 3. Thane Urban Delivery Basin */}
                <path 
                  d="M 100 390 Q 230 380 270 460 T 230 560 T 80 540 Z" 
                  fill="#B45309" 
                  fillOpacity={mapLayer === 'schematic' ? '0.02' : '0.07'} 
                  stroke="#B45309" 
                  strokeOpacity="0.3"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <text x="120" y="555" className="fill-amber-800 dark:fill-amber-400 font-sans font-bold text-[10px] tracking-wider">
                  THANE CONSOLIDATION TERMINAL
                </text>

                {/* Regional Road Arteries */}
                <path d="M 120 140 Q 320 200 540 160" fill="none" stroke="currentColor" className="text-neutral-300 dark:text-neutral-800" strokeWidth="1.5" />
                <path d="M 640 190 Q 550 370 420 540" fill="none" stroke="currentColor" className="text-neutral-300 dark:text-neutral-800" strokeWidth="1.5" />
                <path d="M 210 510 Q 360 480 540 500" fill="none" stroke="currentColor" className="text-neutral-300 dark:text-neutral-800" strokeWidth="1.5" />

                {/* ======================================================== */}
                {/* RESTRAINED OPTIMIZED HAVERSINE ROUTE PATH                */}
                {/* Deep forest green, clean solid lines, NO neon effects    */}
                {/* ======================================================== */}
                {routeSvgPath && (
                  <>
                    {/* Background track line */}
                    <motion.path 
                      d={routeSvgPath} 
                      fill="none" 
                      stroke="#0d4a2e" 
                      className="dark:stroke-[#34D399]"
                      strokeWidth="4" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.85 }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />

                    {/* Flow Marker circles along segments */}
                    {projectedStops.length >= 2 && projectedStops.slice(0, -1).map((pt, i) => {
                      const nextPt = projectedStops[i + 1]
                      const midX = Math.round((pt.svgX + nextPt.svgX) / 2)
                      const midY = Math.round((pt.svgY + nextPt.svgY) / 2)
                      return (
                        <g key={`arrow-${i}`}>
                          <circle cx={midX} cy={midY} r="4" fill="#ffffff" stroke="#0d4a2e" className="dark:stroke-[#34D399]" strokeWidth="2" />
                        </g>
                      )
                    })}
                  </>
                )}

                {/* ======================================================== */}
                {/* DYNAMICALLY PROJECTED STOPS & WAYPOINT PINS              */}
                {/* ======================================================== */}
                {projectedStops.map((stop, idx) => {
                  const isDelivery = stop.type === 'delivery'
                  const isActive = activeStop === stop.order
                  const stopTitle = isDelivery ? (stop.buyer_name || 'Buyer Depot') : (stop.farmer_name || 'Producer')
                  const stopSubtitle = isDelivery ? `${totalConsignmentVolume} kg Handover` : `${stop.quantity || '—'} kg Pickup`

                  return (
                    <motion.g 
                      key={`pin-${stop.order}`}
                      transform={`translate(${stop.svgX}, ${stop.svgY})`}
                      className="cursor-pointer"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.1 * idx }}
                      onMouseEnter={() => setActiveStop(stop.order)}
                      onMouseLeave={() => setActiveStop(null)}
                    >
                      {/* Anchor Pin Ring */}
                      <circle 
                        cx="0" 
                        cy="0" 
                        r={isActive ? "20" : "15"} 
                        fill={isDelivery ? "#065F46" : "#0d4a2e"} 
                        className={isDelivery ? "dark:fill-[#059669]" : "dark:fill-[#165134]"}
                        fillOpacity={isActive ? "0.3" : "0.15"} 
                      />
                      <circle 
                        cx="0" 
                        cy="0" 
                        r="11" 
                        fill="#ffffff" 
                        stroke={isDelivery ? "#059669" : "#0d4a2e"} 
                        className={isDelivery ? "dark:stroke-[#34D399]" : "dark:stroke-[#10B981]"}
                        strokeWidth="2.5" 
                      />
                      <text 
                        x="0" 
                        y="4" 
                        textAnchor="middle" 
                        fill={isDelivery ? "#065F46" : "#0d4a2e"} 
                        fontSize="10" 
                        fontWeight="bold" 
                        fontFamily="monospace"
                      >
                        {stop.order}
                      </text>

                      {/* Waypoint Label Card Overlay */}
                      <g transform={isDelivery ? "translate(-190, -50)" : "translate(18, -25)"}>
                        <rect 
                          width="180" 
                          height="54" 
                          rx="6" 
                          fill="#ffffff" 
                          className="dark:fill-[#1A221D]" 
                          stroke={isActive ? "#0d4a2e" : "#E2E8F0"} 
                          strokeWidth={isActive ? "1.5" : "1"} 
                          filter="drop-shadow(0 2px 4px rgba(0,0,0,0.06))"
                        />
                        <rect 
                          width="4" 
                          height="54" 
                          rx="2" 
                          fill={isDelivery ? "#059669" : "#0d4a2e"} 
                          className={isDelivery ? "dark:fill-[#34D399]" : "dark:fill-[#10B981]"}
                        />
                        <text x="12" y="16" fill={isDelivery ? "#059669" : "#0d4a2e"} className={isDelivery ? "dark:fill-[#34D399]" : "dark:fill-[#10B981]"} fontSize="9" fontWeight="bold" fontFamily="monospace">
                          {isDelivery ? 'DESTINATION • STOP 03' : `WAYPOINT 0${stop.order} • PICKUP`}
                        </text>
                        <text x="12" y="30" fill="#1A1C1C" className="dark:fill-[#F1F5F2]" fontSize="11" fontWeight="bold">
                          {stopTitle.length > 22 ? `${stopTitle.slice(0, 22)}...` : stopTitle}
                        </text>
                        <text x="12" y="44" fill="#64748B" className="dark:fill-[#9EAA9F]" fontSize="9" fontFamily="monospace">
                          {stopSubtitle}
                        </text>
                      </g>
                    </motion.g>
                  )
                })}

                {/* Compass Rose */}
                <g transform="translate(60, 80)">
                  <circle r="18" fill="none" stroke="currentColor" className="text-neutral-400 dark:text-neutral-600" strokeWidth="1" />
                  <line x1="0" y1="-16" x2="0" y2="16" stroke="currentColor" className="text-neutral-400 dark:text-neutral-600" strokeWidth="1" />
                  <line x1="-16" y1="0" x2="16" y2="0" stroke="currentColor" className="text-neutral-400 dark:text-neutral-600" strokeWidth="1" />
                  <text y="-20" textAnchor="middle" fill="#0d4a2e" className="dark:fill-[#34D399]" fontSize="9" fontWeight="bold" fontFamily="monospace">N</text>
                </g>

                {/* Coordinate Extent & OpenStreetMap Attribution per Prompt */}
                <text x="24" y="580" fill="currentColor" className="text-neutral-500 dark:text-neutral-400" fontSize="10" fontFamily="monospace">
                  MAP EXTENT: 19.03°N - 19.09°N | 72.87°E - 73.03°E ({t('route.map_extent')})
                </text>
              </svg>

              {/* Floating Bottom Cartography Legend Card */}
              <div className="absolute bottom-3 left-3 right-3 z-10 pointer-events-none">
                <div className="pointer-events-auto bg-card-bg/95 backdrop-blur-md border border-border rounded-lg p-3 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  {/* Left Legend Symbols */}
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-primary inline-block"></span>
                      <span className="text-foreground font-medium">{t('route.legend_pickup')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-emerald-600 bg-emerald-100 dark:bg-emerald-950 inline-block"></span>
                      <span className="text-foreground font-medium">{t('route.legend_delivery')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-1 bg-primary rounded inline-block"></span>
                      <span className="text-foreground font-mono font-medium">{t('route.legend_path')}</span>
                    </div>
                  </div>

                  {/* OpenStreetMap Attribution */}
                  <div className="text-right text-[11px] font-mono text-muted-foreground border-t sm:border-t-0 sm:border-l border-border pt-1.5 sm:pt-0 sm:pl-3 shrink-0">
                    <a 
                      href="https://www.openstreetmap.org/copyright" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:underline text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                    >
                      {t('route.osm_attribution')}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Algorithm Telemetry & Distance Audit Strip */}
            <div className="p-3 bg-surface-elevated/70 dark:bg-neutral-900/60 border-t border-border flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 font-mono text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>
                  {t('route.pairwise_matrix')}: Stop 1 ➔ Stop 2 ➔ Stop 3 ({result?.optimized_route?.total_distance ? `${result.optimized_route.total_distance} km` : 'Calculated'})
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant="default" className="font-mono text-[11px]">
                  {t('route.total_distance')}: {result?.optimized_route ? `${result.optimized_route.total_distance} km` : '—'}
                </Badge>
                <button
                  onClick={() => setShowManifestModal(true)}
                  className="text-primary font-semibold hover:underline text-xs flex items-center gap-1"
                >
                  <FileJson className="w-3.5 h-3.5" />
                  <span>{t('route.view_raw_geojson')}</span>
                </button>
              </div>
            </div>
          </Card>
        </section>
      </div>

      {/* 3. Footer Telemetry Strip */}
      <footer className="bg-surface-elevated/60 dark:bg-neutral-900/50 border border-border rounded-xl p-4 text-xs text-muted-foreground">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-mono">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            <span>{t('route.footer_sih')}</span>
          </div>
          <div className="text-center font-mono text-[11px]">
            {t('route.footer_heuristic')}
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span>Order #{orderId}</span>
            <span>•</span>
            <button 
              onClick={() => setShowManifestModal(true)}
              className="text-primary hover:underline font-medium"
            >
              {t('route.view_manifest')}
            </button>
          </div>
        </div>
      </footer>

      {/* 4. Dispatch Manifest JSON Modal */}
      <AnimatePresence>
        {showManifestModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.98, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 8 }}
              transition={{ duration: 0.2 }}
              className="bg-card-bg border border-border rounded-xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-4 border-b border-border flex items-center justify-between bg-surface-elevated">
                <div className="flex items-center gap-2">
                  <FileJson className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-bold font-display text-foreground">
                    {t('route.manifest_modal_title')}
                  </h3>
                </div>
                <button
                  onClick={() => setShowManifestModal(false)}
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-4 overflow-y-auto flex-1 font-mono text-xs text-foreground bg-neutral-50 dark:bg-neutral-950">
                <pre className="whitespace-pre-wrap break-all leading-relaxed select-all">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>

              {/* Modal Footer Actions */}
              <div className="p-3 border-t border-border flex items-center justify-between bg-surface-elevated gap-2">
                <span className="text-[11px] font-mono text-muted-foreground">
                  Order ID: {orderId}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyManifestJson}
                    className="text-xs"
                  >
                    {copyFeedback ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                    {copyFeedback ? t('matching.copied') : t('matching.btn_copy_json')}
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleDownloadManifestJson}
                    className="text-xs"
                  >
                    <Download className="w-3.5 h-3.5 mr-1" />
                    Download JSON
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
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
