'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Input, Button, Select, Alert, LoadingSpinner } from '../ui'
import { MatchingCriteria, MatchingResult } from '@/services/matching'
import { MatchingResults } from './matching-results'

interface MatchingSearchProps {
  onOrderPlacement?: (combination: any[]) => void
  showFullResults?: boolean
}

export function MatchingSearch({ onOrderPlacement, showFullResults = true }: MatchingSearchProps) {
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
      setError('Please enter product name and required quantity')
      return
    }

    setLoading(true)
    setError('')

    try {
      const searchCriteria: MatchingCriteria = {
        product_name: criteria.product_name!,
        required_quantity: criteria.required_quantity!,
        max_price: criteria.max_price,
        buyer_location: criteria.buyer_location!,
        availability_date: criteria.availability_date,
        quality_preference: criteria.quality_preference as any,
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
    } catch (err: any) {
      setError(err.message || 'Failed to search for suppliers')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectCombination = (combination: any[]) => {
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
      quality_preference: 'any',
      max_distance: undefined,
    })
    setError('')
  }

  const handleSelectSingle = (match: any) => {
    if (onOrderPlacement) {
      onOrderPlacement([match])
    }
  }

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle>Find Suppliers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Enter your requirements to find the best suppliers
              </p>
              <Button variant="outline" size="sm" onClick={handleLoadDemoData}>
                🍅 Load Demo Data (800kg Tomatoes)
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product *
                </label>
                <select
                  value={criteria.product_name}
                  onChange={(e) => setCriteria({ ...criteria, product_name: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-foreground"
                  required
                >
                  <option value="">Select product</option>
                  {availableProducts.map(product => (
                    <option key={product} value={product}>{product}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Required Quantity *
                </label>
                <div className="flex">
                  <Input
                    type="number"
                    value={criteria.required_quantity || ''}
                    onChange={(e) => setCriteria({ ...criteria, required_quantity: parseFloat(e.target.value) || 0 })}
                    placeholder="500"
                    className="rounded-r-none"
                    required
                  />
                  <select
                    value={criteria.buyer_location ? 'kg' : 'kg'}
                    className="px-3 py-2 border border-l-0 border-border rounded-r-lg bg-gray-50 text-gray-600"
                    disabled
                  >
                    <option value="kg">kg</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Maximum Price per Unit (₹)"
                type="number"
                value={criteria.max_price || ''}
                onChange={(e) => setCriteria({ ...criteria, max_price: parseFloat(e.target.value) || undefined })}
                placeholder="Optional"
              />

              <Input
                label="Maximum Distance (km)"
                type="number"
                value={criteria.max_distance || ''}
                onChange={(e) => setCriteria({ ...criteria, max_distance: parseFloat(e.target.value) || undefined })}
                placeholder="Optional"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quality Preference
                </label>
                <select
                  value={criteria.quality_preference}
                  onChange={(e) => setCriteria({ ...criteria, quality_preference: e.target.value as any })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-foreground"
                >
                  {qualityOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <Input
                label="Required By Date"
                type="date"
                value={criteria.availability_date || ''}
                onChange={(e) => setCriteria({ ...criteria, availability_date: e.target.value })}
              />
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                className="w-full"
                onClick={handleSearch}
                isLoading={loading}
              >
                Find Matching Suppliers
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert type="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {loading && (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {result && showFullResults && (
        <MatchingResults
          result={result}
          onSelectCombination={onOrderPlacement ? handleSelectCombination : undefined}
          onSelectSingle={onOrderPlacement ? handleSelectSingle : undefined}
        />
      )}
    </div>
  )
}