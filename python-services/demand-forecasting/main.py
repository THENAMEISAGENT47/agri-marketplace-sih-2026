from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta

try:
    import numpy as np
    has_numpy = True
except ImportError:
    # Fallback for demo without numpy
    import random
    has_numpy = False

app = FastAPI(title="Demand Forecasting Service", version="1.0.0")

# Enable CORS for Next.js integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class ForecastRequest(BaseModel):
    product_name: str
    region: Optional[str] = "all"
    forecast_days: int = 30
    historical_days: int = 90

class ForecastResponse(BaseModel):
    current_demand: float
    predicted_demand: List[float]
    trend: str
    confidence_level: float
    recommendations: List[str]
    forecast_dates: List[str]
    model_info: dict

class ProductDemand(BaseModel):
    product_name: str
    date: str
    quantity: float
    region: Optional[str] = None

# Demo data for SIH demonstration
DEMO_DEMAND_DATA = {
    "Tomatoes": {
        "base_demand": 5000,
        "seasonality": [1.0, 1.05, 1.1, 1.15, 1.2, 1.15, 1.1, 1.05, 1.0, 0.95, 0.9, 0.85],
        "trend": 0.02,  # 2% growth per period
        "volatility": 0.1,
    },
    "Onions": {
        "base_demand": 3800,
        "seasonality": [0.9, 0.95, 1.0, 1.05, 1.1, 1.05, 1.0, 0.95, 0.9, 0.85, 0.9, 0.95],
        "trend": 0.01,
        "volatility": 0.15,
    },
    "Potatoes": {
        "base_demand": 5200,
        "seasonality": [0.95, 1.0, 1.05, 1.1, 1.15, 1.1, 1.05, 1.0, 0.95, 0.9, 0.95, 1.0],
        "trend": 0.015,
        "volatility": 0.08,
    },
    "Carrots": {
        "base_demand": 2800,
        "seasonality": [0.85, 0.9, 0.95, 1.0, 1.05, 1.0, 0.95, 0.9, 0.85, 0.8, 0.85, 0.9],
        "trend": 0.025,
        "volatility": 0.12,
    },
    "Cabbage": {
        "base_demand": 3200,
        "seasonality": [0.9, 0.95, 1.0, 1.05, 1.1, 1.05, 1.0, 0.95, 0.9, 0.85, 0.9, 0.95],
        "trend": 0.01,
        "volatility": 0.1,
    },
}

def generate_forecast(product_name: str, forecast_days: int, region: str = "all") -> dict:
    """
    Generate demand forecast using demo algorithm.
    This simulates ML model output for SIH demonstration.
    """
    if product_name not in DEMO_DEMAND_DATA:
        # Default values for unknown products
        base_demand = 3000
        seasonality = [1.0] * 12
        trend = 0.01
        volatility = 0.1
    else:
        data = DEMO_DEMAND_DATA[product_name]
        base_demand = data["base_demand"]
        seasonality = data["seasonality"]
        trend = data["trend"]
        volatility = data["volatility"]

    # Generate forecast
    today = datetime.now()
    predicted_demand = []
    forecast_dates = []
    
    current_demand = base_demand * seasonality[today.month % 12] * (1 + trend * (today.day / 30))
    
    for i in range(forecast_days):
        forecast_date = today + timedelta(days=i + 1)
        month_index = forecast_date.month % 12
        
        # Apply seasonality, trend, and random variation
        seasonal_factor = seasonality[month_index]
        trend_factor = 1 + trend * (i / 30)  # Linear trend
        
        if has_numpy:
            random_variation = np.random.normal(1, volatility)
        else:
            random_variation = random.gauss(1, volatility)
        
        demand = base_demand * seasonal_factor * trend_factor * random_variation
        predicted_demand.append(max(0, round(demand, 2)))
        forecast_dates.append(forecast_date.strftime("%Y-%m-%d"))

    # Determine trend direction
    avg_first_half = sum(predicted_demand[:forecast_days // 2]) / (forecast_days // 2)
    avg_second_half = sum(predicted_demand[forecast_days // 2:]) / (forecast_days - forecast_days // 2)
    
    if avg_second_half > avg_first_half * 1.05:
        trend_direction = "increasing"
    elif avg_second_half < avg_first_half * 0.95:
        trend_direction = "decreasing"
    else:
        trend_direction = "stable"

    # Calculate confidence level (based on volatility and forecast horizon)
    confidence = max(60, 95 - (volatility * 100) - (forecast_days * 0.5))

    # Generate recommendations
    recommendations = []
    if trend_direction == "increasing":
        recommendations.append(f"Expected increase in {product_name} demand over next {forecast_days} days")
        recommendations.append("Consider increasing production or inventory")
        if confidence > 80:
            recommendations.append("High confidence in upward trend")
    elif trend_direction == "decreasing":
        recommendations.append(f"Expected decrease in {product_name} demand over next {forecast_days} days")
        recommendations.append("Consider reducing production or finding alternative markets")
    else:
        recommendations.append(f"Stable {product_name} demand expected over next {forecast_days} days")
        recommendations.append("Maintain current production levels")

    # Add region-specific recommendations
    if region != "all":
        recommendations.append(f"Regional forecast for {region}")

    return {
        "current_demand": round(current_demand, 2),
        "predicted_demand": predicted_demand,
        "trend": trend_direction,
        "confidence_level": round(confidence, 2),
        "recommendations": recommendations,
        "forecast_dates": forecast_dates,
    }

@app.get("/")
async def root():
    return {
        "service": "Demand Forecasting API",
        "version": "1.0.0",
        "status": "running",
        "demo_mode": True,
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/forecast", response_model=ForecastResponse)
async def get_forecast(request: ForecastRequest):
    """
    Generate demand forecast for a product.
    
    Args:
        request: ForecastRequest with product_name, region, forecast_days, historical_days
    
    Returns:
        ForecastResponse with demand predictions and insights
    """
    try:
        # Validate input
        if not request.product_name:
            raise HTTPException(status_code=400, detail="product_name is required")
        
        if request.forecast_days <= 0 or request.forecast_days > 365:
            raise HTTPException(status_code=400, detail="forecast_days must be between 1 and 365")
        
        # Generate forecast
        forecast = generate_forecast(
            request.product_name,
            request.forecast_days,
            request.region or "all"
        )

        return ForecastResponse(
            current_demand=forecast["current_demand"],
            predicted_demand=forecast["predicted_demand"],
            trend=forecast["trend"],
            confidence_level=forecast["confidence_level"],
            recommendations=forecast["recommendations"],
            forecast_dates=forecast["forecast_dates"],
            model_info={
                "model_type": "demo_algorithm",
                "version": "1.0.0",
                "demo_mode": True,
                "note": "This is a demo algorithm. Replace with trained ML model for production."
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/products")
async def get_available_products():
    """
    Get list of products available for forecasting.
    """
    return {
        "products": list(DEMO_DEMAND_DATA.keys()),
        "demo_mode": True
    }

@app.post("/train")
async def train_model():
    """
    Placeholder for model training endpoint.
    In production, this would train/retrain the ML model.
    """
    return {
        "message": "Model training not implemented in demo mode",
        "note": "Replace with actual ML training pipeline for production"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)