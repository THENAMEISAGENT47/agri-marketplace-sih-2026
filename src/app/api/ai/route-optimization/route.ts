import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { pickup_locations, delivery_location, vehicle_capacity = 1000 } = body

    // Validate input
    if (!pickup_locations || !Array.isArray(pickup_locations) || pickup_locations.length === 0) {
      return NextResponse.json(
        { error: 'pickup_locations is required and must be a non-empty array' },
        { status: 400 }
      )
    }

    if (!delivery_location) {
      return NextResponse.json(
        { error: 'delivery_location is required' },
        { status: 400 }
      )
    }

    // Try to call Python service
    try {
      const pythonServiceUrl = process.env.ROUTE_OPTIMIZATION_SERVICE_URL || 'http://localhost:8002'
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 second timeout
      
      const response = await fetch(`${pythonServiceUrl}/optimize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      })
      
      clearTimeout(timeoutId)

      if (response.ok) {
        const data = await response.json()
        return NextResponse.json(data)
      }
    } catch (serviceError) {
      console.log('Python service not available, using demo fallback:', serviceError)
    }

    // Demo fallback for SIH demonstration
    const demoRoute = generateDemoRoute(pickup_locations, delivery_location, vehicle_capacity)
    return NextResponse.json(demoRoute)
  } catch (error: any) {
    console.error('Route optimization error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to optimize route' },
      { status: 500 }
    )
  }
}

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function calculateRouteDistance(stops: any[]): number {
  if (stops.length < 2) return 0
  
  let totalDistance = 0
  for (let i = 0; i < stops.length - 1; i++) {
    totalDistance += haversineDistance(
      stops[i].location.lat,
      stops[i].location.lng,
      stops[i + 1].location.lat,
      stops[i + 1].location.lng
    )
  }
  return totalDistance
}

function nearestNeighborAlgorithm(pickups: any[], delivery: any): any[] {
  if (!pickups.length) return []
  
  let currentLocation = delivery.location
  const remainingPickups = [...pickups]
  const route = []
  
  while (remainingPickups.length > 0) {
    let nearestIndex = 0
    let nearestDistance = Infinity
    
    for (let i = 0; i < remainingPickups.length; i++) {
      const distance = haversineDistance(
        currentLocation.lat,
        currentLocation.lng,
        remainingPickups[i].location.lat,
        remainingPickups[i].location.lng
      )
      if (distance < nearestDistance) {
        nearestDistance = distance
        nearestIndex = i
      }
    }
    
    const pickup = remainingPickups.splice(nearestIndex, 1)[0]
    route.push({
      order: route.length + 1,
      type: 'pickup',
      farmer_id: pickup.farmer_id,
      farmer_name: pickup.farmer_name,
      location: pickup.location,
      address: pickup.location.address,
      quantity: pickup.quantity,
      status: 'pending'
    })
    
    currentLocation = pickup.location
  }
  
  // Add delivery as last stop
  route.push({
    order: route.length + 1,
    type: 'delivery',
    buyer_id: delivery.buyer_id,
    buyer_name: delivery.buyer_name,
    location: delivery.location,
    address: delivery.location.address,
    status: 'pending'
  })
  
  return route
}

function calculateCost(distance: number, totalQuantity: number): number {
  const baseCost = 500
  const distanceCost = distance * 30
  const quantityCost = totalQuantity * 2
  return Math.round(baseCost + distanceCost + quantityCost)
}

function generateDemoRoute(pickup_locations: any[], delivery_location: any, vehicle_capacity: number) {
  const totalQuantity = pickup_locations.reduce((sum: number, p: any) => sum + (p.quantity || 0), 0)
  
  // Generate optimized route
  const optimizedStops = nearestNeighborAlgorithm(pickup_locations, delivery_location)
  const optimizedDistance = calculateRouteDistance(optimizedStops)
  const optimizedDuration = Math.round(optimizedDistance * 1.5) // Assume 40 km/h avg speed
  const optimizedCost = calculateCost(optimizedDistance, totalQuantity)
  
  // Calculate direct route (for comparison)
  let directDistance = 0
  const directStops = []
  
  pickup_locations.forEach((pickup, index) => {
    directStops.push({
      order: directStops.length + 1,
      type: 'pickup',
      farmer_id: pickup.farmer_id,
      farmer_name: pickup.farmer_name,
      location: pickup.location,
      quantity: pickup.quantity
    })
    directStops.push({
      order: directStops.length + 1,
      type: 'delivery',
      buyer_id: delivery_location.buyer_id,
      buyer_name: delivery_location.buyer_name,
      location: delivery_location.location
    })
    
    if (index < pickup_locations.length - 1) {
      directDistance += haversineDistance(
        pickup.location.lat,
        pickup.location.lng,
        delivery_location.location.lat,
        delivery_location.location.lng
      )
      directDistance += haversineDistance(
        delivery_location.location.lat,
        delivery_location.location.lng,
        pickup_locations[index + 1].location.lat,
        pickup_locations[index + 1].location.lng
      )
    }
  })
  
  const directCost = calculateCost(directDistance, totalQuantity)
  const savings = directCost - optimizedCost
  const savingsPercentage = (savings / directCost) * 100
  
  // Add estimated arrival times
  const now = new Date()
  let currentTime = now.getTime()
  
  optimizedStops.forEach((stop, index) => {
    const arrivalTime = new Date(currentTime + (optimizedDuration * 60 * 1000 * (index + 1) / optimizedStops.length))
    stop.estimated_arrival = arrivalTime.toISOString()
  })
  
  return {
    optimized_route: {
      total_distance: Math.round(optimizedDistance * 100) / 100,
      estimated_duration: optimizedDuration,
      stops: optimizedStops,
      route_geometry: null
    },
    cost_analysis: {
      optimized_cost: optimizedCost,
      direct_cost: directCost,
      savings: Math.round(savings * 100) / 100,
      savings_percentage: Math.round(savingsPercentage * 100) / 100
    },
    route_data: {
      total_quantity: totalQuantity,
      num_pickups: pickup_locations.length,
      optimization_algorithm: 'nearest_neighbor',
      demo_mode: true,
      note: 'Using demo algorithm. Python service not available.'
    }
  }
}