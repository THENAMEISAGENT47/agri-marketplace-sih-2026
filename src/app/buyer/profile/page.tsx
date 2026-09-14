'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Input, Button, Alert } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'

export default function BuyerProfilePage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [profile, setProfile] = useState({
    name: '',
    type: 'individual',
    business_name: '',
    location_lat: '',
    location_lng: '',
    address: '',
    district: '',
    state: '',
    pincode: '',
  })

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      
      // Mock profile data for demo
      setProfile({
        name: 'Amit Sharma',
        type: 'wholesaler',
        business_name: 'Sharma Traders',
        location_lat: '19.0330',
        location_lng: '73.0297',
        address: 'Market Area, Thane',
        district: 'Thane',
        state: 'Maharashtra',
        pincode: '400601',
      })
    } catch (error) {
      console.error('Error fetching profile:', error)
      setError('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      // Mock update for now
      console.log('Updating profile:', profile)
      setSuccess('Profile updated successfully')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
        <p className="text-gray-600">Manage your buyer profile information</p>
      </div>

      {error && (
        <Alert type="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert type="success" onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Full Name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="Enter your full name"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buyer Type
              </label>
              <select
                value={profile.type}
                onChange={(e) => setProfile({ ...profile, type: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary bg-white text-foreground"
                required
              >
                <option value="individual">Individual Buyer</option>
                <option value="retailer">Retailer</option>
                <option value="wholesaler">Wholesaler</option>
                <option value="institution">Institution (Restaurant, Hotel, etc.)</option>
              </select>
            </div>

            {['retailer', 'wholesaler', 'institution'].includes(profile.type) && (
              <Input
                label="Business Name"
                value={profile.business_name}
                onChange={(e) => setProfile({ ...profile, business_name: e.target.value })}
                placeholder="Enter business name"
              />
            )}

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="District"
                value={profile.district}
                onChange={(e) => setProfile({ ...profile, district: e.target.value })}
                placeholder="e.g., Thane"
              />
              <Input
                label="State"
                value={profile.state}
                onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                placeholder="e.g., Maharashtra"
              />
            </div>

            <Input
              label="Address"
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              placeholder="Full address"
            />

            <Input
              label="Pincode"
              value={profile.pincode}
              onChange={(e) => setProfile({ ...profile, pincode: e.target.value })}
              placeholder="6-digit pincode"
              pattern="[0-9]{6}"
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Latitude"
                type="number"
                step="any"
                value={profile.location_lat}
                onChange={(e) => setProfile({ ...profile, location_lat: e.target.value })}
                placeholder="e.g., 19.0330"
              />
              <Input
                label="Longitude"
                type="number"
                step="any"
                value={profile.location_lng}
                onChange={(e) => setProfile({ ...profile, location_lng: e.target.value })}
                placeholder="e.g., 73.0297"
              />
            </div>

            <div className="pt-4">
              <Button type="submit" variant="secondary" isLoading={saving}>
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <p className="text-gray-900">{user?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
              <p className="text-gray-900">Buyer</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
              <p className="text-gray-900">September 2026</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}