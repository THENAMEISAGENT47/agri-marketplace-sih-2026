// Matching Engine Scoring System
// This will be enhanced with AI/ML services later

export interface MatchingCriteria {
  product_name: string
  required_quantity: number
  max_price?: number
  buyer_location: {
    lat: number
    lng: number
  }
  availability_date?: string
  quality_preference?: 'A' | 'B' | 'C' | 'any'
  max_distance?: number // in km
}

export interface ScoreBreakdown {
  quantity_match: number
  price_competitiveness: number
  proximity: number
  quality_match: number
  availability: number
  farmer_reliability: number
}

export interface SupplierCandidate {
  farmer_id: string
  farmer_name: string
  location_lat: number
  location_lng: number
  farmer_rating?: number
  product_id: string
  product_name: string
  variety?: string
  available_quantity: number
  unit: string
  price_per_unit: number
  quality_grade: string
  harvest_date: string
  availability_date: string
  is_available: boolean
}

export interface SupplierMatch {
  farmer_id: string
  farmer_name: string
  farmer_location: {
    lat: number
    lng: number
  }
  farmer_rating: number
  product_id: string
  product_name: string
  product_variety?: string
  available_quantity: number
  unit: string
  price_per_unit: number
  quality_grade: string
  harvest_date: string
  availability_date: string
  distance: number // in km
  match_score: number // 0-100
  score_breakdown: ScoreBreakdown
  match_reasons: string[]
  total_cost: number
  can_fulfill: boolean
}

export interface MatchingResult {
  criteria: MatchingCriteria
  matches: SupplierMatch[]
  optimal_combination: SupplierMatch[]
  total_cost: number
  total_quantity: number
  recommendations: string[]
}

// Haversine formula for distance calculation
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// Calculate match score for a single supplier
function calculateMatchScore(
  supplier: SupplierCandidate,
  criteria: MatchingCriteria
): { score: number; breakdown: ScoreBreakdown; reasons: string[] } {
  const breakdown = {
    quantity_match: 0,
    price_competitiveness: 0,
    proximity: 0,
    quality_match: 0,
    availability: 0,
    farmer_reliability: 0,
  }
  const reasons: string[] = []

  // 1. Quantity Match (0-20 points)
  const quantityRatio = supplier.available_quantity / criteria.required_quantity
  if (quantityRatio >= 1) {
    breakdown.quantity_match = 20
    reasons.push(`Can fulfill ${Math.round(quantityRatio * 100)}% of required quantity`)
  } else if (quantityRatio >= 0.5) {
    breakdown.quantity_match = 15
    reasons.push(`Can fulfill ${Math.round(quantityRatio * 100)}% of required quantity`)
  } else {
    breakdown.quantity_match = 5
    reasons.push(`Limited quantity available (${Math.round(quantityRatio * 100)}% of requirement)`)
  }

  // 2. Price Competitiveness (0-20 points)
  if (criteria.max_price) {
    const priceRatio = criteria.max_price / supplier.price_per_unit
    if (priceRatio >= 1.2) {
      breakdown.price_competitiveness = 20
      reasons.push(`Excellent price - ${Math.round((1 - supplier.price_per_unit / criteria.max_price) * 100)}% below max`)
    } else if (priceRatio >= 1) {
      breakdown.price_competitiveness = 15
      reasons.push(`Good price - within budget`)
    } else {
      breakdown.price_competitiveness = 5
      reasons.push(`Price above maximum limit`)
    }
  } else {
    // No max price, give average score
    breakdown.price_competitiveness = 15
    reasons.push(`Competitive market price`)
  }

  // 3. Proximity (0-20 points)
  const distance = calculateDistance(
    criteria.buyer_location.lat,
    criteria.buyer_location.lng,
    supplier.location_lat,
    supplier.location_lng
  )
  
  if (criteria.max_distance && distance > criteria.max_distance) {
    breakdown.proximity = 0
    reasons.push(`Outside preferred distance range (${Math.round(distance)}km)`)
  } else if (distance <= 20) {
    breakdown.proximity = 20
    reasons.push(`Very close - ${Math.round(distance)}km away`)
  } else if (distance <= 50) {
    breakdown.proximity = 15
    reasons.push(`Nearby - ${Math.round(distance)}km away`)
  } else if (distance <= 100) {
    breakdown.proximity = 10
    reasons.push(`Moderate distance - ${Math.round(distance)}km away`)
  } else {
    breakdown.proximity = 5
    reasons.push(`Distant - ${Math.round(distance)}km away`)
  }

  // 4. Quality Match (0-15 points)
  const qualityScores: Record<string, number> = { 'A': 15, 'B': 10, 'C': 5 }
  if (criteria.quality_preference === 'any') {
    breakdown.quality_match = qualityScores[supplier.quality_grade] || 10
    reasons.push(`Grade ${supplier.quality_grade} quality`)
  } else if (supplier.quality_grade === criteria.quality_preference) {
    breakdown.quality_match = 15
    reasons.push(`Exact quality match - Grade ${supplier.quality_grade}`)
  } else if (
    (criteria.quality_preference === 'A' && supplier.quality_grade === 'B') ||
    (criteria.quality_preference === 'B' && supplier.quality_grade === 'C')
  ) {
    breakdown.quality_match = 10
    reasons.push(`Close quality match - Grade ${supplier.quality_grade}`)
  } else {
    breakdown.quality_match = 5
    reasons.push(`Acceptable quality - Grade ${supplier.quality_grade}`)
  }

  // 5. Availability (0-15 points)
  const availabilityDate = new Date(supplier.availability_date)
  const requestedDate = criteria.availability_date ? new Date(criteria.availability_date) : new Date()
  const daysDiff = Math.ceil((availabilityDate.getTime() - requestedDate.getTime()) / (1000 * 60 * 60 * 24))
  
  if (daysDiff <= 0) {
    breakdown.availability = 15
    reasons.push(`Available immediately or before requested date`)
  } else if (daysDiff <= 3) {
    breakdown.availability = 12
    reasons.push(`Available within 3 days`)
  } else if (daysDiff <= 7) {
    breakdown.availability = 8
    reasons.push(`Available within a week`)
  } else {
    breakdown.availability = 4
    reasons.push(`Available in ${daysDiff} days`)
  }

  // 6. Farmer Reliability (0-10 points)
  const farmerRating = supplier.farmer_rating ?? 4.5
  const ratingScore = (farmerRating / 5) * 10
  breakdown.farmer_reliability = ratingScore
  if (farmerRating >= 4.5) {
    reasons.push(`Highly rated farmer (${farmerRating}/5)`)
  } else if (farmerRating >= 4.0) {
    reasons.push(`Well-rated farmer (${farmerRating}/5)`)
  } else {
    reasons.push(`Farmer rating: ${farmerRating}/5`)
  }

  // Calculate total score
  const totalScore = Object.values(breakdown).reduce((sum, val) => sum + val, 0)

  return {
    score: totalScore,
    breakdown,
    reasons,
  }
}

// Find optimal combination of suppliers to fulfill requirement
function findOptimalCombination(
  matches: SupplierMatch[],
  requiredQuantity: number
): SupplierMatch[] {
  // Sort by match score (descending)
  const sortedMatches = [...matches].sort((a, b) => b.match_score - a.match_score)
  
  const combination: SupplierMatch[] = []
  let remainingQuantity = requiredQuantity

  for (const match of sortedMatches) {
    if (remainingQuantity <= 0) break
    
    if (match.available_quantity >= remainingQuantity) {
      // This supplier can fulfill the remaining requirement
      combination.push({
        ...match,
        available_quantity: remainingQuantity,
        total_cost: remainingQuantity * match.price_per_unit,
      })
      remainingQuantity = 0
    } else {
      // Take all this supplier has
      combination.push(match)
      remainingQuantity -= match.available_quantity
    }
  }

  return combination
}

// Main matching function
export function findMatchingSuppliers(
  suppliers: SupplierCandidate[],
  criteria: MatchingCriteria
): MatchingResult {
  // Filter suppliers by product name and availability
  const eligibleSuppliers = suppliers.filter(supplier => {
    const nameMatch = supplier.product_name.toLowerCase() === criteria.product_name.toLowerCase()
    const available = supplier.is_available
    const quantityMatch = supplier.available_quantity > 0
    
    // Filter by max distance if specified
    let distanceMatch = true
    if (criteria.max_distance) {
      const distance = calculateDistance(
        criteria.buyer_location.lat,
        criteria.buyer_location.lng,
        supplier.location_lat,
        supplier.location_lng
      )
      distanceMatch = distance <= criteria.max_distance
    }

    // Filter by max price if specified
    let priceMatch = true
    if (criteria.max_price) {
      priceMatch = supplier.price_per_unit <= criteria.max_price
    }

    // Filter by quality preference
    let qualityMatch = true
    if (criteria.quality_preference && criteria.quality_preference !== 'any') {
      qualityMatch = supplier.quality_grade === criteria.quality_preference
    }

    return nameMatch && available && quantityMatch && distanceMatch && priceMatch && qualityMatch
  })

  // Calculate match scores for each eligible supplier
  const matches: SupplierMatch[] = eligibleSuppliers.map(supplier => {
    const distance = calculateDistance(
      criteria.buyer_location.lat,
      criteria.buyer_location.lng,
      supplier.location_lat,
      supplier.location_lng
    )
    
    const { score, breakdown, reasons } = calculateMatchScore(supplier, criteria)

    return {
      farmer_id: supplier.farmer_id,
      farmer_name: supplier.farmer_name,
      farmer_location: {
        lat: supplier.location_lat,
        lng: supplier.location_lng,
      },
      farmer_rating: supplier.farmer_rating ?? 4.5,
      product_id: supplier.product_id,
      product_name: supplier.product_name,
      product_variety: supplier.variety,
      available_quantity: supplier.available_quantity,
      unit: supplier.unit,
      price_per_unit: supplier.price_per_unit,
      quality_grade: supplier.quality_grade,
      harvest_date: supplier.harvest_date,
      availability_date: supplier.availability_date,
      distance,
      match_score: score,
      score_breakdown: breakdown,
      match_reasons: reasons,
      total_cost: supplier.available_quantity * supplier.price_per_unit,
      can_fulfill: supplier.available_quantity >= criteria.required_quantity,
    }
  })

  // Sort by match score (descending)
  matches.sort((a, b) => b.match_score - a.match_score)

  // Find optimal combination
  const optimalCombination = findOptimalCombination(matches, criteria.required_quantity)

  // Calculate totals
  const totalCost = optimalCombination.reduce((sum, match) => sum + match.total_cost, 0)
  const totalQuantity = optimalCombination.reduce((sum, match) => sum + match.available_quantity, 0)

  // Generate recommendations
  const recommendations: string[] = []
  
  if (matches.length === 0) {
    recommendations.push('No matching suppliers found. Try adjusting your criteria.')
  } else if (optimalCombination.length === 1) {
    recommendations.push(`Best match: ${optimalCombination[0].farmer_name} with score ${optimalCombination[0].match_score}/100`)
  } else {
    recommendations.push(`Best combination: ${optimalCombination.length} suppliers to fulfill ${criteria.required_quantity} ${matches[0]?.unit || 'units'}`)
    recommendations.push(`Total cost: ₹${totalCost.toLocaleString()} for ${totalQuantity} ${matches[0]?.unit || 'units'}`)
  }

  if (matches.length > 0) {
    const topMatch = matches[0]
    recommendations.push(`Top supplier ${topMatch.farmer_name} offers ${topMatch.product_variety || 'standard'} variety at ₹${topMatch.price_per_unit}/${topMatch.unit}`)
  }

  return {
    criteria,
    matches,
    optimal_combination: optimalCombination,
    total_cost: totalCost,
    total_quantity: totalQuantity,
    recommendations,
  }
}