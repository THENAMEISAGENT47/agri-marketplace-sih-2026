from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import math

app = FastAPI(title="Route Optimization Service", version="1.0.0")

# Enable CORS for Next.js integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class Location(BaseModel):
    lat: float
    lng: float
    address: Optional[str] = None

class PickupLocation(BaseModel):
    farmer_id: str
    farmer_name: str
    location: Location
    quantity: float

class DeliveryLocation(BaseModel):
    buyer_id: str
    buyer_name: str
    location: Location

class RouteOptimizationRequest(BaseModel):
    pickup_locations: List[PickupLocation]
    delivery_location: DeliveryLocation
    vehicle_capacity: Optional[float] = 1000
    optimization_level: Optional[str] = "balanced"  # "fast", "balanced", "optimal"

class RouteStop(BaseModel):
    order: int
    type: str  # "pickup" or "delivery"
    farmer_id: Optional[str] = None
    farmer_name: Optional[str] = None
    buyer_id: Optional[str] = None
    buyer_name: Optional[str] = None
    location: Location
    address: Optional[str] = None
    estimated_arrival: Optional[str] = None
    quantity: Optional[float] = None
    status: str = "pending"

class OptimizedRoute(BaseModel):
    total_distance: float
    estimated_duration: int
    stops: List[RouteStop]
    route_geometry: Optional[str] = None

class CostAnalysis(BaseModel):
    optimized_cost: float
    direct_cost: float
    savings: float
    savings_percentage: float

class RouteOptimizationResponse(BaseModel):
    optimized_route: OptimizedRoute
    cost_analysis: CostAnalysis
    route_data: Dict[str, Any]

# Haversine formula for distance calculation
def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate distance between two coordinates using Haversine formula.
    Returns distance in kilometers.
    """
    R = 6371  # Earth's radius in km
    
    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    lon1_rad = math.radians(lon1)
    lon2_rad = math.radians(lon2)
    
    dlat = lat2_rad - lat1_rad
    dlon = lon2_rad - lon1_rad
    
    a = math.sin(dlat / 2) ** 2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    return R * c

def calculate_route_distance(stops: List[RouteStop]) -> float:
    """
    Calculate total distance for a sequence of stops.
    """
    if len(stops) < 2:
        return 0.0
    
    total_distance = 0.0
    for i in range(len(stops) - 1):
        distance = haversine_distance(
            stops[i].location.lat,
            stops[i].location.lng,
            stops[i + 1].location.lat,
            stops[i + 1].location.lng
        )
        total_distance += distance
    
    return total_distance

def estimate_travel_time(distance: float) -> int:
    """
    Estimate travel time based on distance.
    Assumes average speed of 40 km/h for rural areas.
    """
    avg_speed = 40  # km/h
    time_hours = distance / avg_speed
    return int(time_hours * 60)  # Return in minutes

def calculate_cost(distance: float, total_quantity: float) -> float:
    """
    Calculate logistics cost based on distance and quantity.
    Demo cost model: base + distance factor + quantity factor
    """
    base_cost = 500  # Base cost in INR
    distance_cost = distance * 30  # INR per km
    quantity_cost = total_quantity * 2  # INR per kg
    
    total_cost = base_cost + distance_cost + quantity_cost
    return round(total_cost, 2)

def nearest_neighbor_algorithm(pickups: List[PickupLocation], delivery: DeliveryLocation) -> List[RouteStop]:
    """
    Simple nearest neighbor algorithm for route optimization.
    Starts from delivery location and visits nearest pickup points.
    """
    if not pickups:
        return []
    
    # Start from delivery location (as last stop in reverse)
    current_location = delivery.location
    remaining_pickups = pickups.copy()
    route = []
    
    while remaining_pickups:
        # Find nearest pickup
        nearest_index = 0
        nearest_distance = float('inf')
        
        for i, pickup in enumerate(remaining_pickups):
            distance = haversine_distance(
                current_location.lat,
                current_location.lng,
                pickup.location.lat,
                pickup.location.lng
            )
            if distance < nearest_distance:
                nearest_distance = distance
                nearest_index = i
        
        # Add to route
        pickup = remaining_pickups.pop(nearest_index)
        route.append(RouteStop(
            order=len(route) + 1,
            type="pickup",
            farmer_id=pickup.farmer_id,
            farmer_name=pickup.farmer_name,
            location=pickup.location,
            address=pickup.location.address,
            quantity=pickup.quantity,
            status="pending"
        ))
        
        current_location = pickup.location
    
    # Add delivery as last stop
    route.append(RouteStop(
        order=len(route) + 1,
        type="delivery",
        buyer_id=delivery.buyer_id,
        buyer_name=delivery.buyer_name,
        location=delivery.location,
        address=delivery.location.address,
        status="pending"
    ))
    
    return route

def calculate_direct_route(pickups: List[PickupLocation], delivery: DeliveryLocation) -> OptimizedRoute:
    """
    Calculate direct route (visit each pickup separately, then delivery).
    """
    if not pickups:
        return OptimizedRoute(
            total_distance=0,
            estimated_duration=0,
            stops=[],
            route_geometry=None
        )
    
    # Route: start → pickup1 → delivery → start → pickup2 → delivery → ...
    stops = []
    total_distance = 0
    current_location = pickups[0].location  # Assume starting from first pickup
    
    for pickup in pickups:
        # Go to pickup
        distance_to_pickup = haversine_distance(
            current_location.lat,
            current_location.lng,
            pickup.location.lat,
            pickup.location.lng
        )
        total_distance += distance_to_pickup
        
        stops.append(RouteStop(
            order=len(stops) + 1,
            type="pickup",
            farmer_id=pickup.farmer_id,
            farmer_name=pickup.farmer_name,
            location=pickup.location,
            address=pickup.location.address,
            quantity=pickup.quantity,
            status="pending"
        ))
        
        # Go to delivery
        distance_to_delivery = haversine_distance(
            pickup.location.lat,
            pickup.location.lng,
            delivery.location.lat,
            delivery.location.lng
        )
        total_distance += distance_to_delivery
        
        stops.append(RouteStop(
            order=len(stops) + 1,
            type="delivery",
            buyer_id=delivery.buyer_id,
            buyer_name=delivery.buyer_name,
            location=delivery.location,
            address=delivery.location.address,
            status="pending"
        ))
        
        # Return to next pickup (or stay at delivery)
        if pickups.index(pickup) < len(pickups) - 1:
            distance_back = haversine_distance(
                delivery.location.lat,
                delivery.location.lng,
                pickups[pickups.index(pickup) + 1].location.lat,
                pickups[pickups.index(pickup) + 1].location.lng
            )
            total_distance += distance_back
            current_location = pickups[pickups.index(pickup) + 1].location
        else:
            current_location = delivery.location
    
    estimated_duration = estimate_travel_time(total_distance)
    
    return OptimizedRoute(
        total_distance=round(total_distance, 2),
        estimated_duration=estimated_duration,
        stops=stops,
        route_geometry=None
    )

@app.get("/")
async def root():
    return {
        "service": "Route Optimization API",
        "version": "1.0.0",
        "status": "running",
        "demo_mode": True,
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/optimize", response_model=RouteOptimizationResponse)
async def optimize_route(request: RouteOptimizationRequest):
    """
    Optimize delivery route for multiple pickups and one delivery.
    
    Args:
        request: RouteOptimizationRequest with pickup_locations, delivery_location, vehicle_capacity
    
    Returns:
        RouteOptimizationResponse with optimized route and cost analysis
    """
    try:
        if not request.pickup_locations:
            raise HTTPException(status_code=400, detail="At least one pickup location is required")
        
        if not request.delivery_location:
            raise HTTPException(status_code=400, detail="Delivery location is required")
        
        # Calculate total quantity
        total_quantity = sum(pickup.quantity for pickup in request.pickup_locations)
        
        # Generate optimized route using nearest neighbor algorithm
        optimized_stops = nearest_neighbor_algorithm(request.pickup_locations, request.delivery_location)
        optimized_distance = calculate_route_distance(optimized_stops)
        optimized_duration = estimate_travel_time(optimized_distance)
        optimized_cost = calculate_cost(optimized_distance, total_quantity)
        
        # Calculate direct route (for comparison)
        direct_route = calculate_direct_route(request.pickup_locations, request.delivery_location)
        direct_distance = direct_route.total_distance
        direct_cost = calculate_cost(direct_distance, total_quantity)
        
        # Calculate savings
        savings = direct_cost - optimized_cost
        savings_percentage = (savings / direct_cost * 100) if direct_cost > 0 else 0
        
        # Generate estimated arrival times
        current_time = datetime.now()
        for i, stop in enumerate(optimized_stops):
            arrival_time = current_time + timedelta(minutes=optimized_duration * (i + 1) / len(optimized_stops))
            stop.estimated_arrival = arrival_time.strftime("%Y-%m-%d %H:%M")
        
        return RouteOptimizationResponse(
            optimized_route=OptimizedRoute(
                total_distance=optimized_distance,
                estimated_duration=optimized_duration,
                stops=optimized_stops,
                route_geometry=None
            ),
            cost_analysis=CostAnalysis(
                optimized_cost=optimized_cost,
                direct_cost=direct_cost,
                savings=round(savings, 2),
                savings_percentage=round(savings_percentage, 2)
            ),
            route_data={
                "total_quantity": total_quantity,
                "num_pickups": len(request.pickup_locations),
                "optimization_algorithm": "nearest_neighbor",
                "demo_mode": True,
                "note": "Replace with real routing API (OSRM/Google Maps) for production"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/compare")
async def compare_routes(request: RouteOptimizationRequest):
    """
    Compare optimized route vs direct route.
    """
    try:
        # Get optimized route
        optimized_stops = nearest_neighbor_algorithm(request.pickup_locations, request.delivery_location)
        optimized_distance = calculate_route_distance(optimized_stops)
        optimized_duration = estimate_travel_time(optimized_distance)
        total_quantity = sum(pickup.quantity for pickup in request.pickup_locations)
        optimized_cost = calculate_cost(optimized_distance, total_quantity)
        
        # Get direct route
        direct_route = calculate_direct_route(request.pickup_locations, request.delivery_location)
        direct_distance = direct_route.total_distance
        direct_duration = estimate_travel_time(direct_distance)
        direct_cost = calculate_cost(direct_distance, total_quantity)
        
        return {
            "optimized_route": {
                "distance": optimized_distance,
                "duration": optimized_duration,
                "cost": optimized_cost,
                "stops": len(optimized_stops)
            },
            "direct_route": {
                "distance": direct_distance,
                "duration": direct_duration,
                "cost": direct_cost,
                "stops": len(direct_route.stops)
            },
            "savings": {
                "distance": round(direct_distance - optimized_distance, 2),
                "time": direct_duration - optimized_duration,
                "cost": round(direct_cost - optimized_cost, 2),
                "percentage": round(((direct_cost - optimized_cost) / direct_cost) * 100, 2) if direct_cost > 0 else 0
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)