import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { product_name, forecast_days = 7 } = body

    // Validate input
    if (!product_name) {
      return NextResponse.json(
        { error: 'product_name is required' },
        { status: 400 }
      )
    }

    // Try to call Python service
    try {
      const pythonServiceUrl = process.env.DEMAND_FORECASTING_SERVICE_URL || 'http://localhost:8001'
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 second timeout
      
      const response = await fetch(`${pythonServiceUrl}/forecast`, {
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
    const demoForecast = generateDemoForecast(product_name, forecast_days)
    return NextResponse.json(demoForecast)
  } catch (error: unknown) {
    console.error('Demand forecast error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate demand forecast' },
      { status: 500 }
    )
  }
}

function generateDemoForecast(product_name: string, forecast_days: number) {
  // Demo data for SIH demonstration
  const demoData: Record<string, { base: number; trend: number; volatility: number }> = {
    'Tomatoes': { base: 5000, trend: 0.02, volatility: 0.1 },
    'Onions': { base: 3800, trend: 0.01, volatility: 0.15 },
    'Potatoes': { base: 5200, trend: 0.015, volatility: 0.08 },
    'Carrots': { base: 2800, trend: 0.025, volatility: 0.12 },
    'Cabbage': { base: 3200, trend: 0.01, volatility: 0.1 },
  }

  const data = demoData[product_name] || { base: 3000, trend: 0.01, volatility: 0.1 }
  const today = new Date()
  
  const predicted_demand = []
  const forecast_dates = []
  
  for (let i = 1; i <= forecast_days; i++) {
    const forecastDate = new Date(today)
    forecastDate.setDate(today.getDate() + i)
    
    // Simple trend + random variation
    const trendFactor = 1 + data.trend * (i / 30)
    const randomVariation = 0.9 + Math.random() * 0.2 // 0.9 to 1.1
    const demand = data.base * trendFactor * randomVariation
    
    predicted_demand.push(Math.round(demand))
    forecast_dates.push(forecastDate.toISOString().split('T')[0])
  }

  // Determine trend
  const avgFirstHalf = predicted_demand.slice(0, Math.floor(forecast_days / 2)).reduce((a, b) => a + b, 0) / Math.floor(forecast_days / 2)
  const avgSecondHalf = predicted_demand.slice(Math.floor(forecast_days / 2)).reduce((a, b) => a + b, 0) / (forecast_days - Math.floor(forecast_days / 2))
  
  let trend = 'stable'
  if (avgSecondHalf > avgFirstHalf * 1.05) trend = 'increasing'
  else if (avgSecondHalf < avgFirstHalf * 0.95) trend = 'decreasing'

  const recommendations = []
  if (trend === 'increasing') {
    recommendations.push(`Expected increase in ${product_name} demand over next ${forecast_days} days`)
    recommendations.push('Consider increasing production or inventory')
  } else if (trend === 'decreasing') {
    recommendations.push(`Expected decrease in ${product_name} demand over next ${forecast_days} days`)
    recommendations.push('Consider reducing production or finding alternative markets')
  } else {
    recommendations.push(`Stable ${product_name} demand expected over next ${forecast_days} days`)
  }

  return {
    current_demand: Math.round(data.base),
    predicted_demand,
    trend,
    confidence_level: 85,
    recommendations,
    forecast_dates,
    model_info: {
      model_type: 'demo_fallback',
      version: '1.0.0',
      demo_mode: true,
      note: 'Using demo algorithm. Python service not available.'
    }
  }
}