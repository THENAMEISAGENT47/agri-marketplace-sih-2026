'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button, Input, Select, Alert } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'
import { Sprout, UserPlus } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function RegisterPage() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'farmer',
    phone: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.passwords_mismatch'))
      return
    }

    if (formData.password.length < 6) {
      setError(t('auth.password_min'))
      return
    }

    setIsLoading(true)

    try {
      await signUp(formData.email, formData.password, formData.role as 'farmer' | 'buyer', formData.phone)
      router.push('/login?registered=true')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="max-w-md w-full">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-linear-to-br from-primary to-primary-700 rounded-2xl shadow-lg mb-4">
            <Sprout className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">{t('auth.register_title')}</h1>
          <p className="text-muted-foreground mt-2">{t('auth.register_desc')}</p>
        </div>

        <div className="bg-card-bg rounded-2xl shadow-xl border border-border p-8">
          <div className="text-center mb-6">
            <h2 className="text-lg font-semibold text-foreground">{t('auth.register_get_started')}</h2>
          </div>

          {error && (
            <Alert type="error" onClose={() => setError('')} className="mb-4">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label={t('auth.email')}
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="you@example.com"
              required
            />
            <Input
              label={t('auth.phone_optional')}
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 9876543210"
            />
            <Select
              label={t('auth.role_label')}
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as 'farmer' | 'buyer' })}
              options={[
                { value: 'farmer', label: t('auth.role_farmer_option') },
                { value: 'buyer', label: t('auth.role_buyer_option') },
              ]}
              required
            />
            <Input
              label={t('auth.password')}
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              required
              minLength={6}
            />
            <Input
              label={t('auth.confirm_password')}
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="••••••••"
              required
              minLength={6}
            />
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full font-semibold"
              isLoading={isLoading}
              leftIcon={<UserPlus className="w-4 h-4" />}
            >
              {t('auth.btn_create_account')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              {t('auth.already_account')}{' '}
              <Link href="/login" className="text-primary dark:text-[#8FBF2E] font-semibold hover:underline">
                {t('auth.signin_link')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}