'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Input, Button, Alert, LoadingSpinner } from '../ui'
import { MatchingCriteria, MatchingResult, SupplierMatch } from '@/services/matching'
import { MatchingResults } from './matching-results'
import { Sparkles, Play, MapPin, DollarSign, Star, SlidersHorizontal } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface MatchingSearchProps {
  onOrderPlacement?: (combination: SupplierMatch[]) => void
  showFullResults?: boolean
}

export function MatchingSearch({ onOrderPlacement, showFullResults = true }: MatchingSearchProps) {
  const { t } = useLanguage()
  const [criteria, setCriteria] = useState<Partial<MatchingCriteria>>({
    product_name: '',
    required_quantity: 0,
    max_price: undefined,
    buyer_location: { lat: 19.0330, lng: 73.0297 }, // Default to Thane, Mumbai
    availability_date: '',
    quality_preference: 'any',
    max_distance: undefined,
  })
  const [result, setResult] = useState<MatchingResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const availableProducts = ['Tomatoes', 'Onions', 'Potatoes', 'Carrots', 'Cabbage', 'Cauliflower']
  const qualityOptions = [
    { value: 'any', label: 'Any Quality' },
    { value: 'A', label: 'Grade A (Premium)' },
    { value: 'B', label: 'Grade B (Good)' },
    { value: 'C', label: 'Grade C (Standard)' },
  ]

  const handleSearch = async () => {
    if (!criteria.product_name || !criteria.required_quantity) {
      setError('Please select a product and enter the required quantity')
      return
    }

    setLoading(true)
    setError('')

    try {
      const searchCriteria: MatchingCriteria = {
        product_name: criteria.product_name,
        required_quantity: criteria.required_quantity,
        max_price: criteria.max_price,
        buyer_location: criteria.buyer_location!,
        availability_date: criteria.availability_date,
        quality_preference: criteria.quality_preference as MatchingCriteria['quality_preference'],
        max_distance: criteria.max_distance,
      }

      const response = await fetch('/api/matching/find-suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchCriteria),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Search failed')
      }

      const data: MatchingResult = await response.json()
      setResult(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to search for suppliers')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectCombination = (combination: SupplierMatch[]) => {
    if (onOrderPlacement) {
      onOrderPlacement(combination)
    }
  }

  const handleLoadDemoData = () => {
    setCriteria({
      product_name: 'Tomatoes',
      required_quantity: 800,
      max_price: undefined,
      buyer_location: { lat: 19.0330, lng: 73.0297 },
      availability_date: '',
      quality_preference: 'A',
      max_distance: undefined,
    })
    setError('')
  }

  const handleSelectSingle = (match: SupplierMatch) => {
    if (onOrderPlacement) {
      onOrderPlacement([match])
    }
  }

  return (
    <div className="space-y-8">
      {/* Search & Requirement Card */}
      <Card className="border border-border bg-card-bg shadow-sm">
        <CardHeader className="border-b border-border pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-bold font-display text-foreground flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-primary" />
                {t('matching.req_title')}
              </CardTitle>
              <CardDescription className="text-xs text-neutral-500 mt-1">
                {t('matching.req_desc')}
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLoadDemoData}
              className="border-primary text-primary hover:bg-primary-50 dark:hover:bg-primary-950/50 shrink-0 font-medium"
            >
              <Play className="w-3.5 h-3.5 mr-1.5" />
              {t('matching.btn_load_demo')}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Required Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-2">
                  {t('matching.field_product')} <span className="text-danger">*</span>
                </label>
                <select
                  value={criteria.product_name}
                  onChange={(e) => setCriteria({ ...criteria, product_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-card-bg text-foreground cursor-pointer text-sm"
                  required
                >
                  <option value="">{t('matching.select_product')}</option>
                  {availableProducts.map(product => (
                    <option key={product} value={product}>{product}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-2">
                  {t('matching.field_volume')} <span className="text-danger">*</span>
                </label>
                <div className="flex">
                  <Input
                    type="number"
                    value={criteria.required_quantity || ''}
                    onChange={(e) => setCriteria({ ...criteria, required_quantity: parseFloat(e.target.value) || 0 })}
                    placeholder="e.g. 800"
                    className="rounded-r-none"
                    required
                  />
                  <div className="px-4 py-2 border border-l-0 border-border rounded-r-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-mono text-xs flex items-center">
                    kg
                  </div>
                </div>
              </div>
            </div>

            {/* Optional Parameters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div>
                <label className="flex items-center gap-1 text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-2">
                  <DollarSign className="w-3.5 h-3.5 text-neutral-400" />
                  {t('matching.field_max_price')}
                </label>
                <Input
                  type="number"
                  value={criteria.max_price || ''}
                  onChange={(e) => setCriteria({ ...criteria, max_price: parseFloat(e.target.value) || undefined })}
                  placeholder="Optional limit"
                />
              </div>

              <div>
                <label className="flex items-center gap-1 text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-2">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                  {t('matching.field_max_distance')}
                </label>
                <Input
                  type="number"
                  value={criteria.max_distance || ''}
                  onChange={(e) => setCriteria({ ...criteria, max_distance: parseFloat(e.target.value) || undefined })}
                  placeholder="Optional radius"
                />
              </div>

              <div>
                <label className="flex items-center gap-1 text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-2">
                  <Star className="w-3.5 h-3.5 text-neutral-400" />
                  {t('matching.field_quality')}
                </label>
                <select
                  value={criteria.quality_preference}
                  onChange={(e) => setCriteria({ ...criteria, quality_preference: e.target.value as MatchingCriteria['quality_preference'] })}
                  className="w-full px-3.5 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-card-bg text-foreground cursor-pointer text-sm"
                >
                  {qualityOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 6 Established Factors Transparency Note */}
            <div className="p-3.5 rounded-lg bg-neutral-50 dark:bg-neutral-900/60 border border-border text-xs text-neutral-600 dark:text-neutral-400 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="font-bold text-foreground flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                {t('matching.factors_title')}:
              </span>
              <span className="px-2 py-0.5 rounded bg-card-bg border border-border text-[11px]">1. Quantity Match</span>
              <span className="px-2 py-0.5 rounded bg-card-bg border border-border text-[11px]">2. Price Competitiveness</span>
              <span className="px-2 py-0.5 rounded bg-card-bg border border-border text-[11px]">3. Proximity Distance</span>
              <span className="px-2 py-0.5 rounded bg-card-bg border border-border text-[11px]">4. Quality Grade</span>
              <span className="px-2 py-0.5 rounded bg-card-bg border border-border text-[11px]">5. Harvest Availability</span>
              <span className="px-2 py-0.5 rounded bg-card-bg border border-border text-[11px]">6. Farmer Reliability</span>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full h-12 text-base font-semibold shadow-sm"
              onClick={handleSearch}
              isLoading={loading}
            >
              {t('matching.run_heuristic')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert type="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <LoadingSpinner size="lg" />
          <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400 font-mono">
            {t('matching.evaluating')}
          </p>
        </div>
      )}

      {/* Results Display */}
      {result && showFullResults && (
        <MatchingResults
          result={result}
          onSelectCombination={handleSelectCombination}
          onSelectSingle={handleSelectSingle}
        />
      )}
    </div>
  )
}
