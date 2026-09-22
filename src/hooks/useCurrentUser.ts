import { useAuth } from './useAuth'

/**
 * Get the current user ID for API calls
 * Falls back to demo IDs if authentication is not configured
 */
export function useCurrentUser() {
  const { user } = useAuth()
  
  // If user is authenticated, use their ID
  if (user?.id) {
    return {
      userId: user.id,
      email: user.email,
      role: user.role,
      isAuthenticated: true,
    }
  }
  
  // For demo mode, return demo IDs based on role
  // This is a fallback for when Supabase is not configured
  // We default to buyer for general pages, but specific pages can override
  return {
    userId: 'buyer1', // Default to buyer for demo
    email: 'buyer1@demo.com',
    role: 'buyer',
    isAuthenticated: false,
    isDemoMode: true,
  }
}

/**
 * Get farmer ID for the current user
 * Maps user IDs to farmer IDs for demo mode
 */
export function useFarmerId() {
  const { user } = useAuth()
  
  if (user?.id && user.role === 'farmer') {
    // In production, would fetch farmer profile
    return user.id
  }
  
  // Demo mode mapping: default to Ramesh Kumar (farmer1)
  return 'farmer1'
}

/**
 * Get verified producer identity profile for the current user in farmer portal
 * Strictly guarantees farmer identity (never leaking buyer1@demo.com in producer screens)
 */
export function useFarmerProfile() {
  const { user } = useAuth()

  if (user?.id && user.role === 'farmer') {
    return {
      id: user.id,
      name: user.email === 'farmer2@demo.com' ? 'Suresh FPO' : 'Ramesh Kumar',
      email: user.email,
      role: 'farmer' as const,
      type: user.email === 'farmer2@demo.com' ? ('fpo' as const) : ('individual' as const),
      district: 'Nashik',
      state: 'Maharashtra',
      address: 'Village Road, Nashik',
      pincode: '422003',
      location_lat: 19.0760,
      location_lng: 72.8777,
      isDemo: true,
    }
  }

  // Default demo farmer profile (Ramesh Kumar - farmer1)
  return {
    id: 'farmer1',
    name: 'Ramesh Kumar',
    email: 'farmer1@demo.com',
    role: 'farmer' as const,
    type: 'individual' as const,
    district: 'Nashik',
    state: 'Maharashtra',
    address: 'Village Road, Nashik',
    pincode: '422003',
    location_lat: 19.0760,
    location_lng: 72.8777,
    isDemo: true,
  }
}