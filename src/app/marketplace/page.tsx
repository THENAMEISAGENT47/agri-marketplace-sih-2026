'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardTitle, Button, Badge, Alert } from '@/components/ui'
import { MatchingSearch } from '@/components/marketplace/matching-search'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { demoSuppliers } from '@/services/matching/matcher'
import { useLanguage } from '@/contexts/LanguageContext'
import { getCommodityImage, getCommodityAlt, getCommodityCategory } from '@/lib/commodities'
import { 
  Filter, 
  LayoutGrid, 
  List, 
  Sparkles, 
  Scale, 
  Search, 
  X, 
  Package, 
  Star,
  MapPin,
  Calendar,
  RotateCcw
} from 'lucide-react'
import { Reveal, StaggerContainer, StaggerItem, MotionCard } from '@/components/motion'

interface InventoryItem {
  product_id: string
  farmer_id: string
  quantity?: number
  available_quantity?: number
  is_available?: boolean
}

// Canonical category taxonomy options
const TAXONOMY_CATEGORIES = [
  { id: 'all', labelKey: 'market.filter.all' },
  { id: 'Vegetables', labelKey: 'market.filter.vegetables' },
  { id: 'Tubers', labelKey: 'market.filter.tubers' },
  { id: 'Spices', labelKey: 'market.filter.spices' },
  { id: 'Grains / Cereals', labelKey: 'market.filter.grains' },
  { id: 'Pulses & Oilseeds', labelKey: 'market.filter.pulses' },
]

export default function MarketplacePage() {
  const { userId } = useCurrentUser()
  const { t } = useLanguage()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedCommodity, setSelectedCommodity] = useState('all')
  const [minQuantity, setMinQuantity] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [qualityGrade, setQualityGrade] = useState('all')
  const [sortBy, setSortBy] = useState('default')
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  
  const [showMatching, setShowMatching] = useState(false)
  const [isInventoryLoading, setIsInventoryLoading] = useState(false)
  const [orderingProductId, setOrderingProductId] = useState<string | null>(null)
  const [inventory, setInventory] = useState<Record<string, number>>({
    prod1_farmer1: 500,
    prod2_farmer2: 300,
    prod3_farmer3: 200,
    prod4_farmer1: 400,
    prod5_farmer2: 600,
    prod6_farmer3: 1200,
    prod7_farmer1: 2000,
    prod8_farmer2: 1500,
    prod9_farmer3: 800,
    prod10_farmer1: 1000,
    prod11_farmer3: 500,
    prod12_farmer2: 700,
    prod13_farmer1: 600,
    prod14_farmer2: 450,
    prod15_farmer3: 400,
    prod16_farmer1: 1200,
    prod17_farmer2: 1000,
    prod18_farmer3: 800,
    prod19_farmer1: 350,
    prod20_farmer1: 500,
    prod21_farmer2: 1000,
    prod22_farmer3: 800,
    prod23_farmer1: 1200,
    prod24_farmer2: 900,
  })
  const [orderError, setOrderError] = useState('')
  const [orderSuccess, setOrderSuccess] = useState('')

  const fetchInventory = useCallback(async () => {
    try {
      const response = await fetch('/api/inventory')
      if (response.ok) {
        const data = (await response.json()) as InventoryItem[]
        const inventoryMap: Record<string, number> = {}
        data.forEach((item) => {
          const key = `${item.product_id}_${item.farmer_id}`
          const isAvail = item.is_available !== false
          const qty = item.quantity !== undefined ? item.quantity : (item.available_quantity || 0)
          inventoryMap[key] = isAvail ? qty : 0
        })
        setInventory(inventoryMap)
      }
    } catch (error) {
      console.error('Error fetching inventory:', error)
    } finally {
      setIsInventoryLoading(false)
    }
  }, [])

  useEffect(() => {
    let ignore = false
    const init = async () => {
      try {
        const response = await fetch('/api/inventory')
        if (response.ok && !ignore) {
          const data = (await response.json()) as InventoryItem[]
          const inventoryMap: Record<string, number> = {}
          data.forEach((item) => {
            const key = `${item.product_id}_${item.farmer_id}`
            const isAvail = item.is_available !== false
            const qty = item.quantity !== undefined ? item.quantity : (item.available_quantity || 0)
            inventoryMap[key] = isAvail ? qty : 0
          })
          setInventory(inventoryMap)
        }
      } catch (error) {
        console.error('Error fetching inventory:', error)
      } finally {
        if (!ignore) {
          setIsInventoryLoading(false)
        }
      }
    }
    init()
    return () => {
      ignore = true
    }
  }, [])

  // Unique commodity names for sub-filtering
  const commodityList = useMemo(() => {
    return ['all', ...Array.from(new Set(demoSuppliers.map(p => p.product_name)))]
  }, [])

  // Count items per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: demoSuppliers.length }
    demoSuppliers.forEach(p => {
      const cat = getCommodityCategory(p.product_name)
      counts[cat] = (counts[cat] || 0) + 1
    })
    return counts
  }, [])

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    const result = demoSuppliers.filter(product => {
      const inventoryKey = `${product.product_id}_${product.farmer_id}`
      const availableStock = inventory[inventoryKey] !== undefined ? inventory[inventoryKey] : product.available_quantity
      const category = getCommodityCategory(product.product_name)
      
      const matchesSearch = !searchTerm || 
                           product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.farmer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           category.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = selectedCategory === 'all' || category === selectedCategory
      const matchesCommodity = selectedCommodity === 'all' || product.product_name === selectedCommodity
      const matchesMinQty = !minQuantity || availableStock >= parseInt(minQuantity)
      const matchesMaxPrice = !maxPrice || product.price_per_unit <= parseInt(maxPrice)
      const matchesQuality = qualityGrade === 'all' || product.quality_grade === qualityGrade

      return matchesSearch && matchesCategory && matchesCommodity && matchesMinQty && matchesMaxPrice && matchesQuality
    })

    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.price_per_unit - b.price_per_unit)
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.price_per_unit - a.price_per_unit)
    } else if (sortBy === 'qty_desc') {
      result.sort((a, b) => {
        const aQty = inventory[`${a.product_id}_${a.farmer_id}`] ?? a.available_quantity
        const bQty = inventory[`${b.product_id}_${b.farmer_id}`] ?? b.available_quantity
        return bQty - aQty
      })
    }

    return result
  }, [searchTerm, selectedCategory, selectedCommodity, minQuantity, maxPrice, qualityGrade, sortBy, inventory])

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (selectedCategory !== 'all') count++
    if (selectedCommodity !== 'all') count++
    if (minQuantity) count++
    if (maxPrice) count++
    if (qualityGrade !== 'all') count++
    if (searchTerm) count++
    return count
  }, [selectedCategory, selectedCommodity, minQuantity, maxPrice, qualityGrade, searchTerm])

  const handleResetFilters = () => {
    setSearchTerm('')
    setSelectedCategory('all')
    setSelectedCommodity('all')
    setMinQuantity('')
    setMaxPrice('')
    setQualityGrade('all')
    setSortBy('default')
  }

  const handleOrder = async (productId: string, farmerId: string, price: number, qty: number) => {
    try {
      setOrderError('')
      setOrderSuccess('')
      setOrderingProductId(productId)
      
      if (qty <= 0) {
        setOrderError(t('market.toast.out_of_stock'))
        return
      }

      const orderQty = Math.min(qty, 500)
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyer_id: userId || 'buyer1',
          items: [{
            product_id: productId,
            farmer_id: farmerId,
            quantity: orderQty,
            price_per_unit: price,
          }],
          delivery_address: 'Designated Buyer Location / Central Depot',
          delivery_lat: 19.033,
          delivery_lng: 73.0297,
          notes: 'Standard farmgate procurement consignment',
        }),
      })

      if (response.ok) {
        const order = await response.json()
        setOrderSuccess(`${t('market.toast.success')} ID: ${order.id || 'ORD-NEW'} (${orderQty} kg @ ₹${price}/kg)`)
        await fetchInventory()
      } else {
        setOrderSuccess(`${t('market.toast.demo')} (${orderQty} kg allocated)`)
      }
    } catch {
      setOrderSuccess(`${t('market.toast.demo')}`)
    } finally {
      setOrderingProductId(null)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 transition-colors duration-200">
      <div className="w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
        
        {/* PROCUREMENT HEADER */}
        <Reveal>
          <header className="space-y-4 pb-6 border-b border-border">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-900/10 dark:bg-emerald-950/70 border border-forest-900/20 dark:border-emerald-800 text-xs font-semibold text-forest-900 dark:text-[#8FBF2E]">
                <Scale className="w-3.5 h-3.5" />
                <span>{t('market.badge')}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display tracking-tight text-foreground">
                {t('market.title')}
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {t('market.subtitle')}
              </p>
            </div>

            {/* View Mode & Mode Switcher */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <div className="inline-flex bg-neutral-100 dark:bg-neutral-900 rounded-custom p-1 border border-border text-xs">
                <button
                  onClick={() => setShowMatching(false)}
                  className={`px-3.5 py-2 rounded-custom font-semibold transition-all ${
                    !showMatching 
                      ? 'bg-card-bg text-foreground shadow-xs' 
                      : 'text-neutral-500 hover:text-foreground'
                  }`}
                >
                  {t('market.tab.catalog')} ({filteredAndSortedProducts.length})
                </button>
                <button
                  onClick={() => setShowMatching(true)}
                  className={`px-3.5 py-2 rounded-custom font-semibold transition-all flex items-center gap-1.5 ${
                    showMatching 
                      ? 'bg-card-bg text-forest-900 dark:text-[#8FBF2E] shadow-xs' 
                      : 'text-neutral-500 hover:text-foreground'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {t('market.tab.matcher')}
                </button>
              </div>
            </div>
          </div>

          {/* CATEGORY TAXONOMY PILLS (Centralized Taxonomy) */}
          {!showMatching && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 no-scrollbar">
              {TAXONOMY_CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id
                const count = categoryCounts[cat.id] || 0
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id)
                      setSelectedCommodity('all')
                    }}
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-custom text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                      isActive
                        ? 'bg-forest-900 text-white dark:bg-[#1B3826] dark:text-[#8FBF2E] dark:border dark:border-[#8FBF2E]/40 shadow-xs'
                        : 'bg-card-bg border border-border text-neutral-600 dark:text-neutral-300 hover:border-forest-900/40 hover:text-foreground'
                    }`}
                  >
                    <span>{t(cat.labelKey)}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                      isActive 
                        ? 'bg-white/20 text-white dark:bg-[#8FBF2E]/20 dark:text-[#8FBF2E]' 
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
                    }`}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </header>
        </Reveal>

        {/* MULTI-SUPPLIER MATCHER OVERLAY */}
        {showMatching && (
          <div className="pt-2">
            <MatchingSearch
              onOrderPlacement={() => {}}
              showFullResults={true}
            />
          </div>
        )}

        {/* MAIN CATALOG INTERFACE */}
        {!showMatching && (
          <div className="space-y-5">

            {/* PROCUREMENT CONTROLS TOOLBAR */}
            <Reveal delay={0.08}>
            <div className="p-3.5 bg-card-bg rounded-custom border border-border shadow-xs flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
              
              {/* Search Bar */}
              <div className="relative flex-1 min-w-[260px]">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder={t('market.search.placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 rounded-custom border border-border bg-background text-foreground text-xs placeholder:text-neutral-400 focus:outline-hidden focus:ring-1 focus:ring-forest-900 dark:focus:ring-[#8FBF2E]"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-neutral-400 hover:text-foreground"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Toolbar Actions & Secondary Selectors */}
              <div className="flex flex-wrap items-center gap-2.5 justify-between lg:justify-end">
                
                {/* Mobile/Toggle Filter Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="text-xs h-9 font-medium"
                >
                  <Filter className="w-3.5 h-3.5 mr-1.5" />
                  {showFilters ? t('market.btn.close_filters') : t('market.btn.filter_options')}
                  {activeFiltersCount > 0 && (
                    <span className="ml-1.5 w-4 h-4 rounded-full bg-forest-900 text-white dark:bg-[#8FBF2E] dark:text-neutral-900 text-[10px] font-bold flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>

                {/* Quality Grade Selector */}
                <select
                  value={qualityGrade}
                  onChange={(e) => setQualityGrade(e.target.value)}
                  className="px-3 py-2 border border-border rounded-custom bg-background text-foreground text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-forest-900 dark:focus:ring-[#8FBF2E]"
                >
                  <option value="all">{t('market.filter.all_grades')}</option>
                  <option value="A">{t('market.filter.grade_a')}</option>
                  <option value="B">{t('market.filter.grade_b')}</option>
                  <option value="C">{t('market.filter.grade_c')}</option>
                </select>

                {/* Sort Selector */}
                <div className="flex items-center gap-1.5">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-border rounded-custom bg-background text-foreground text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-forest-900 dark:focus:ring-[#8FBF2E]"
                  >
                    <option value="default">{t('market.sort.relevance')}</option>
                    <option value="price_asc">{t('market.sort.price_asc')}</option>
                    <option value="price_desc">{t('market.sort.price_desc')}</option>
                    <option value="qty_desc">{t('market.sort.qty_desc')}</option>
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="inline-flex border border-border rounded-custom p-0.5 bg-neutral-100 dark:bg-neutral-900">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-custom transition-all ${
                      viewMode === 'grid' 
                        ? 'bg-card-bg text-foreground shadow-xs' 
                        : 'text-neutral-400 hover:text-foreground'
                    }`}
                    title={t('market.view.grid')}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-1.5 rounded-custom transition-all ${
                      viewMode === 'table' 
                        ? 'bg-card-bg text-foreground shadow-xs' 
                        : 'text-neutral-400 hover:text-foreground'
                    }`}
                    title={t('market.view.table')}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            </Reveal>

            {/* COLLAPSIBLE DETAILED FILTERS DRAWER / ROW */}
            {showFilters && (
              <div className="p-4 bg-card-bg rounded-custom border border-border shadow-xs animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  
                  {/* Specific Produce Dropdown */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                      {t('market.filter.commodity')}
                    </label>
                    <select
                      value={selectedCommodity}
                      onChange={(e) => setSelectedCommodity(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-custom bg-background text-foreground text-xs focus:ring-1 focus:ring-forest-900"
                    >
                      {commodityList.map((comm) => (
                        <option key={comm} value={comm}>
                          {comm === 'all' ? t('market.filter.all') : comm}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Max Price */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                      {t('market.filter.max_price')}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 font-mono">₹</span>
                      <input
                        type="number"
                        placeholder="e.g. 30"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full pl-7 pr-3 py-2 border border-border rounded-custom bg-background text-foreground text-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* Min Quantity */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                      {t('market.filter.min_qty')}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="e.g. 500"
                        value={minQuantity}
                        onChange={(e) => setMinQuantity(e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-custom bg-background text-foreground text-xs font-mono"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-[11px]">kg</span>
                    </div>
                  </div>

                  {/* Reset Action */}
                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleResetFilters}
                      className="w-full text-xs h-9"
                    >
                      <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                      {t('market.btn.reset')}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* ACTIVE FILTERS CHIP BAR */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 text-xs py-1">
                <span className="text-neutral-500 font-semibold text-[11px] uppercase tracking-wider">
                  Active Filters:
                </span>
                
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-custom bg-neutral-100 dark:bg-neutral-800 text-foreground border border-border">
                    <span>{selectedCategory}</span>
                    <button onClick={() => setSelectedCategory('all')} className="hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {selectedCommodity !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-custom bg-neutral-100 dark:bg-neutral-800 text-foreground border border-border">
                    <span>{selectedCommodity}</span>
                    <button onClick={() => setSelectedCommodity('all')} className="hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {qualityGrade !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-custom bg-neutral-100 dark:bg-neutral-800 text-foreground border border-border font-mono">
                    <span>Grade {qualityGrade}</span>
                    <button onClick={() => setQualityGrade('all')} className="hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {maxPrice && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-custom bg-neutral-100 dark:bg-neutral-800 text-foreground border border-border font-mono">
                    <span>≤ ₹{maxPrice}/kg</span>
                    <button onClick={() => setMaxPrice('')} className="hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {minQuantity && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-custom bg-neutral-100 dark:bg-neutral-800 text-foreground border border-border font-mono">
                    <span>≥ {minQuantity} kg</span>
                    <button onClick={() => setMinQuantity('')} className="hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {searchTerm && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-custom bg-neutral-100 dark:bg-neutral-800 text-foreground border border-border">
                    <span>&quot;{searchTerm}&quot;</span>
                    <button onClick={() => setSearchTerm('')} className="hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                <button
                  onClick={handleResetFilters}
                  className="text-xs text-forest-900 dark:text-[#8FBF2E] underline font-medium hover:opacity-80 ml-1"
                >
                  {t('market.btn.reset')}
                </button>
              </div>
            )}

            {/* FEEDBACK ALERTS */}
            {orderError && (
              <Alert type="error" onClose={() => setOrderError('')}>
                {orderError}
              </Alert>
            )}
            {orderSuccess && (
              <Alert type="success" onClose={() => setOrderSuccess('')}>
                <div className="flex items-center justify-between gap-4 w-full">
                  <span>{orderSuccess}</span>
                  <Link href="/buyer/orders" className="underline font-bold hover:opacity-80 whitespace-nowrap">
                    View in Orders →
                  </Link>
                </div>
              </Alert>
            )}

            {/* PRODUCT CATALOG DISPLAY AREA */}
            {isInventoryLoading ? (
              /* High-End Skeleton State */
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
                  <div key={idx} className="border border-border rounded-custom bg-card-bg p-4 space-y-4 animate-pulse">
                    <div className="aspect-[16/10] bg-neutral-200 dark:bg-neutral-800 rounded-custom" />
                    <div className="h-5 bg-neutral-200 dark:bg-neutral-800 rounded-sm w-3/4" />
                    <div className="h-3.5 bg-neutral-200 dark:bg-neutral-800 rounded-sm w-1/2" />
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="h-12 bg-neutral-200 dark:bg-neutral-800 rounded-custom" />
                      <div className="h-12 bg-neutral-200 dark:bg-neutral-800 rounded-custom" />
                    </div>
                    <div className="h-10 bg-neutral-200 dark:bg-neutral-800 rounded-custom mt-2" />
                  </div>
                ))}
              </div>
            ) : filteredAndSortedProducts.length === 0 ? (
              /* Informative Empty State */
              <div className="text-center py-20 px-4 bg-card-bg rounded-custom border border-border shadow-xs space-y-4 max-w-lg mx-auto my-6">
                <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-400 mx-auto flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold font-display text-foreground">
                    {t('market.empty.title')}
                  </h3>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                    {t('market.empty.desc')}
                  </p>
                </div>
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="text-xs font-semibold"
                  onClick={handleResetFilters}
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                  {t('market.btn.reset')}
                </Button>
              </div>
            ) : viewMode === 'table' ? (
              /* HIGH-DENSITY B2B PROCUREMENT TABLE VIEW (Desktop >= 640px, Stacked Cards < 640px) */
              <div className="border border-border rounded-custom bg-card-bg overflow-hidden shadow-xs">
                {/* Desktop Table View */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-neutral-100/80 dark:bg-neutral-900/90 border-b border-border text-neutral-600 dark:text-neutral-400 uppercase tracking-wider font-bold text-[10px]">
                        <th className="py-3 px-4">{t('market.table.commodity')}</th>
                        <th className="py-3 px-4">{t('market.table.category')}</th>
                        <th className="py-3 px-4">{t('market.table.supplier')}</th>
                        <th className="py-3 px-4">{t('market.table.origin')}</th>
                        <th className="py-3 px-4 font-mono">{t('market.table.volume')}</th>
                        <th className="py-3 px-4 font-mono">{t('market.table.price')}</th>
                        <th className="py-3 px-4">{t('market.table.grade')}</th>
                        <th className="py-3 px-4">{t('market.table.status')}</th>
                        <th className="py-3 px-4 text-right">{t('market.table.action')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredAndSortedProducts.map(product => {
                        const inventoryKey = `${product.product_id}_${product.farmer_id}`
                        const availableStock = inventory[inventoryKey] !== undefined ? inventory[inventoryKey] : product.available_quantity
                        const isOutOfStock = availableStock <= 0
                        const isLowStock = availableStock > 0 && availableStock < 300
                        const category = getCommodityCategory(product.product_name)

                        return (
                          <tr 
                            key={`${product.product_id}_${product.farmer_id}`} 
                            className="hover:bg-neutral-50/70 dark:hover:bg-neutral-900/40 transition-colors"
                          >
                            {/* Commodity & Variety */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <div className="relative w-10 h-10 rounded-custom overflow-hidden border border-border shrink-0 bg-neutral-100 dark:bg-neutral-800">
                                  <Image
                                    src={getCommodityImage(product.product_name)}
                                    alt={getCommodityAlt(product.product_name, product.variety)}
                                    fill
                                    sizes="40px"
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <strong className="text-foreground text-sm block font-semibold">
                                    {product.product_name}
                                  </strong>
                                  <span className="text-[11px] text-neutral-400 font-mono">
                                    {product.variety}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Category */}
                            <td className="py-3.5 px-4">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                                {category}
                              </span>
                            </td>

                            {/* Supplier */}
                            <td className="py-3.5 px-4 font-medium text-foreground">
                              <div className="flex items-center gap-1.5">
                                <span>{product.farmer_name}</span>
                                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">
                                  ★ {product.farmer_rating}
                                </span>
                              </div>
                            </td>

                            {/* Origin */}
                            <td className="py-3.5 px-4 text-neutral-500">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                                <span>Nashik Region</span>
                              </div>
                            </td>

                            {/* Available Stock */}
                            <td className="py-3.5 px-4">
                              <span className={`font-mono font-bold text-sm ${isOutOfStock ? 'text-red-500' : 'text-foreground'}`}>
                                {availableStock.toLocaleString()} {product.unit}
                              </span>
                            </td>

                            {/* Unit Price */}
                            <td className="py-3.5 px-4">
                              <span className="font-mono font-bold text-sm text-forest-900 dark:text-[#8FBF2E]">
                                ₹{product.price_per_unit}
                              </span>
                              <span className="text-[10px] text-neutral-400 font-mono">/{product.unit}</span>
                            </td>

                            {/* Quality Grade */}
                            <td className="py-3.5 px-4">
                              <Badge variant={product.quality_grade === 'A' ? 'success' : 'default'} size="sm">
                                Grade {product.quality_grade}
                              </Badge>
                            </td>

                            {/* Status Chip */}
                            <td className="py-3.5 px-4">
                              {isOutOfStock ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900">
                                  {t('market.status.out_of_stock')}
                                </span>
                              ) : isLowStock ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900">
                                  {t('market.status.low_stock')}
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                  {t('market.status.in_stock')}
                                </span>
                              )}
                            </td>

                            {/* Action Button */}
                            <td className="py-3.5 px-4 text-right">
                              <Button
                                variant={isOutOfStock ? 'outline' : 'primary'}
                                size="sm"
                                className="text-xs font-semibold h-8"
                                onClick={() => handleOrder(product.product_id, product.farmer_id, product.price_per_unit, availableStock)}
                                disabled={isOutOfStock || orderingProductId === product.product_id}
                              >
                                {isOutOfStock ? t('market.btn.depleted') : t('market.btn.procure')}
                              </Button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Stacked Cards for Table Mode (< 640px) */}
                <div className="sm:hidden divide-y divide-border">
                  {filteredAndSortedProducts.map(product => {
                    const inventoryKey = `${product.product_id}_${product.farmer_id}`
                    const availableStock = inventory[inventoryKey] !== undefined ? inventory[inventoryKey] : product.available_quantity
                    const isOutOfStock = availableStock <= 0
                    const isLowStock = availableStock > 0 && availableStock < 300
                    const category = getCommodityCategory(product.product_name)

                    return (
                      <div key={`tab-mob-${product.product_id}_${product.farmer_id}`} className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                            {category}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <Badge variant={product.quality_grade === 'A' ? 'success' : 'default'} size="sm">
                              Grade {product.quality_grade}
                            </Badge>
                            {isOutOfStock ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900">
                                {t('market.status.out_of_stock')}
                              </span>
                            ) : isLowStock ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900">
                                {t('market.status.low_stock')}
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                {t('market.status.in_stock')}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-custom overflow-hidden border border-border shrink-0 bg-neutral-100 dark:bg-neutral-800">
                            <Image
                              src={getCommodityImage(product.product_name)}
                              alt={getCommodityAlt(product.product_name, product.variety)}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <strong className="text-foreground text-sm block font-semibold truncate">
                              {product.product_name}
                            </strong>
                            <span className="text-xs text-neutral-400 font-mono block">
                              {product.variety}
                            </span>
                            <span className="text-[11px] text-muted-foreground truncate block mt-0.5">
                              {product.farmer_name} (★ {product.farmer_rating})
                            </span>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-mono font-bold text-forest-900 dark:text-[#8FBF2E] text-base block">
                              ₹{product.price_per_unit}
                            </span>
                            <span className="text-[10px] text-neutral-400 font-mono block">/{product.unit}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <div className="text-xs">
                            <span className="text-muted-foreground block text-[11px]">Available:</span>
                            <span className={`font-mono font-bold ${isOutOfStock ? 'text-red-500' : 'text-foreground'}`}>
                              {availableStock.toLocaleString()} {product.unit}
                            </span>
                          </div>
                          <Button
                            variant={isOutOfStock ? 'outline' : 'primary'}
                            size="sm"
                            className="text-xs font-semibold h-8 px-4"
                            onClick={() => handleOrder(product.product_id, product.farmer_id, product.price_per_unit, availableStock)}
                            disabled={isOutOfStock || orderingProductId === product.product_id}
                          >
                            {isOutOfStock ? t('market.btn.depleted') : t('market.btn.procure')}
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              /* BALANCED RESPONSIVE GRID VIEW (390px, 768px, 1280px, 1536px, 1920px) */
              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
                {filteredAndSortedProducts.map(product => {
                  const inventoryKey = `${product.product_id}_${product.farmer_id}`
                  const availableStock = inventory[inventoryKey] !== undefined ? inventory[inventoryKey] : product.available_quantity
                  const isOutOfStock = availableStock <= 0
                  const isLowStock = availableStock > 0 && availableStock < 300
                  const category = getCommodityCategory(product.product_name)
                  const isOrdering = orderingProductId === product.product_id

                  return (
                    <StaggerItem key={`${product.product_id}_${product.farmer_id}`}>
                    <Card 
                      className={`overflow-hidden border border-border bg-card-bg hover:border-forest-900/40 dark:hover:border-[#8FBF2E]/40 transition-all duration-200 flex flex-col justify-between group h-full ${
                        isOutOfStock ? 'opacity-70' : 'shadow-xs'
                      }`}
                    >
                      {/* Top Section: Media & Badges */}
                      <div>
                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800 border-b border-border">
                          <Image
                            src={getCommodityImage(product.product_name)}
                            alt={getCommodityAlt(product.product_name, product.variety)}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 25vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          
                          {/* Top-Left Category Overlay Chip */}
                          <div className="absolute top-3 left-3 flex items-center gap-1.5">
                            <span className="px-2.5 py-1 rounded-custom bg-black/70 backdrop-blur-xs text-white text-[10px] font-semibold tracking-wide uppercase border border-white/10">
                              {category}
                            </span>
                          </div>

                          {/* Top-Right Quality Grade Badge */}
                          <div className="absolute top-3 right-3 flex items-center gap-1.5">
                            <Badge 
                              variant={product.quality_grade === 'A' ? 'success' : 'default'} 
                              size="sm"
                              className="backdrop-blur-xs shadow-xs"
                            >
                              Grade {product.quality_grade}
                            </Badge>
                          </div>

                          {/* Depleted Overlay */}
                          {isOutOfStock && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                              <span className="px-3 py-1 rounded-custom bg-red-950/80 border border-red-500/30 text-red-300 font-mono text-xs font-bold uppercase tracking-wider">
                                {t('market.btn.depleted')}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Middle Section: Metadata & Produce Hierarchy */}
                        <div className="p-4 space-y-3.5">
                          
                          {/* Title & Variety Header */}
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <CardTitle className="text-lg font-bold font-display text-foreground leading-tight">
                                {product.product_name}
                              </CardTitle>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-custom text-[11px] font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-border">
                                  {product.variety}
                                </span>
                                <span className="text-[11px] text-neutral-400 font-medium">lot</span>
                              </div>
                            </div>
                            
                            {/* Stock Status Indicator Pill */}
                            <div>
                              {isOutOfStock ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900">
                                  {t('market.status.out_of_stock')}
                                </span>
                              ) : isLowStock ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
                                  {t('market.status.low_stock')}
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                  {t('market.status.in_stock')}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Producer Information */}
                          <div className="flex items-center justify-between text-xs py-2 border-y border-border">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="font-semibold text-foreground truncate">{product.farmer_name}</span>
                              <span className="text-neutral-400">•</span>
                              <span className="text-[11px] text-neutral-500 truncate">Nashik Region</span>
                            </div>
                            <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 shrink-0">
                              <Star className="w-3 h-3 fill-current" />
                              <span>{product.farmer_rating.toFixed(1)}</span>
                            </div>
                          </div>

                          {/* Quantitative Metrics Matrix */}
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            
                            {/* Available Stock Box */}
                            <div className="p-2.5 rounded-custom border border-border bg-neutral-50/70 dark:bg-neutral-900/50">
                              <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold block">
                                {t('market.card.available')}
                              </span>
                              <div className="flex items-baseline gap-1 mt-0.5">
                                <span className={`font-mono text-base font-extrabold ${isOutOfStock ? 'text-red-500' : 'text-foreground'}`}>
                                  {availableStock.toLocaleString()}
                                </span>
                                <span className="text-[11px] font-mono text-neutral-500 font-bold">{product.unit}</span>
                              </div>
                            </div>

                            {/* Reference Price Box */}
                            <div className="p-2.5 rounded-custom border border-forest-900/20 dark:border-[#8FBF2E]/30 bg-forest-900/5 dark:bg-[#8FBF2E]/10">
                              <span className="text-[10px] text-forest-900 dark:text-[#8FBF2E] uppercase tracking-wider font-bold block">
                                {t('market.card.unit_price')}
                              </span>
                              <div className="flex items-baseline gap-1 mt-0.5">
                                <span className="font-mono text-base font-extrabold text-forest-900 dark:text-[#8FBF2E]">
                                  ₹{product.price_per_unit}
                                </span>
                                <span className="text-[10px] font-mono text-forest-900/80 dark:text-[#8FBF2E]/80">/{product.unit}</span>
                              </div>
                            </div>
                          </div>

                          {/* Extra Verification Metadata */}
                          <div className="space-y-1.5 pt-1">
                            <div className="flex items-center justify-between text-[11px] text-neutral-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-neutral-400" />
                                <span>{product.harvest_date > '2026-09-15' ? t('market.expected_harvest') : t('market.harvest_date')}{product.harvest_date}</span>
                              </div>
                              <span className="font-medium text-neutral-400">Direct Settlement</span>
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-neutral-400 dark:text-neutral-500 font-mono">
                              <span>{t('market.ref_price_note')}</span>
                              <span>{t('market.demo_note')}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Section: Primary Procurement Action */}
                      <div className="p-4 pt-0">
                        <Button
                          variant={isOutOfStock ? 'outline' : 'primary'}
                          size="md"
                          className="w-full text-xs font-bold h-10 tracking-wide rounded-custom"
                          onClick={() => handleOrder(product.product_id, product.farmer_id, product.price_per_unit, availableStock)}
                          disabled={isOutOfStock || isOrdering}
                        >
                          {isOrdering ? (
                            <span className="flex items-center gap-2">
                              <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Allocating...
                            </span>
                          ) : isOutOfStock ? (
                            t('market.btn.depleted')
                          ) : (
                            t('market.btn.procure_this')
                          )}
                        </Button>
                      </div>
                    </Card>
                    </StaggerItem>
                  )
                })}
              </StaggerContainer>
            )}
          </div>
        )}
      </div>
    </div>
  )
}