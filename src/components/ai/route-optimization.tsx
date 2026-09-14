'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button, Alert, LoadingSpinner, Badge, Input } from '../ui'

interface RouteOptimizationProps {
  showFullUI?: boolean
  onOrderPlacement?: (routeData: any) => void
}

export function RouteOptimization({ showFullUI = true, onOrderPlacement }: RouteOptimizationProps) {
  const [pickupLocations, setPickupLocations] = useState<any[]>([])
  const [deliveryLocation, setDeliveryLocation] = useState({
    buyer_id: 'buyer1',
    buyer_name: 'Buyer',
    location: { lat: 19.0330, lng: 73.0297 },
    address: 'Market Area, Thane'
  })
  const [vehicleCapacity, setVehicleCapacity] = useState(1000)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<any>(null)

  // Demo pickup locations (matching the tomato scenario)
  const demoPickupLocations = [
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
    },
  ]

  const handleLoadDemoData = () => {
    setPickupLocations(demoPickupLocations)
  }

  const handleOptimize = async () => {
    if (pickupLocations.length === 0) {
      setError('Please add pickup locations first')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/ai/route-optimization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pickup_locations: pickupLocations,
          delivery_location: deliveryLocation,
          vehicle_capacity: vehicleCapacity,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Route optimization failed')
      }

      const data = await response.json()
      setResult(data)
    } catch (err: any) {
      setError(err.message || 'Failed to optimize route')
    } finally {
      setLoading(false)
    }
  }

  const handlePlaceOrder = () => {
    if (result && onOrderPlacement) {
      onOrderPlacement(result)
    }
  }

  return (
    <div className="space-y-6">
      {/* Route Optimization Form */}
      <Card>
        <CardHeader>
          <CardTitle>AI Route Optimization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Demo Data Button */}
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Add pickup locations (farmers) to optimize delivery route
              </p>
              <Button variant="outline" size="sm" onClick={handleLoadDemoData}>
                🍅 Load Demo Data (800kg Tomatoes)
              </Button>
            </div>

            {/* Pickup Locations List */}
            {pickupLocations.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Pickup Locations:</p>
                {pickupLocations.map((pickup, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">{pickup.farmer_name}</p>
                      <p className="text-sm text-gray-600">{pickup.quantity} kg • {pickup.address}</p>
                    </div>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setPickupLocations(pickupLocations.filter((_, i) => i !== index))}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Vehicle Capacity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Capacity (kg)
              </label>
              <input
                type="number"
                value={vehicleCapacity}
                onChange={(e: any) => setVehicleCapacity(parseInt(e.target.value) || 1000)}
                min={100}
                max={10000}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-foreground"
              />
            </div>

            <Button
              variant="primary"
              className="w-full"
              onClick={handleOptimize}
              isLoading={loading}
              disabled={pickupLocations.length === 0}
            >
              Optimize Route
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
          {/* Optimized Route */}
          <Card>
            <CardHeader>
              <CardTitle>Optimized Delivery Route</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Total Distance</p>
                    <p className="text-2xl font-bold text-primary">
                      {result.optimized_route.total_distance} km
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Estimated Time</p>
                    <p className="text-2xl font-bold text-secondary">
                      {result.optimized_route.estimated_duration} min
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Stops</p>
                    <p className="text-2xl font-bold text-accent">
                      {result.optimized_route.stops.length}
                    </p>
                  </div>
                </div>

                {/* Visual Route Diagram */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-4">Route Visualization:</p>
                  <div className="flex items-center justify-between">
                    {result.optimized_route.stops.map((stop: any, index: number) => (
                      <div key={index} className="flex flex-col items-center">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                            stop.type === 'pickup' ? 'bg-primary' : 'bg-green-600'
                          }`}
                        >
                          {stop.order}
                        </div>
                        <p className="text-xs text-gray-600 mt-2 text-center w-20">
                          {stop.type === 'pickup' ? stop.farmer_name.split(' ')[0] : 'Delivery'}
                        </p>
                        {index < result.optimized_route.stops.length - 1 && (
                          <div className="h-8 w-1 bg-gray-400 mx-auto"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Route Stops */}
                <div className="space-y-3 mt-4">
                  <p className="text-sm font-medium text-gray-700">Route Stops:</p>
                  {result.optimized_route.stops.map((stop: any, index: number) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded">
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mr-3">
                        {stop.order}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">
                          {stop.type === 'pickup' ? `📍 Pickup: ${stop.farmer_name}` : `🏁 Delivery: ${stop.buyer_name}`}
                        </p>
                        <p className="text-sm text-gray-600">
                          {stop.address} • {stop.quantity ? `${stop.quantity} kg` : ''}
                        </p>
                        {stop.estimated_arrival && (
                          <p className="text-xs text-gray-500">
                            ETA: {new Date(stop.estimated_arrival).toLocaleString()}
                          </p>
                        )}
                      </div>
                      <Badge variant={stop.type === 'pickup' ? 'info' : 'success'}>
                        {stop.type}
                      </Badge>
                    </div>
                  ))}
                </div>

                {onOrderPlacement && (
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={handlePlaceOrder}
                  >
                    Place Order with Optimized Route
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Cost Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Cost Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">Optimized Cost</p>
                    <p className="text-2xl font-bold text-green-600">
                      ₹{result.cost_analysis.optimized_cost.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <p className="text-sm text-gray-600">Direct Cost</p>
                    <p className="text-2xl font-bold text-red-600">
                      ₹{result.cost_analysis.direct_cost.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Savings</p>
                      <p className="text-3xl font-bold text-blue-600">
                        ₹{result.cost_analysis.savings.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Savings %</p>
                      <p className="text-3xl font-bold text-blue-600">
                        {result.cost_analysis.savings_percentage}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  <p><strong>Route Information:</strong></p>
                  <p>Total Quantity: {result.route_data.total_quantity} kg</p>
                  <p>Number of Pickups: {result.route_data.num_pickups}</p>
                  <p>Algorithm: {result.route_data.optimization_algorithm}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Route Data Info */}
          {result.route_data.demo_mode && (
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <CardTitle>Algorithmic Intelligence</CardTitle>
                  <Badge variant="info" className="ml-2">Demo Mode</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">
                  <p>ℹ️ This uses the Haversine formula for distance calculation and nearest-neighbor algorithm for route optimization (rule-based algorithms, not machine learning).</p>
                  <p className="mt-2">{result.route_data.note}</p>
                  <p className="mt-2">For production, integrate with real routing APIs like OSRM or Google Maps Directions API for accurate routing and real-time traffic data.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}