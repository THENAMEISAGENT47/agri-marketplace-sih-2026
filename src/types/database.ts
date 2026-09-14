// Database type definitions based on our schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          phone: string | null
          password_hash: string
          role: 'farmer' | 'buyer' | 'admin'
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          phone?: string | null
          password_hash: string
          role: 'farmer' | 'buyer' | 'admin'
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          phone?: string | null
          password_hash?: string
          role?: 'farmer' | 'buyer' | 'admin'
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      farmers: {
        Row: {
          id: string
          user_id: string
          name: string
          type: 'individual' | 'fpo'
          fpo_name: string | null
          location_lat: number | null
          location_lng: number | null
          address: string | null
          district: string | null
          state: string | null
          pincode: string | null
          verification_status: 'pending' | 'verified' | 'rejected'
          total_earnings: number
          rating: number
          total_orders: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          type: 'individual' | 'fpo'
          fpo_name?: string | null
          location_lat?: number | null
          location_lng?: number | null
          address?: string | null
          district?: string | null
          state?: string | null
          pincode?: string | null
          verification_status?: 'pending' | 'verified' | 'rejected'
          total_earnings?: number
          rating?: number
          total_orders?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          type?: 'individual' | 'fpo'
          fpo_name?: string | null
          location_lat?: number | null
          location_lng?: number | null
          address?: string | null
          district?: string | null
          state?: string | null
          pincode?: string | null
          verification_status?: 'pending' | 'verified' | 'rejected'
          total_earnings?: number
          rating?: number
          total_orders?: number
          created_at?: string
          updated_at?: string
        }
      }
      buyers: {
        Row: {
          id: string
          user_id: string
          name: string
          type: 'individual' | 'retailer' | 'wholesaler' | 'institution'
          business_name: string | null
          location_lat: number | null
          location_lng: number | null
          address: string | null
          district: string | null
          state: string | null
          pincode: string | null
          total_savings: number
          total_orders: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          type: 'individual' | 'retailer' | 'wholesaler' | 'institution'
          business_name?: string | null
          location_lat?: number | null
          location_lng?: number | null
          address?: string | null
          district?: string | null
          state?: string | null
          pincode?: string | null
          total_savings?: number
          total_orders?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          type?: 'individual' | 'retailer' | 'wholesaler' | 'institution'
          business_name?: string | null
          location_lat?: number | null
          location_lng?: number | null
          address?: string | null
          district?: string | null
          state?: string | null
          pincode?: string | null
          total_savings?: number
          total_orders?: number
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          farmer_id: string
          name: string
          category: string | null
          variety: string | null
          quantity: number
          unit: 'kg' | 'quintal' | 'tonne' | 'pieces' | 'dozen'
          price_per_unit: number
          harvest_date: string | null
          availability_date: string
          is_available: boolean
          quality_grade: 'A' | 'B' | 'C' | null
          description: string | null
          image_url: string | null
          min_order_quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          farmer_id: string
          name: string
          category?: string | null
          variety?: string | null
          quantity: number
          unit: 'kg' | 'quintal' | 'tonne' | 'pieces' | 'dozen'
          price_per_unit: number
          harvest_date?: string | null
          availability_date: string
          is_available?: boolean
          quality_grade?: 'A' | 'B' | 'C' | null
          description?: string | null
          image_url?: string | null
          min_order_quantity?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          farmer_id?: string
          name?: string
          category?: string | null
          variety?: string | null
          quantity?: number
          unit?: 'kg' | 'quintal' | 'tonne' | 'pieces' | 'dozen'
          price_per_unit?: number
          harvest_date?: string | null
          availability_date?: string
          is_available?: boolean
          quality_grade?: 'A' | 'B' | 'C' | null
          description?: string | null
          image_url?: string | null
          min_order_quantity?: number
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          buyer_id: string
          status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          total_amount: number
          logistics_cost: number
          logistics_savings: number
          intermediary_savings: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          buyer_id: string
          status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          total_amount: number
          logistics_cost?: number
          logistics_savings?: number
          intermediary_savings?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          buyer_id?: string
          status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          total_amount?: number
          logistics_cost?: number
          logistics_savings?: number
          intermediary_savings?: number
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          farmer_id: string
          quantity: number
          unit: string
          price_per_unit: number
          subtotal: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          farmer_id: string
          quantity: number
          unit: string
          price_per_unit: number
          subtotal: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          farmer_id?: string
          quantity?: number
          unit?: string
          price_per_unit?: number
          subtotal?: number
          created_at?: string
        }
      }
      logistics_routes: {
        Row: {
          id: string
          order_id: string
          route_type: 'optimized' | 'direct'
          total_distance: number
          estimated_duration: number | null
          route_data: Json | null
          cost: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          route_type?: 'optimized' | 'direct'
          total_distance: number
          estimated_duration?: number | null
          route_data?: Json | null
          cost: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          route_type?: 'optimized' | 'direct'
          total_distance?: number
          estimated_duration?: number | null
          route_data?: Json | null
          cost?: number
          created_at?: string
        }
      }
      route_stops: {
        Row: {
          id: string
          route_id: string
          stop_order: number
          type: 'pickup' | 'delivery'
          farmer_id: string | null
          buyer_id: string | null
          location_lat: number
          location_lng: number
          address: string | null
          estimated_arrival: string | null
          status: 'pending' | 'completed' | 'skipped'
          created_at: string
        }
        Insert: {
          id?: string
          route_id: string
          stop_order: number
          type: 'pickup' | 'delivery'
          farmer_id?: string | null
          buyer_id?: string | null
          location_lat: number
          location_lng: number
          address?: string | null
          estimated_arrival?: string | null
          status?: 'pending' | 'completed' | 'skipped'
          created_at?: string
        }
        Update: {
          id?: string
          route_id?: string
          stop_order?: number
          type?: 'pickup' | 'delivery'
          farmer_id?: string | null
          buyer_id?: string | null
          location_lat?: number
          location_lng?: number
          address?: string | null
          estimated_arrival?: string | null
          status?: 'pending' | 'completed' | 'skipped'
          created_at?: string
        }
      }
      demand_history: {
        Row: {
          id: string
          product_name: string
          date: string
          quantity: number
          region: string | null
          created_at: string
        }
        Insert: {
          id?: string
          product_name: string
          date: string
          quantity: number
          region?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          product_name?: string
          date?: string
          quantity?: number
          region?: string | null
          created_at?: string
        }
      }
      demand_forecasts: {
        Row: {
          id: string
          product_name: string
          forecast_date: string
          predicted_quantity: number
          confidence_level: number
          trend: 'increasing' | 'decreasing' | 'stable'
          region: string | null
          model_version: string | null
          created_at: string
        }
        Insert: {
          id?: string
          product_name: string
          forecast_date: string
          predicted_quantity: number
          confidence_level: number
          trend: 'increasing' | 'decreasing' | 'stable'
          region?: string | null
          model_version?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          product_name?: string
          forecast_date?: string
          predicted_quantity?: number
          confidence_level?: number
          trend?: 'increasing' | 'decreasing' | 'stable'
          region?: string | null
          model_version?: string | null
          created_at?: string
        }
      }
      platform_analytics: {
        Row: {
          id: string
          date: string
          total_farmers: number
          total_buyers: number
          total_orders: number
          total_produce_traded: number
          total_farmer_earnings: number
          total_buyer_savings: number
          total_logistics_savings: number
          intermediaries_avoided: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          date: string
          total_farmers?: number
          total_buyers?: number
          total_orders?: number
          total_produce_traded?: number
          total_farmer_earnings?: number
          total_buyer_savings?: number
          total_logistics_savings?: number
          intermediaries_avoided?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          date?: string
          total_farmers?: number
          total_buyers?: number
          total_orders?: number
          total_produce_traded?: number
          total_farmer_earnings?: number
          total_buyer_savings?: number
          total_logistics_savings?: number
          intermediaries_avoided?: number
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string
          is_read: boolean
          related_order_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message: string
          is_read?: boolean
          related_order_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          message?: string
          is_read?: boolean
          related_order_id?: string | null
          created_at?: string
        }
      }
    }
  }
}