'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Input, Button, Alert } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/contexts/LanguageContext'
import { Reveal } from '@/components/motion'

export default function BuyerProfilePage() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [loading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [profile, setProfile] = useState({
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

  // Restore saved buyer profile from localStorage if available
  useEffect(() => {
    try {
      const storageKey = `buyer_profile_${user?.id || 'buyer1'}`
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsed = JSON.parse(saved)
        setProfile(prev => ({ ...prev, ...parsed }))
      }
    } catch (e) {
      console.debug('Failed to load buyer profile from storage:', e)
    }
  }, [user?.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      const storageKey = `buyer_profile_${user?.id || 'buyer1'}`
      localStorage.setItem(storageKey, JSON.stringify(profile))
      await new Promise(resolve => setTimeout(resolve, 300))
      setSuccess(t('profile.update_success'))
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('profile.update_fail'))
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
      <Reveal>
        <div>
          <h2 className="text-2xl font-bold text-foreground">{t('profile.buyer_title')}</h2>
          <p className="text-muted-foreground">{t('profile.buyer_subtitle')}</p>
        </div>
      </Reveal>

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
      <Reveal delay={0.05}>
        <Card className="border border-border bg-card-bg">
          <CardHeader>
            <CardTitle className="text-foreground">{t('profile.basic_info')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label={t('profile.full_name')}
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder={t('profile.name_placeholder')}
                required
              />

              <div>
                <label className="block text-sm font-medium text-foreground/90 mb-2">
                  {t('profile.buyer_type')}
                </label>
                <select
                  value={profile.type}
                  onChange={(e) => setProfile({ ...profile, type: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary bg-card-bg text-foreground"
                  required
                >
                  <option value="individual">{t('profile.type_individual_buyer')}</option>
                  <option value="retailer">{t('profile.type_retailer')}</option>
                  <option value="wholesaler">{t('profile.type_wholesaler')}</option>
                  <option value="institution">{t('profile.type_institution')}</option>
                </select>
              </div>

              {['retailer', 'wholesaler', 'institution'].includes(profile.type) && (
                <Input
                  label={t('profile.business_name')}
                  value={profile.business_name}
                  onChange={(e) => setProfile({ ...profile, business_name: e.target.value })}
                  placeholder={t('profile.business_placeholder')}
                />
              )}

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label={t('profile.district')}
                  value={profile.district}
                  onChange={(e) => setProfile({ ...profile, district: e.target.value })}
                  placeholder="e.g., Thane"
                />
                <Input
                  label={t('profile.state')}
                  value={profile.state}
                  onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                  placeholder="e.g., Maharashtra"
                />
              </div>

              <Input
                label={t('profile.address')}
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                placeholder={t('profile.address_placeholder')}
              />

              <Input
                label={t('profile.pincode')}
                value={profile.pincode}
                onChange={(e) => setProfile({ ...profile, pincode: e.target.value })}
                placeholder="400601"
                pattern="[0-9]{6}"
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label={t('profile.latitude')}
                  type="number"
                  step="any"
                  value={profile.location_lat}
                  onChange={(e) => setProfile({ ...profile, location_lat: e.target.value })}
                  placeholder="e.g., 19.0330"
                />
                <Input
                  label={t('profile.longitude')}
                  type="number"
                  step="any"
                  value={profile.location_lng}
                  onChange={(e) => setProfile({ ...profile, location_lng: e.target.value })}
                  placeholder="e.g., 73.0297"
                />
              </div>

              <div className="pt-4">
                <Button type="submit" variant="secondary" isLoading={saving}>
                  {t('profile.save_changes')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </Reveal>

      {/* Account Information */}
      <Reveal delay={0.1}>
        <Card className="border border-border bg-card-bg">
          <CardHeader>
            <CardTitle className="text-foreground">{t('profile.account_info')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1">{t('profile.email')}</label>
                <p className="text-foreground font-medium">{user?.email || 'buyer1@demo.com'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1">{t('profile.account_type')}</label>
                <p className="text-foreground font-medium">{t('profile.role_buyer')}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1">{t('profile.member_since')}</label>
                <p className="text-foreground font-medium">{t('profile.member_date')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Reveal>
    </div>
  )
}