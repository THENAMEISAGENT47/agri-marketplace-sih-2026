'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@/components/ui'
import { DemandForecast } from '@/components/ai/demand-forecast'
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Sprout, 
  BarChart2, 
  Info, 
  ArrowUpRight, 
  Clock, 
  Sparkles,
  HelpCircle,
  ShieldCheck
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface PricePredictionData {
  crop: string
  currentPrice: number
  unit: string
  expectedRange: [number, number]
  trend: 'up' | 'down' | 'stable'
  trendPct: string
  explanationKey: string
  defaultExplanation: string
  historicalPoints: number[]
  forecastPoints: number[]
}

const PREDICTION_DATA: Record<string, PricePredictionData> = {
  tomatoes: {
    crop: 'Tomatoes',
    currentPrice: 25,
    unit: 'kg',
    expectedRange: [24, 28],
    trend: 'up',
    trendPct: '+6%',
    explanationKey: 'insights.price.tomato_desc',
    defaultExplanation: 'Steady wholesale demand from Mumbai-Thane urban centers. Harvest arrivals from Nashik cluster expected to remain balanced.',
    historicalPoints: [22, 23, 23, 24, 25],
    forecastPoints: [25, 26, 26, 27, 28]
  },
  onions: {
    crop: 'Onions',
    currentPrice: 18,
    unit: 'kg',
    expectedRange: [17, 20],
    trend: 'stable',
    trendPct: '+2%',
    explanationKey: 'insights.price.onion_desc',
    defaultExplanation: 'Robust storage stocks in Lasalgaon FPO network keeping mandi gate prices stable across Western Maharashtra.',
    historicalPoints: [19, 18, 18, 18, 18],
    forecastPoints: [18, 18, 19, 19, 20]
  },
  potatoes: {
    crop: 'Potatoes',
    currentPrice: 15,
    unit: 'kg',
    expectedRange: [14, 17],
    trend: 'stable',
    trendPct: '+1%',
    explanationKey: 'insights.price.potato_desc',
    defaultExplanation: 'Stable cold-storage releases from Malwa/Indore corridor matching standard institutional canteen and bulk consumption.',
    historicalPoints: [15, 15, 14, 15, 15],
    forecastPoints: [15, 15, 16, 16, 17]
  },
  wheat: {
    crop: 'Wheat',
    currentPrice: 28,
    unit: 'kg',
    expectedRange: [27, 30],
    trend: 'up',
    trendPct: '+4%',
    explanationKey: 'insights.price.wheat_desc',
    defaultExplanation: 'Sustained institutional flour mill procurement. Farmgate consignment rates reflect consistent high-protein Lokwan quality.',
    historicalPoints: [26, 27, 27, 28, 28],
    forecastPoints: [28, 29, 29, 30, 30]
  },
  ragi: {
    crop: 'Ragi (Finger Millet)',
    currentPrice: 37,
    unit: 'kg',
    expectedRange: [36, 40],
    trend: 'up',
    trendPct: '+5%',
    explanationKey: 'insights.price.ragi_desc',
    defaultExplanation: 'Growing nutritional FMCG processing demand across South & Western India. High demand for GPU-28 graded grain lots.',
    historicalPoints: [34, 35, 36, 36, 37],
    forecastPoints: [37, 38, 38, 39, 40]
  },
  foxtail: {
    crop: 'Foxtail Millet',
    currentPrice: 37,
    unit: 'kg',
    expectedRange: [35, 39],
    trend: 'stable',
    trendPct: '+3%',
    explanationKey: 'insights.price.foxtail_desc',
    defaultExplanation: 'Consistent urban health-grain packaging requisition with stable wholesale farmgate realization for SiA 3088.',
    historicalPoints: [35, 35, 36, 36, 37],
    forecastPoints: [37, 37, 38, 38, 39]
  },
  kodo: {
    crop: 'Kodo Millet',
    currentPrice: 26,
    unit: 'kg',
    expectedRange: [25, 28],
    trend: 'stable',
    trendPct: '+2%',
    explanationKey: 'insights.price.kodo_desc',
    defaultExplanation: 'Tribal collective arrivals from Central India and Chhattisgarh belt maintaining steady farmgate transactions.',
    historicalPoints: [24, 25, 25, 25, 26],
    forecastPoints: [26, 26, 27, 27, 28]
  },
  little_millet: {
    crop: 'Little Millet (Kutki)',
    currentPrice: 26,
    unit: 'kg',
    expectedRange: [25, 29],
    trend: 'up',
    trendPct: '+4%',
    explanationKey: 'insights.price.little_desc',
    defaultExplanation: 'Strong regional demand for organic-certified local Kutki crops with high processing recovery rates.',
    historicalPoints: [24, 24, 25, 25, 26],
    forecastPoints: [26, 27, 27, 28, 29]
  }
}

interface HarvestEstimateData {
  crop: string
  variety: string
  region: string
  harvestWindow: string
  daysRemaining: string
  stage: string
  stagePct: number
  recommendedActionKey: string
  defaultAction: string
}

const HARVEST_DATA: HarvestEstimateData[] = [
  {
    crop: 'Tomatoes',
    variety: 'Roma / Hybrid',
    region: 'Nashik Agri Cluster, MH',
    harvestWindow: '8 – 12 Days (Mid Sep 2026)',
    daysRemaining: '8–12 days',
    stage: 'Color Break / Mature Green',
    stagePct: 82,
    recommendedActionKey: 'insights.harvest.tomato_action',
    defaultAction: 'Prepare institutional procurement lot on marketplace for pre-harvest forward matching.'
  },
  {
    crop: 'Ragi (Finger Millet)',
    variety: 'GPU-28',
    region: 'Kolhapur & Belagavi Belt',
    harvestWindow: '14 – 20 Days (Late Sep 2026)',
    daysRemaining: '14–20 days',
    stage: 'Grain Hardening / Maturity',
    stagePct: 75,
    recommendedActionKey: 'insights.harvest.ragi_action',
    defaultAction: 'Review grain moisture testing protocols and publish consignment volume.'
  },
  {
    crop: 'Onions (Red)',
    variety: 'Garwa / Cured',
    region: 'Lasalgaon & Niphad, MH',
    harvestWindow: 'Harvest Complete / Curing',
    daysRemaining: 'Ready Now',
    stage: 'Post-Harvest Curing Complete',
    stagePct: 100,
    recommendedActionKey: 'insights.harvest.onion_action',
    defaultAction: 'Immediate farmgate dispatch available. Direct buyer matching ready.'
  },
  {
    crop: 'Wheat',
    variety: 'Lokwan',
    region: 'Malwa & Vidarbha Basin',
    harvestWindow: '30 – 40 Days (Oct 2026)',
    daysRemaining: '30–40 days',
    stage: 'Heading & Flowering',
    stagePct: 55,
    recommendedActionKey: 'insights.harvest.wheat_action',
    defaultAction: 'Monitor irrigation schedule; register expected harvest volume with FPO.'
  },
  {
    crop: 'Kodo Millet',
    variety: 'TNAU 86',
    region: 'Bastar & Durg Corridor, CG',
    harvestWindow: '10 – 15 Days (Late Sep 2026)',
    daysRemaining: '10–15 days',
    stage: 'Full Earhead Ripening',
    stagePct: 85,
    recommendedActionKey: 'insights.harvest.kodo_action',
    defaultAction: 'Schedule threshing logistics and book cooperative collection center pickup.'
  }
]

export function MarketInsights() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState<'prices' | 'harvest' | 'demand'>('prices')
  const [selectedCropKey, setSelectedCropKey] = useState<string>('tomatoes')

  const currentPrediction = PREDICTION_DATA[selectedCropKey] || PREDICTION_DATA.tomatoes

  return (
    <div className="space-y-8" id="market-insights">
      {/* Area Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-border">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-900/10 dark:bg-emerald-950/60 border border-forest-900/20 dark:border-emerald-800 text-xs font-semibold text-forest-900 dark:text-[#8FBF2E]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('insights.badge') || 'Market Insights · Direct Decision Support'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-foreground">
            {t('insights.title') || 'Prices, Harvest Windows & Demand'}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
            {t('insights.subtitle') || 'Understand crop prices, plan harvest dispatches, and check buyer demand across regions.'}
          </p>
        </div>

        {/* Feature Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-custom bg-neutral-100 dark:bg-neutral-900 border border-border shrink-0">
          <button
            onClick={() => setActiveTab('prices')}
            className={`px-3.5 py-1.5 rounded-custom text-xs font-semibold transition-all ${
              activeTab === 'prices'
                ? 'bg-card-bg text-foreground shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-foreground'
            }`}
          >
            {t('insights.tab_prices') || 'Price Prediction'}
          </button>
          <button
            onClick={() => setActiveTab('harvest')}
            className={`px-3.5 py-1.5 rounded-custom text-xs font-semibold transition-all ${
              activeTab === 'harvest'
                ? 'bg-card-bg text-foreground shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-foreground'
            }`}
          >
            {t('insights.tab_harvest') || 'Harvest Estimate'}
          </button>
          <button
            onClick={() => setActiveTab('demand')}
            className={`px-3.5 py-1.5 rounded-custom text-xs font-semibold transition-all ${
              activeTab === 'demand'
                ? 'bg-card-bg text-foreground shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-foreground'
            }`}
          >
            {t('insights.tab_demand') || 'Demand Forecast'}
          </button>
        </div>
      </div>

      {/* TAB 1: PRICE PREDICTION */}
      {activeTab === 'prices' && (
        <div className="space-y-6">
          {/* Crop Selector Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {Object.entries(PREDICTION_DATA).map(([key, data]) => {
              const isSelected = selectedCropKey === key
              return (
                <button
                  key={key}
                  onClick={() => setSelectedCropKey(key)}
                  className={`px-3.5 py-1.5 rounded-custom text-xs font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-forest-900 text-white dark:bg-[#1B3826] dark:text-[#8FBF2E] dark:border dark:border-[#8FBF2E]/40 shadow-xs'
                      : 'bg-card-bg border border-border text-neutral-600 dark:text-neutral-400 hover:border-forest-900/30 hover:text-foreground'
                  }`}
                >
                  {data.crop}
                </button>
              )
            })}
          </div>

          {/* Main Price Prediction Card Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Col: Current Price & Near-Term Range */}
            <div className="lg:col-span-5 space-y-4">
              <Card className="border border-border bg-card-bg shadow-xs p-6 space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block">
                      {t('insights.price.crop_selected') || 'Commodity Reference'}
                    </span>
                    <h3 className="text-xl font-bold font-display text-foreground mt-0.5">
                      {currentPrediction.crop}
                    </h3>
                  </div>
                  <Badge variant="default" size="sm" className="font-mono text-[11px]">
                    {t('insights.price.badge') || 'Reference Price'}
                  </Badge>
                </div>

                {/* Quantitative Price Display */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-custom border border-border bg-neutral-50/70 dark:bg-neutral-900/50">
                    <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold block">
                      {t('insights.price.current_ref') || 'Current Reference'}
                    </span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="font-mono text-2xl font-extrabold text-foreground">
                        ₹{currentPrediction.currentPrice}
                      </span>
                      <span className="text-xs font-mono text-neutral-500">/{currentPrediction.unit}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-custom border border-forest-900/20 dark:border-[#8FBF2E]/30 bg-forest-900/5 dark:bg-[#8FBF2E]/10">
                    <span className="text-[10px] text-forest-900 dark:text-[#8FBF2E] uppercase tracking-wider font-bold block">
                      {t('insights.price.expected_range') || 'Expected Near-Term Range'}
                    </span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="font-mono text-2xl font-extrabold text-forest-900 dark:text-[#8FBF2E]">
                        ₹{currentPrediction.expectedRange[0]}–₹{currentPrediction.expectedRange[1]}
                      </span>
                      <span className="text-xs font-mono text-neutral-500">/{currentPrediction.unit}</span>
                    </div>
                  </div>
                </div>

                {/* Trend Badge & Explanation */}
                <div className="p-3.5 rounded-custom border border-border bg-card-bg space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-neutral-600 dark:text-neutral-400">
                      {t('insights.price.near_term_trend') || 'Near-Term Movement:'}
                    </span>
                    <span className="inline-flex items-center gap-1 font-mono font-bold text-xs text-emerald-700 dark:text-emerald-400">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {currentPrediction.trendPct} Stable to Firm
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {t(currentPrediction.explanationKey) || currentPrediction.defaultExplanation}
                  </p>
                </div>

                {/* Estimated Price Note */}
                <div className="flex items-start gap-2 p-3 rounded-custom bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-[11px] leading-tight">
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    <strong>Estimated Price:</strong> {t('insights.price.disclaimer') || 'Reference prices and expected ranges are indicative estimates calculated from recent market wholesale averages.'}
                  </span>
                </div>
              </Card>
            </div>

            {/* Right Col: Simple Visual Trend Chart */}
            <div className="lg:col-span-7">
              <Card className="border border-border bg-card-bg shadow-xs p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold font-display text-foreground">
                      {t('insights.price.chart_title') || 'Price Movement & Indicative Projection'} ({currentPrediction.crop})
                    </h4>
                    <p className="text-xs text-neutral-500">
                      {t('insights.price.chart_subtitle') || 'Recent reference points (solid) and near-term expected range (dashed).'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-mono">
                    <span className="flex items-center gap-1 text-neutral-500">
                      <span className="w-2.5 h-0.5 bg-neutral-400 inline-block"></span> Past
                    </span>
                    <span className="flex items-center gap-1 text-forest-900 dark:text-[#8FBF2E] font-bold">
                      <span className="w-2.5 h-0.5 bg-forest-900 dark:bg-[#8FBF2E] inline-block border-t border-dashed"></span> Expected
                    </span>
                  </div>
                </div>

                {/* Simple SVG Trend Visualizer */}
                <div className="w-full bg-neutral-50 dark:bg-neutral-900/60 rounded-custom border border-border p-4 pt-6">
                  <svg viewBox="0 0 500 180" className="w-full h-44 overflow-visible">
                    {/* Horizontal Grid lines */}
                    <line x1="40" y1="30" x2="480" y2="30" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
                    <line x1="40" y1="80" x2="480" y2="80" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
                    <line x1="40" y1="130" x2="480" y2="130" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />

                    {/* Y Axis Labels */}
                    <text x="10" y="34" className="fill-neutral-400 font-mono text-[10px]">₹{Math.max(...currentPrediction.forecastPoints) + 2}</text>
                    <text x="10" y="84" className="fill-neutral-400 font-mono text-[10px]">₹{currentPrediction.currentPrice}</text>
                    <text x="10" y="134" className="fill-neutral-400 font-mono text-[10px]">₹{Math.min(...currentPrediction.historicalPoints) - 2}</text>

                    {/* Historical Polyline (Solid) */}
                    <polyline
                      fill="none"
                      stroke="#7d8e82"
                      strokeWidth="2.5"
                      points="60,110 110,95 160,95 210,80 260,70"
                    />

                    {/* Forecast Polyline (Dashed Primary) */}
                    <polyline
                      fill="none"
                      stroke="#155e3b"
                      className="dark:stroke-[#8FBF2E]"
                      strokeWidth="2.5"
                      strokeDasharray="5 4"
                      points="260,70 310,65 360,60 410,50 460,45"
                    />

                    {/* Points */}
                    {[
                      { x: 60, y: 110, p: currentPrediction.historicalPoints[0] },
                      { x: 110, y: 95, p: currentPrediction.historicalPoints[1] },
                      { x: 160, y: 95, p: currentPrediction.historicalPoints[2] },
                      { x: 210, y: 80, p: currentPrediction.historicalPoints[3] },
                      { x: 260, y: 70, p: currentPrediction.currentPrice, current: true },
                      { x: 310, y: 65, p: currentPrediction.forecastPoints[1] },
                      { x: 360, y: 60, p: currentPrediction.forecastPoints[2] },
                      { x: 410, y: 50, p: currentPrediction.forecastPoints[3] },
                      { x: 460, y: 45, p: currentPrediction.forecastPoints[4] },
                    ].map((pt, i) => (
                      <g key={i}>
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={pt.current ? "5" : "3.5"}
                          className={pt.current ? "fill-forest-900 dark:fill-[#8FBF2E] stroke-white stroke-2" : "fill-neutral-400 dark:fill-neutral-600"}
                        />
                        <text
                          x={pt.x}
                          y={pt.y - 10}
                          textAnchor="middle"
                          className={`font-mono text-[10px] ${pt.current ? "fill-forest-900 dark:fill-[#8FBF2E] font-bold" : "fill-neutral-500"}`}
                        >
                          ₹{pt.p}
                        </text>
                      </g>
                    ))}

                    {/* X Axis Time Labels */}
                    <text x="60" y="160" textAnchor="middle" className="fill-neutral-400 font-mono text-[10px]">10d ago</text>
                    <text x="160" y="160" textAnchor="middle" className="fill-neutral-400 font-mono text-[10px]">5d ago</text>
                    <text x="260" y="160" textAnchor="middle" className="fill-forest-900 dark:fill-[#8FBF2E] font-mono text-[10px] font-bold">Today</text>
                    <text x="360" y="160" textAnchor="middle" className="fill-neutral-400 font-mono text-[10px]">+5d est</text>
                    <text x="460" y="160" textAnchor="middle" className="fill-neutral-400 font-mono text-[10px]">+10d est</text>
                  </svg>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HARVEST ESTIMATE */}
      {activeTab === 'harvest' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {HARVEST_DATA.map((item, idx) => (
              <Card key={idx} className="border border-border bg-card-bg shadow-xs p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-base font-bold font-display text-foreground">
                        {item.crop}
                      </h4>
                      <span className="text-xs text-neutral-500 font-medium">
                        {item.variety} • {item.region}
                      </span>
                    </div>
                    <Badge variant={item.stagePct === 100 ? 'success' : 'default'} size="sm">
                      {item.daysRemaining}
                    </Badge>
                  </div>

                  {/* Stage Progress Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-neutral-600 dark:text-neutral-400">{item.stage}</span>
                      <span className="font-mono font-bold text-forest-900 dark:text-[#8FBF2E]">{item.stagePct}%</span>
                    </div>
                    <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-forest-900 dark:bg-[#8FBF2E] h-full rounded-full transition-all duration-500"
                        style={{ width: `${item.stagePct}%` }}
                      />
                    </div>
                  </div>

                  {/* Harvest Window Box */}
                  <div className="p-3 rounded-custom bg-neutral-50 dark:bg-neutral-900/60 border border-border text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-neutral-500 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{t('insights.harvest.window') || 'Expected Harvest Window:'}</span>
                    </div>
                    <span className="font-semibold text-foreground block font-mono text-[11px]">
                      {item.harvestWindow}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {t(item.recommendedActionKey) || item.defaultAction}
                  </p>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-neutral-500">
                  <span>Expected Harvest</span>
                  <span className="font-mono">Regional Cluster Data</span>
                </div>
              </Card>
            ))}
          </div>

          {/* Prototype note */}
          <div className="p-4 rounded-custom bg-card-bg border border-border flex items-center gap-3 text-xs text-neutral-600 dark:text-neutral-400">
            <HelpCircle className="w-4 h-4 text-neutral-400 shrink-0" />
            <span>
              {t('insights.harvest.note') || 'Harvest window estimates are calculated from regional sowing schedules and farmer collective updates. Exact field maturity may vary by local weather.'}
            </span>
          </div>
        </div>
      )}

      {/* TAB 3: DEMAND FORECAST */}
      {activeTab === 'demand' && (
        <div className="space-y-4">
          <DemandForecast />
        </div>
      )}
    </div>
  )
}
