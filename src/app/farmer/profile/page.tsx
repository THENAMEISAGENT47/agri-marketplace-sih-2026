'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Input, Button, Alert, Badge } from '@/components/ui'
import { User, ShieldCheck, MapPin, Landmark, Check, Info } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useFarmerProfile } from '@/hooks/useCurrentUser'
import { Reveal } from '@/components/motion'

export default function FarmerProfilePage() {
  const { t } = useLanguage()
  const farmerProfile = useFarmerProfile()

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Controlled profile state populated from verified demo profile data + localStorage
  const [profile, setProfile] = useState({
    name: farmerProfile.name,
    email: farmerProfile.email,
    type: farmerProfile.type,
    fpo_name: farmerProfile.type === 'fpo' ? 'Nashik Farmers Cooperative' : '',
    location_lat: farmerProfile.location_lat.toString(),
    location_lng: farmerProfile.location_lng.toString(),
    address: farmerProfile.address,
    district: farmerProfile.district,
    state: farmerProfile.state,
    pincode: farmerProfile.pincode,
  })

  // Restore saved profile from localStorage if available
  React.useEffect(() => {
    try {
      const storageKey = `farmer_profile_${farmerProfile.id || 'farmer1'}`
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsed = JSON.parse(saved)
        setProfile(prev => ({ ...prev, ...parsed }))
      }
    } catch (e) {
      console.debug('Failed to load farmer profile from storage:', e)
    }
  }, [farmerProfile.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      // Save updated state in localStorage for persistent demo demonstration
      const storageKey = `farmer_profile_${farmerProfile.id || 'farmer1'}`
      localStorage.setItem(storageKey, JSON.stringify(profile))
      await new Promise(resolve => setTimeout(resolve, 300))
      setSuccess(t('profile.update_success'))
      setTimeout(() => setSuccess(''), 3500)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('profile.update_fail'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header Context */}
      <Reveal>
        <div className="border-b border-border pb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 dark:bg-primary-950/70 border border-primary/20 dark:border-primary-800 text-xs font-semibold text-primary dark:text-[#8FBF2E] mb-1.5">
            <User className="w-3.5 h-3.5" />
            <span>Producer Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-foreground">
            {t('profile.farmer_title')}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {t('profile.farmer_subtitle')}
          </p>
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

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Producer Identity */}
        <Reveal delay={0.05}>
          <Card className="border border-border bg-card-bg shadow-xs">
            <CardHeader className="p-5 border-b border-border pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold font-display text-foreground">
                    {t('profile.basic_info')}
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Verified producer credentials for market allocation
                  </CardDescription>
                </div>
                <Badge variant="success" size="sm">
                  {t('farmer.profile.status_verified')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label={t('profile.full_name')}
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder={t('profile.name_placeholder')}
                  required
                />

                <Input
                  label={t('profile.email')}
                  value={profile.email}
                  disabled
                  className="bg-neutral-100 dark:bg-neutral-900 cursor-not-allowed opacity-80"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  {t('profile.farmer_type')}
                </label>
                <select
                  value={profile.type}
                  onChange={(e) => setProfile({ ...profile, type: e.target.value as 'individual' | 'fpo' })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-card-bg text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                >
                  <option value="individual">{t('profile.type_individual_farmer')}</option>
                  <option value="fpo">{t('profile.type_fpo')}</option>
                </select>
              </div>

              {profile.type === 'fpo' && (
                <Input
                  label={t('profile.fpo_name')}
                  value={profile.fpo_name}
                  onChange={(e) => setProfile({ ...profile, fpo_name: e.target.value })}
                  placeholder={t('profile.fpo_placeholder')}
                />
              )}
            </CardContent>
          </Card>
        </Reveal>

        {/* Section 2: Farmgate Dispatch Location & Demo Coordinates */}
        <Reveal delay={0.1}>
          <Card className="border border-border bg-card-bg shadow-xs">
            <CardHeader className="p-5 border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <CardTitle className="text-base font-bold font-display text-foreground">
                  Farmgate Dispatch Point
                </CardTitle>
              </div>
              <CardDescription className="text-xs text-muted-foreground">
                Designated collection address used by the route optimization engine
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <Input
                label={t('profile.address')}
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                placeholder={t('profile.address_placeholder')}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label={t('profile.district')}
                  value={profile.district}
                  onChange={(e) => setProfile({ ...profile, district: e.target.value })}
                  placeholder="Nashik"
                  required
                />
                <Input
                  label={t('profile.state')}
                  value={profile.state}
                  onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                  placeholder="Maharashtra"
                  required
                />
                <Input
                  label={t('profile.pincode')}
                  value={profile.pincode}
                  onChange={(e) => setProfile({ ...profile, pincode: e.target.value })}
                  placeholder="422003"
                  pattern="[0-9]{6}"
                  required
                />
              </div>

              {/* Prototype Demo Coordinate Notice */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <Input
                  label={t('profile.latitude')}
                  type="number"
                  step="any"
                  value={profile.location_lat}
                  onChange={(e) => setProfile({ ...profile, location_lat: e.target.value })}
                  required
                />
                <Input
                  label={t('profile.longitude')}
                  type="number"
                  step="any"
                  value={profile.location_lng}
                  onChange={(e) => setProfile({ ...profile, location_lng: e.target.value })}
                  required
                />
              </div>

              <div className="p-3 rounded-lg bg-surface-elevated/70 dark:bg-neutral-900/60 border border-border flex items-center gap-2 text-xs font-mono text-muted-foreground">
                <Info className="w-4 h-4 text-primary shrink-0" />
                <span>{t('farmer.profile.demo_coord_notice')}</span>
              </div>
            </CardContent>
          </Card>
        </Reveal>

        {/* Section 3: Truthful Farmgate Settlement Account */}
        <Reveal delay={0.15}>
          <Card className="border border-border bg-card-bg shadow-xs">
            <CardHeader className="p-5 border-b border-border pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-primary" />
                  <CardTitle className="text-base font-bold font-display text-foreground">
                    {t('farmer.profile.settlement_title')}
                  </CardTitle>
                </div>
                <Badge variant="default" className="font-mono text-[10px]">
                  {t('farmer.profile.settlement_mode')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-3 text-xs">
              <p className="text-muted-foreground leading-relaxed">
                {t('farmer.profile.settlement_note')}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-lg bg-neutral-50/70 dark:bg-neutral-900/50 border border-border font-mono text-xs">
                <div>
                  <span className="text-muted-foreground text-[10px] block">Settlement Beneficiary:</span>
                  <strong className="text-foreground">{profile.name}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground text-[10px] block">Producer Node Identifier:</span>
                  <strong className="text-primary dark:text-[#8FBF2E]">PROD-NSK-{farmerProfile.id.toUpperCase()}</strong>
                </div>
              </div>
            </CardContent>
          </Card>
        </Reveal>

        {/* Save Action */}
        <Reveal delay={0.2}>
          <div className="flex items-center justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={saving}
              className="text-xs font-semibold shadow-xs"
            >
              <Check className="w-4 h-4 mr-1.5" />
              {t('farmer.profile.btn_save')}
            </Button>
          </div>
        </Reveal>
      </form>
    </div>
  )
}