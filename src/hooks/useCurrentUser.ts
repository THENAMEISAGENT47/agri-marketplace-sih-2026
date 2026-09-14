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
  
  if (user?.id) {
    // In production, would fetch farmer profile
    return user.id
  }
  
  // Demo mode mapping
  return 'farmer1' // Default to Ramesh Kumar for demo
}