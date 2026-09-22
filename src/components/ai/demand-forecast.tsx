'use client'

import { useMemo, useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button, Alert, Badge } from '../ui'
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Play, 
  PieChart
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export interface DemandForecastResult {
  current_demand: number
  predicted_demand: number[]
  trend: 'stable' | 'increasing' | 'decreasing' | string
  confidence_level: number
  recommendations: string[]
  forecast_dates: string[]
  model_info?: {
    model_type: string
    version: string
    demo_mode: boolean
    note: string
  }
}

export function DemandForecast() {
  const { t } = useLanguage()
  const [productName, setProductName] = useState('Tomatoes')
  const [forecastDays, setForecastDays] = useState(14)
  const [region, setRegion] = useState('all')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<DemandForecastResult | null>(null)

  // Run forecast on mount to fetch exact calculated values from API
  useEffect(() => {
    let ignore = false

    const runForecast = async () => {
      try {
        const response = await fetch('/api/ai/demand-forecast', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            product_name: productName,
            region,
            forecast_days: forecastDays,
          }),
        })

        if (!response.ok) {
          throw new Error('Forecast failed')
        }

        const data: DemandForecastResult = await response.json()
        if (!ignore) {
          setResult(data)
        }
      } catch (err: unknown) {
        if (!ignore) {
          const message = err instanceof Error ? err.message : 'Failed to generate forecast'
          setError(message)
        }
      }
    }

    runForecast()
    return () => {
      ignore = true
    }
  }, [productName, region, forecastDays])

  const availableProducts = ['Tomatoes', 'Onions', 'Potatoes', 'Carrots', 'Wheat', 'Ragi']
  const regions = [
    { value: 'all', label: t('forecast.region_all') || 'All Regions (Default)' },
    { value: 'Maharashtra', label: t('forecast.region_maharashtra') || 'Maharashtra (Nashik / Pune Corridor)' },
    { value: 'Chhattisgarh', label: t('forecast.region_chhattisgarh') || 'Chhattisgarh (Raipur / Durg Agri Belt)' },
    { value: 'Punjab', label: t('forecast.region_punjab') || 'Punjab' },
    { value: 'Karnataka', label: t('forecast.region_karnataka') || 'Karnataka' },
  ]

  const handleForecast = async () => {
    if (!productName) {
      setError('Please select a product')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/ai/demand-forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_name: productName,
          region,
          forecast_days: forecastDays,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Forecast failed')
      }

      const data: DemandForecastResult = await response.json()
      setResult(data)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to generate forecast'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleLoadDemoData = () => {
    setProductName('Tomatoes')
    setForecastDays(14)
    setRegion('all')
    setError('')
  }

  const chart = useMemo(() => {
    if (!result?.predicted_demand?.length) return null
    const values = [result.current_demand, ...result.predicted_demand]
    const min = Math.floor(Math.min(...values) / 200) * 200 - 100
    const max = Math.ceil(Math.max(...values) / 200) * 200 + 100
    const width = 720
    const height = 240
    const padding = { top: 20, right: 20, bottom: 35, left: 55 }
    const x = (index: number) => padding.left + (index / Math.max(result.predicted_demand.length - 1, 1)) * (width - padding.left - padding.right)
    const y = (value: number) => padding.top + (1 - (value - min) / Math.max(max - min, 1)) * (height - padding.top - padding.bottom)
    const points = result.predicted_demand.map((value: number, index: number) => `${x(index)},${y(value)}`).join(' ')
    const firstX = x(0)
    const lastX = x(result.predicted_demand.length - 1)
    const baseY = height - padding.bottom
    const areaPoints = `${firstX},${baseY} ${points} ${lastX},${baseY}`
    return { height, max, min, padding, points, areaPoints, width, x, y }
  }, [result])

  return (
    <div className="space-y-8">
      {/* Header Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 dark:bg-primary-950/70 border border-primary/20 dark:border-primary-800 text-xs font-semibold text-primary dark:text-[#8FBF2E] mb-1.5">
            <BarChart3 className="w-3.5 h-3.5" />
            {t('forecast.tag')}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-foreground">
            {t('forecast.title')}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
            {t('forecast.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLoadDemoData}
            className="text-xs font-semibold border-primary text-primary hover:bg-primary-50 dark:hover:bg-primary-950/50 shrink-0"
          >
            <Play className="w-3.5 h-3.5 mr-1.5" />
            {t('forecast.load_benchmark')}
          </Button>
        </div>
      </div>

      {error && (
        <Alert type="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* 4 Dynamic KPI Cards from Forecast Model */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-border bg-card-bg shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              {t('forecast.selected_commodity')}
            </CardDescription>
            <CardTitle className="text-xl font-bold font-display text-foreground mt-0.5">
              {productName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-xs text-neutral-500 font-mono">Region: {region}</span>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card-bg shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              {t('forecast.current_base_demand')}
            </CardDescription>
            <CardTitle className="text-2xl font-bold font-mono text-foreground mt-0.5">
              {result?.current_demand ? `${result.current_demand.toLocaleString()} kg` : '—'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-xs text-neutral-500 font-mono">{t('forecast.simulated_baseline')}</span>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card-bg shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              {t('forecast.peak_forecast_demand')}
            </CardDescription>
            <CardTitle className="text-2xl font-bold font-mono text-foreground mt-0.5">
              {result?.predicted_demand?.length ? `${Math.max(...result.predicted_demand).toLocaleString()} kg` : '—'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-xs text-primary dark:text-[#8FBF2E] font-mono">
              {t('forecast.trajectory')}: {result?.trend ? result.trend.toUpperCase() : '—'}
            </span>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card-bg shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              {t('forecast.model_confidence')}
            </CardDescription>
            <CardTitle className="text-2xl font-bold font-mono text-foreground mt-0.5">
              {result?.confidence_level ? `${result.confidence_level}%` : '—'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-xs text-neutral-500 font-mono">{t('forecast.demo_heuristic')}</span>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Grid: Time Series Chart & Commodity Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT 8 COLS: Actual vs Forecast Demand Chart */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border border-border bg-card-bg shadow-sm">
            <CardHeader className="border-b border-border pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle className="text-base font-bold font-display text-foreground">
                  {t('forecast.actual_vs_projected')} ({productName})
                </CardTitle>
                <CardDescription className="text-xs text-neutral-500">
                  {t('forecast.chart_desc')}
                </CardDescription>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-neutral-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-neutral-400" /> {t('forecast.actual_legend')}
                </span>
                <span className="flex items-center gap-1.5 text-primary dark:text-[#8FBF2E]">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary dark:bg-[#8FBF2E]" /> {t('forecast.projected_legend')}
                </span>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {chart && result && (
                <div className="overflow-x-auto">
                  <svg viewBox={`0 0 ${chart.width} ${chart.height}`} className="w-full min-w-140">
                    <defs>
                      <linearGradient id="forecastArea" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#1F3D2B" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#1F3D2B" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Grid lines */}
                    {[chart.min, (chart.min + chart.max) / 2, chart.max].map((tick) => (
                      <g key={tick}>
                        <line 
                          x1={chart.padding.left} 
                          x2={chart.width - chart.padding.right} 
                          y1={chart.y(tick)} 
                          y2={chart.y(tick)} 
                          stroke="currentColor" 
                          strokeOpacity="0.12" 
                          strokeDasharray="4 4" 
                        />
                        <text 
                          x={chart.padding.left - 10} 
                          y={chart.y(tick) + 4} 
                          textAnchor="end" 
                          fill="currentColor" 
                          fillOpacity="0.6" 
                          fontSize="10" 
                          fontFamily="monospace"
                        >
                          {Math.round(tick)}
                        </text>
                      </g>
                    ))}

                    {/* Area fill */}
                    <polygon 
                      points={chart.areaPoints} 
                      fill="url(#forecastArea)" 
                    />

                    {/* Actual baseline indicator */}
                    <line 
                      x1={chart.padding.left} 
                      x2={chart.width - chart.padding.right} 
                      y1={chart.y(result.current_demand)} 
                      y2={chart.y(result.current_demand)} 
                      stroke="currentColor" 
                      strokeOpacity="0.4" 
                      strokeWidth="1.5" 
                      strokeDasharray="6 6" 
                    />

                    {/* Forecast Polyline */}
                    <polyline 
                      points={chart.points} 
                      fill="none" 
                      stroke="#1F3D2B" 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="dark:stroke-[#8FBF2E]"
                    />

                    {/* Data Points */}
                    {result.predicted_demand.map((value: number, index: number) => (
                      <circle 
                        key={index} 
                        cx={chart.x(index)} 
                        cy={chart.y(value)} 
                        r="3.5" 
                        fill="#1F3D2B" 
                        stroke="#8FBF2E" 
                        strokeWidth="1.5"
                        className="dark:fill-[#8FBF2E] dark:stroke-[#111412]"
                      />
                    ))}

                    {/* X-axis date labels */}
                    <text x={chart.padding.left} y={chart.height - 8} fill="currentColor" fillOpacity="0.6" fontSize="10" fontFamily="monospace">
                      Day 1 (16 Sep)
                    </text>
                    <text x={chart.width / 2} y={chart.height - 8} textAnchor="middle" fill="currentColor" fillOpacity="0.6" fontSize="10" fontFamily="monospace">
                      Day 7 (22 Sep)
                    </text>
                    <text x={chart.width - chart.padding.right} y={chart.height - 8} textAnchor="end" fill="currentColor" fillOpacity="0.6" fontSize="10" fontFamily="monospace">
                      Day 14 (30 Sep)
                    </text>
                  </svg>
                </div>
              )}

              {/* Actionable Insights Banner */}
              {result && (
                <div className="mt-4 p-4 rounded-xl bg-neutral-50/80 dark:bg-neutral-900/60 border border-border text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-primary dark:text-[#8FBF2E]" />
                      {t('forecast.demand_trajectory')}: <span className="capitalize text-primary dark:text-[#8FBF2E]">{result.trend}</span>
                    </span>
                    <Badge variant="success" size="sm" className="font-mono">
                      {result.confidence_level}% {t('forecast.confidence')}
                    </Badge>
                  </div>
                  <ul className="space-y-1 text-neutral-600 dark:text-neutral-400 pl-4 list-disc">
                    {result.recommendations.map((rec: string, idx: number) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT 4 COLS: Parameters & Commodity Breakdown */}
        <div className="lg:col-span-4 space-y-6">
          {/* Parameter Configuration Form */}
          <Card className="border border-border bg-card-bg shadow-sm">
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-base font-bold font-display text-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary dark:text-[#8FBF2E]" />
                {t('forecast.parameters')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                  {t('forecast.commodity')}
                </label>
                <select
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-card-bg text-foreground text-xs focus:ring-1 focus:ring-primary"
                >
                  {availableProducts.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                  {t('forecast.horizon')}
                </label>
                <select
                  value={forecastDays}
                  onChange={(e) => setForecastDays(parseInt(e.target.value) || 14)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-card-bg text-foreground text-xs focus:ring-1 focus:ring-primary"
                >
                  <option value={7}>7-Day Forecast</option>
                  <option value={14}>14-Day Forecast</option>
                  <option value={30}>30-Day Forecast</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                  {t('forecast.regional_focus')}
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-card-bg text-foreground text-xs focus:ring-1 focus:ring-primary"
                >
                  {regions.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>

              <Button
                variant="primary"
                size="md"
                className="w-full font-semibold text-xs"
                onClick={handleForecast}
                isLoading={loading}
              >
                {t('forecast.compute_button')}
              </Button>
            </CardContent>
          </Card>

          {/* Supported Commodities & Baseline Catalog */}
          <Card className="border border-border bg-card-bg shadow-sm">
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-base font-bold font-display text-foreground flex items-center gap-2">
                <PieChart className="w-4 h-4 text-primary dark:text-[#8FBF2E]" />
                {t('forecast.forecasted_commodities')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2.5 text-xs">
              {[
                { name: 'Tomatoes', base: '5,000 kg', trend: '+2.0% / mo' },
                { name: 'Potatoes', base: '5,200 kg', trend: '+1.5% / mo' },
                { name: 'Onions', base: '3,800 kg', trend: '+1.0% / mo' },
                { name: 'Cabbage', base: '3,200 kg', trend: '+1.0% / mo' },
                { name: 'Carrots', base: '2,800 kg', trend: '+2.5% / mo' },
              ].map((item) => (
                <div 
                  key={item.name} 
                  onClick={() => setProductName(item.name)}
                  className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                    productName === item.name 
                      ? 'border-primary bg-primary/5 dark:bg-primary-950/30' 
                      : 'border-border hover:bg-neutral-50 dark:hover:bg-neutral-900/50'
                  }`}
                >
                  <div>
                    <strong className="text-foreground block">{item.name}</strong>
                    <span className="text-[10px] text-neutral-400 font-mono">{t('forecast.simulated_baseline')}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-foreground block">{item.base}</span>
                    <span className="text-[10px] text-primary dark:text-[#8FBF2E] font-mono">{item.trend}</span>
                  </div>
                </div>
              ))}

              {/* Strict Data Veracity Note */}
              <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-border text-[10px] text-neutral-500 italic mt-3">
                {t('forecast.disclaimer')}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

