import { NextRequest, NextResponse } from 'next/server'

interface RawLocation {
  lat?: unknown
  lng?: unknown
  address?: string
  location?: {
    lat?: unknown
    lng?: unknown
    address?: string
  }
}

function extractCoordinates(raw: unknown): GeoLocation | null {
  if (!raw || typeof raw !== 'object') return null
  const item = raw as RawLocation

  let lat: unknown
  let lng: unknown
  let address: string | undefined

  if (item.location && typeof item.location === 'object') {
    lat = item.location.lat
    lng = item.location.lng
    address = item.location.address || item.address
  } else {
    lat = item.lat
    lng = item.lng
    address = item.address
  }

  const numLat = typeof lat === 'number' ? lat : typeof lat === 'string' ? parseFloat(lat) : NaN
  const numLng = typeof lng === 'number' ? lng : typeof lng === 'string' ? parseFloat(lng) : NaN

  if (isNaN(numLat) || isNaN(numLng) || numLat < -90 || numLat > 90 || numLng < -180 || numLng > 180) {
    return null
  }

  return { lat: numLat, lng: numLng, address }
}

export async function POST(request: NextRequest) {
  try {
    let body: Record<string, unknown>
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      )
    }

    const { pickup_locations, delivery_location } = body

    // Validate input presence
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

    // Normalize and validate delivery_location
    const normalizedDeliveryLoc = extractCoordinates(delivery_location)
    if (!normalizedDeliveryLoc) {
      return NextResponse.json(
        { error: 'delivery_location must contain valid lat and lng coordinates' },
        { status: 400 }
      )
    }

    const deliveryObj = delivery_location as Record<string, unknown>
    const normalizedDelivery: DeliveryLocation = {
      buyer_id: typeof deliveryObj.buyer_id === 'string' ? deliveryObj.buyer_id : undefined,
      buyer_name: typeof deliveryObj.buyer_name === 'string' ? deliveryObj.buyer_name : undefined,
      location: normalizedDeliveryLoc,
      address: normalizedDeliveryLoc.address || (typeof deliveryObj.address === 'string' ? deliveryObj.address : undefined),
    }

    // Normalize and validate pickup_locations
    const normalizedPickups: PickupLocation[] = []
    for (let i = 0; i < pickup_locations.length; i++) {
      const p = pickup_locations[i]
      const loc = extractCoordinates(p)
      if (!loc) {
        return NextResponse.json(
          { error: `pickup_locations[${i}] must contain valid lat and lng coordinates` },
          { status: 400 }
        )
      }
      const pObj = p as Record<string, unknown>
      normalizedPickups.push({
        farmer_id: typeof pObj.farmer_id === 'string' ? pObj.farmer_id : undefined,
        farmer_name: typeof pObj.farmer_name === 'string' ? pObj.farmer_name : undefined,
        location: loc,
        address: loc.address || (typeof pObj.address === 'string' ? pObj.address : undefined),
        quantity: typeof pObj.quantity === 'number' ? pObj.quantity : Number(pObj.quantity) || 0,
      })
    }

    // Try to call Python service
    try {
      const pythonServiceUrl = process.env.ROUTE_OPTIMIZATION_SERVICE_URL || 'http://localhost:8002'
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 second timeout
      
      const response = await fetch(`${pythonServiceUrl}/optimize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pickup_locations: normalizedPickups,
          delivery_location: normalizedDelivery,
        }),
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
    const demoRoute = generateDemoRoute(normalizedPickups, normalizedDelivery)
    return NextResponse.json(demoRoute)
  } catch (error: unknown) {
    console.error('Route optimization error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to optimize route' },
      { status: 500 }
    )
  }
}

interface GeoLocation {
  lat: number
  lng: number
  address?: string
}

interface PickupLocation {
  farmer_id?: string
  farmer_name?: string
  location: GeoLocation
  address?: string
  quantity?: number
}

interface DeliveryLocation {
  buyer_id?: string
  buyer_name?: string
  location: GeoLocation
  address?: string
}

interface RouteStop {
  order: number
  type: 'pickup' | 'delivery'
  farmer_id?: string
  farmer_name?: string
  buyer_id?: string
  buyer_name?: string
  location: GeoLocation
  address?: string
  quantity?: number
  status?: string
  estimated_arrival?: string
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

function calculateRouteDistance(stops: RouteStop[]): number {
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

function nearestNeighborAlgorithm(pickups: PickupLocation[], delivery: DeliveryLocation): RouteStop[] {
  if (!pickups.length) return []
  
  let currentLocation = delivery.location
  const remainingPickups = [...pickups]
  const route: RouteStop[] = []
  
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
      address: pickup.location.address || pickup.address,
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
    address: delivery.location.address || delivery.address,
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

function generateDemoRoute(pickup_locations: PickupLocation[], delivery_location: DeliveryLocation) {
  const totalQuantity = pickup_locations.reduce((sum: number, p: PickupLocation) => sum + (p.quantity || 0), 0)
  
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
  const currentTime = now.getTime()
  
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