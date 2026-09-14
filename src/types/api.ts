// API type definitions

export interface ApiResponse<T> {
  data: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// Auth types
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  role: 'farmer' | 'buyer'
  phone?: string
}

export interface AuthResponse {
  user: {
    id: string
    email: string
    role: string
  }
  token: string
}

// Farmer types
export interface FarmerProfile {
  id: string
  user_id: string
  name: string
  type: 'individual' | 'fpo'
  fpo_name?: string
  location_lat?: number
  location_lng?: number
  address?: string
  district?: string
  state?: string
  pincode?: string
  verification_status: 'pending' | 'verified' | 'rejected'
  total_earnings: number
  rating: number
  total_orders: number
}

export interface Product {
  id: string
  farmer_id: string
  name: string
  category?: string
  variety?: string
  quantity: number
  unit: 'kg' | 'quintal' | 'tonne' | 'pieces' | 'dozen'
  price_per_unit: number
  harvest_date?: string
  availability_date: string
  is_available: boolean
  quality_grade?: 'A' | 'B' | 'C'
  description?: string
  image_url?: string
  min_order_quantity: number
  farmer?: {
    name: string
    location_lat?: number
    location_lng?: number
    rating: number
  }
}

// Buyer types
export interface BuyerProfile {
  id: string
  user_id: string
  name: string
  type: 'individual' | 'retailer' | 'wholesaler' | 'institution'
  business_name?: string
  location_lat?: number
  location_lng?: number
  address?: string
  district?: string
  state?: string
  pincode?: string
  total_savings: number
  total_orders: number
}

// Order types
export interface Order {
  id: string
  buyer_id: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total_amount: number
  logistics_cost: number
  logistics_savings: number
  intermediary_savings: number
  created_at: string
  updated_at: string
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  farmer_id: string
  quantity: number
  unit: string
  price_per_unit: number
  subtotal: number
  product?: Product
  farmer?: FarmerProfile
}

// Matching types
export interface MatchingRequest {
  product_name: string
  required_quantity: number
  max_price?: number
  buyer_location: {
    lat: number
    lng: number
  }
  availability_date?: string
}

export interface SupplierMatch {
  farmer_id: string
  farmer_name: string
  product_id: string
  available_quantity: number
  price_per_unit: number
  distance: number
  rating: number
  score: number
  location: {
    lat: number
    lng: number
  }
}

export interface MatchingResponse {
  matches: SupplierMatch[]
  optimal_combination: SupplierMatch[]
  total_cost: number
  total_quantity: number
  recommendations: string[]
}

// Logistics types
export interface LogisticsRequest {
  order_id: string
  pickup_locations: Array<{
    farmer_id: string
    lat: number
    lng: number
    quantity: number
    address?: string
  }>
  delivery_location: {
    buyer_id: string
    lat: number
    lng: number
    address?: string
  }
  vehicle_capacity?: number
}

export interface RouteStop {
  order: number
  type: 'pickup' | 'delivery'
  farmer_id?: string
  buyer_id?: string
  location: {
    lat: number
    lng: number
  }
  address?: string
  estimated_arrival?: string
  quantity?: number
  status?: 'pending' | 'completed' | 'skipped'
}

export interface OptimizedRoute {
  total_distance: number
  estimated_duration: number
  stops: RouteStop[]
  route_geometry?: string
}

export interface CostAnalysis {
  optimized_cost: number
  direct_cost: number
  savings: number
  savings_percentage: number
}

export interface LogisticsResponse {
  optimized_route: OptimizedRoute
  cost_analysis: CostAnalysis
}

// Demand forecasting types
export interface DemandForecastRequest {
  product_name: string
  region?: string
  forecast_days?: number
  historical_days?: number
}

export interface DemandForecastResponse {
  current_demand: number
  predicted_demand: number[]
  trend: 'increasing' | 'decreasing' | 'stable'
  confidence_level: number
  recommendations: string[]
  forecast_dates: string[]
}

// Analytics types
export interface PlatformAnalytics {
  total_farmers: number
  total_buyers: number
  total_orders: number
  total_produce_traded: number
  total_farmer_earnings: number
  total_buyer_savings: number
  total_logistics_savings: number
  intermediaries_avoided: number
}

export interface FarmerAnalytics {
  total_earnings: number
  total_orders: number
  average_order_value: number
  top_products: Array<{
    product_name: string
    total_quantity: number
    total_revenue: number
  }>
  monthly_trends: Array<{
    month: string
    earnings: number
    orders: number
  }>
}

export interface BuyerAnalytics {
  total_savings: number
  total_orders: number
  average_order_value: number
  top_categories: Array<{
    category: string
    total_quantity: number
    total_savings: number
  }>
  monthly_trends: Array<{
    month: string
    savings: number
    orders: number
  }>
}