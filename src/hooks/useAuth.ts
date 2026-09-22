'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

interface AuthUser {
  id: string
  email: string
  role: 'farmer' | 'buyer' | 'admin'
  is_verified: boolean
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null)

  const checkDemoSession = useCallback(() => {
    const demoSession = localStorage.getItem('demo_session')
    if (demoSession) {
      const { email, role } = JSON.parse(demoSession)
      setUser({
        id: email.split('@')[0],
        email,
        role: role as 'farmer' | 'buyer' | 'admin',
        is_verified: true,
      })
    } else {
      setUser(null)
    }
    setLoading(false)
  }, [])

  const fetchUserRole = useCallback(async (userId: string, emailStr?: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role, is_verified')
        .eq('id', userId)
        .single()

      if (error) throw error

      setUser({
        id: userId,
        email: emailStr || '',
        role: data.role as 'farmer' | 'buyer' | 'admin',
        is_verified: data.is_verified,
      })
    } catch (error) {
      console.error('Error fetching user role:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Get initial session
    const initSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        
        if (session?.user) {
          setSupabaseUser(session.user)
          await fetchUserRole(session.user.id, session.user.email)
        } else {
          checkDemoSession()
        }
      } catch {
        checkDemoSession()
      }
    }
    
    initSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setSupabaseUser(session.user)
        fetchUserRole(session.user.id, session.user.email)
      } else {
        setSupabaseUser(null)
        if (!localStorage.getItem('demo_session')) {
          setUser(null)
        }
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [checkDemoSession, fetchUserRole])

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      return data
    } catch (err: unknown) {
      // Fallback for demo mode - ONLY for documented demo accounts
      const isDemoAccount = ['buyer1@demo.com', 'farmer1@demo.com', 'admin@demo.com'].includes(email)
      
      if (password === 'demo123' && isDemoAccount) {
        let role = 'buyer'
        if (email.startsWith('farmer')) role = 'farmer'
        if (email.startsWith('admin')) role = 'admin'
        
        localStorage.setItem('demo_session', JSON.stringify({ email, role }))
        setUser({
          id: email.split('@')[0],
          email,
          role: role as 'farmer' | 'buyer' | 'admin',
          is_verified: true,
        })
        return { user: { id: email.split('@')[0], email } }
      }
      throw new Error((err as Error).message || 'Login failed. Please verify credentials and try again.')
    }
  }

  const signUp = async (email: string, password: string, role: 'farmer' | 'buyer', phone?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
          phone,
        },
      },
    })

    if (error) throw error
    return data
  }

  const signOut = async () => {
    localStorage.removeItem('demo_session')
    setUser(null)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (err) {
      console.error('Sign out error:', err)
    }
  }

  return {
    user,
    supabaseUser,
    loading,
    signIn,
    signUp,
    signOut,
  }
}