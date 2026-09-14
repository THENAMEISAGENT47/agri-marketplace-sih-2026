'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Alert } from '../ui'
import { SupplierMatch, MatchingResult } from '@/services/matching'
import { useCurrentUser } from '@/hooks/useCurrentUser'

interface MatchingResultsProps {
  result: MatchingResult
  onSelectCombination?: (combination: SupplierMatch[]) => void
  onSelectSingle?: (match: SupplierMatch) => void
}

export function MatchingResults({ result, onSelectCombination, onSelectSingle }: MatchingResultsProps) {
  const { userId } = useCurrentUser()
  const { matches, optimal_combination, recommendations, total_cost, total_quantity } = result
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [orderMessage, setOrderMessage] = useState('')
  const [orderMessageType, setOrderMessageType] = useState<'success' | 'error'>('success')

  const handlePlaceOrder = async (combination: SupplierMatch[]) => {
    setIsPlacingOrder(true)
    try {
      const items = combination.map(match => ({
        product_id: match.product_id,
        farmer_id: match.farmer_id,
        quantity: match.available_quantity,
        price_per_unit: match.price_per_unit,
      }))

      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyer_id: userId, // Use current user ID (falls back to demo ID)
          items,
          delivery_address: 'Market Area, Thane',
          delivery_lat: 19.033,
          delivery_lng: 73.0297,
          notes: 'Multi-supplier order from AI matching',
        }),
      })

      if (response.ok) {
        const order = await response.json()
        setOrderMessage(`Order created successfully! Order ID: ${order.id}\nTotal: ₹${order.total_amount.toLocaleString()}`)
        setOrderMessageType('success')
        onSelectCombination?.(combination)
      } else {
        const error = await response.json()
        setOrderMessage(`Failed to create order: ${error.error}`)
        setOrderMessageType('error')
      }
    } catch (error) {
      console.error('Order error:', error)
      setOrderMessage('Failed to create order. Please try again.')
      setOrderMessageType('error')
    } finally {
      setIsPlacingOrder(false)
    }
  }

  if (matches.length === 0) {
    return (
      <Alert type="warning">
        No matching suppliers found for your requirements. Try adjusting your search criteria.
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {orderMessage && (
        <Alert type={orderMessageType} onClose={() => setOrderMessage('')}>
          {orderMessage}
        </Alert>
      )}
      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>AI Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {recommendations.map((rec, index) => (
              <li key={index} className="flex items-start">
                <span className="text-accent mr-2">•</span>
                <span className="text-gray-700">{rec}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Optimal Combination */}
      {optimal_combination.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Optimal Supplier Combination</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Total Quantity</p>
                  <p className="text-2xl font-bold text-primary">{total_quantity} kg</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Cost</p>
                  <p className="text-2xl font-bold text-secondary">₹{total_cost.toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-3">
                {optimal_combination.map((match, index) => (
                  <div key={match.product_id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">{match.farmer_name}</p>
                        <p className="text-sm text-gray-600">{match.product_name} - {match.product_variety || 'Standard'}</p>
                      </div>
                      <Badge variant="success">
                        Score: {match.match_score}/100
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Quantity</p>
                        <p className="font-medium">{match.available_quantity} {match.unit}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Price</p>
                        <p className="font-medium">₹{match.price_per_unit}/{match.unit}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Distance</p>
                        <p className="font-medium">{Math.round(match.distance)} km</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs text-gray-500">{match.match_reasons[0]}</p>
                    </div>
                  </div>
                ))}
              </div>

              {onSelectCombination && (
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => handlePlaceOrder(optimal_combination)}
                  isLoading={isPlacingOrder}
                >
                  Place Order with Optimal Combination
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Matches */}
      <Card>
        <CardHeader>
          <CardTitle>All Matching Suppliers ({matches.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {matches.map((match) => (
              <MatchCard
                key={match.product_id}
                match={match}
                onSelect={() => onSelectSingle?.(match)}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function MatchCard({ match, onSelect }: { match: SupplierMatch; onSelect?: () => void }) {
  return (
    <div className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-lg">{match.farmer_name}</h3>
          <p className="text-sm text-gray-600">{match.product_name} - {match.product_variety || 'Standard'}</p>
        </div>
        <div className="text-right">
          <Badge variant={match.match_score >= 80 ? 'success' : match.match_score >= 60 ? 'warning' : 'default'}>
            {match.match_score}/100
          </Badge>
          <p className="text-xs text-gray-500 mt-1">Match Score</p>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="mb-3 p-3 bg-gray-50 rounded">
        <p className="text-xs font-medium text-gray-700 mb-2">Score Breakdown:</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-600">Quantity:</span>
            <span className="font-medium">{match.score_breakdown.quantity_match}/20</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Price:</span>
            <span className="font-medium">{match.score_breakdown.price_competitiveness}/20</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Distance:</span>
            <span className="font-medium">{match.score_breakdown.proximity}/20</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Quality:</span>
            <span className="font-medium">{match.score_breakdown.quality_match}/15</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Availability:</span>
            <span className="font-medium">{match.score_breakdown.availability}/15</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Reliability:</span>
            <span className="font-medium">{match.score_breakdown.farmer_reliability}/10</span>
          </div>
        </div>
      </div>

      {/* Match Reasons */}
      <div className="mb-3">
        <p className="text-xs font-medium text-gray-700 mb-1">Why this match:</p>
        <ul className="text-xs text-gray-600 space-y-1">
          {match.match_reasons.slice(0, 2).map((reason, index) => (
            <li key={index}>• {reason}</li>
          ))}
        </ul>
      </div>

      {/* Details */}
      <div className="grid grid-cols-4 gap-3 text-sm mb-3">
        <div>
          <p className="text-gray-600">Available</p>
          <p className="font-medium">{match.available_quantity} {match.unit}</p>
        </div>
        <div>
          <p className="text-gray-600">Price</p>
          <p className="font-medium">₹{match.price_per_unit}/{match.unit}</p>
        </div>
        <div>
          <p className="text-gray-600">Distance</p>
          <p className="font-medium">{Math.round(match.distance)} km</p>
        </div>
        <div>
          <p className="text-gray-600">Quality</p>
          <p className="font-medium">Grade {match.quality_grade}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Badge variant={match.can_fulfill ? 'success' : 'warning'}>
            {match.can_fulfill ? 'Can fulfill alone' : 'Partial fulfillment'}
          </Badge>
          <span className="text-xs text-gray-500">
            Total: ₹{match.total_cost.toLocaleString()}
          </span>
        </div>
        {onSelect && (
          <Button variant="primary" size="sm" onClick={onSelect}>
            Select
          </Button>
        )}
      </div>
    </div>
  )
}