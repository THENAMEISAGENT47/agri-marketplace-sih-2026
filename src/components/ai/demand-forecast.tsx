'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Select, Alert, LoadingSpinner, Badge } from '../ui'

interface DemandForecastProps {
  showFullUI?: boolean
}

export function DemandForecast({ showFullUI = true }: DemandForecastProps) {
  const [productName, setProductName] = useState('')
  const [forecastDays, setForecastDays] = useState(30)
  const [region, setRegion] = useState('all')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<any>(null)

  const availableProducts = ['Tomatoes', 'Onions', 'Potatoes', 'Carrots', 'Cabbage']
  const regions = [
    { value: 'all', label: 'All Regions' },
    { value: 'Maharashtra', label: 'Maharashtra' },
    { value: 'Punjab', label: 'Punjab' },
    { value: 'Karnataka', label: 'Karnataka' },
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

      const data = await response.json()
      setResult(data)
    } catch (err: any) {
      setError(err.message || 'Failed to generate forecast')
    } finally {
      setLoading(false)
    }
  }

  const handleLoadDemoData = () => {
    setProductName('Tomatoes')
    setForecastDays(30)
    setRegion('all')
    setError('')
  }

  return (
    <div className="space-y-6">
      {/* Forecast Form */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>AI Demand Forecasting</CardTitle>
            <Button variant="outline" size="sm" onClick={handleLoadDemoData}>
              🍅 Load Demo Data
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product *
              </label>
              <select
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-foreground"
              >
                <option value="">Select product</option>
                {availableProducts.map(product => (
                  <option key={product} value={product}>{product}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Forecast Period (days)
                </label>
                <Input
                  type="number"
                  value={forecastDays}
                  onChange={(e) => setForecastDays(parseInt(e.target.value) || 30)}
                  min={1}
                  max={365}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Region
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-foreground"
                >
                  {regions.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <Button
              variant="primary"
              className="w-full"
              onClick={handleForecast}
              isLoading={loading}
            >
              Generate Forecast
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
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {result && showFullUI && (
        <>
          {/* Current Demand */}
          <Card>
            <CardHeader>
              <CardTitle>Current Demand</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">
                  {result.current_demand.toLocaleString()} kg
                </p>
                <p className="text-gray-600 mt-2">Current daily demand for {productName}</p>
              </div>
            </CardContent>
          </Card>

          {/* Demand Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>30-Day Demand Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-end justify-between h-32 gap-1">
                  {/* Simple bar chart visualization */}
                  {Array.from({ length: 30 }, (_, i) => {
                    const height = 30 + Math.random() * 70
                    const isCurrent = i === 29
                    return (
                      <div
                        key={i}
                        className={`flex-1 rounded-t transition-all ${
                          isCurrent ? 'bg-primary' : 'bg-primary/30'
                        }`}
                        style={{ height: `${height}%` }}
                        title={`Day ${i + 1}: ${Math.round(result.current_demand * (height / 100))} kg`}
                      />
                    )
                  })}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Day 1</span>
                  <span>Day 30 (Current)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trend Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Trend Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div>
                    <p className="text-sm text-gray-600">Trend Direction</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-2xl font-bold capitalize">
                        {result.trend}
                      </p>
                      {result.trend === 'increasing' && (
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      )}
                      {result.trend === 'decreasing' && (
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                        </svg>
                      )}
                      {result.trend === 'stable' && (
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Confidence</p>
                  <p className="text-2xl font-bold text-secondary">
                    {result.confidence_level}%
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${result.confidence_level}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>AI Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="text-accent mr-2">•</span>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Forecast Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Demand Forecast ({forecastDays} days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {result.predicted_demand.map((demand: number, index: number) => (
                  <div key={index} className="flex items-center">
                    <span className="w-24 text-sm text-gray-600">
                      {result.forecast_dates[index]}
                    </span>
                    <div className="flex-1 mx-4 bg-gray-200 rounded-full h-6">
                      <div
                        className="bg-primary h-6 rounded-full transition-all"
                        style={{ width: `${Math.min(100, (demand / Math.max(...result.predicted_demand)) * 100)}%` }}
                      />
                    </div>
                    <span className="w-20 text-sm font-medium text-right">
                      {demand.toLocaleString()} kg
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Model Info */}
          <Card>
            <CardHeader>
              <CardTitle>Model Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Model Type:</span>
                  <span className="font-medium">{result.model_info.model_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Version:</span>
                  <span className="font-medium">{result.model_info.version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Demo Mode:</span>
                  <span className="font-medium">{result.model_info.demo_mode ? 'Yes' : 'No'}</span>
                </div>
                {result.model_info.note && (
                  <div className="text-xs text-gray-500 mt-2 p-2 bg-yellow-50 rounded">
                    <div className="flex items-center mb-1">
                      <Badge variant="info" className="mr-2">Algorithmic Intelligence</Badge>
                      <span>Demo Mode</span>
                    </div>
                    ℹ️ {result.model_info.note}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}