'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button, Badge } from '../ui'
import { ChevronDown, ChevronUp, Sparkles, Info, CheckCircle } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export function DemoGuide() {
  const { t } = useLanguage()
  const [expanded, setExpanded] = useState(false)

  const steps = [
    {
      step: 1,
      title: 'Login as Buyer',
      description: 'Use buyer1@demo.com / demo123',
      path: '/login',
      icon: '🔐'
    },
    {
      step: 2,
      title: 'Go to AI Matching',
      description: 'Navigate to Buyer Dashboard → AI Matching',
      path: '/buyer/matching',
      icon: '🤖'
    },
    {
      step: 3,
      title: 'Load 800kg Tomato Demo',
      description: 'Click "Load 800kg Tomato Demo" button',
      path: '/buyer/matching',
      icon: '🍅'
    },
    {
      step: 4,
      title: 'View AI Recommendations',
      description: 'See optimal supplier combination (Ramesh + Suresh)',
      path: '/buyer/matching',
      icon: '✨'
    },
    {
      step: 5,
      title: 'Place Order',
      description: 'Click "Place Order with Recommended Combination"',
      path: '/buyer/matching',
      icon: '📦'
    },
    {
      step: 6,
      title: 'View Order in Buyer Dashboard',
      description: 'Check Orders tab to see the 800kg order',
      path: '/buyer/orders',
      icon: '📋'
    },
    {
      step: 7,
      title: 'Check Inventory',
      description: 'Inventory decreased for tomato products',
      path: '/marketplace',
      icon: '📊'
    },
    {
      step: 8,
      title: 'Farmer Updates Status',
      description: 'Login as farmer, accept order, update status',
      path: '/farmer/orders',
      icon: '👨‍🌾'
    },
    {
      step: 9,
      title: 'Buyer Receives Notifications',
      description: 'Check notification bell for status updates',
      path: '/buyer/dashboard',
      icon: '🔔'
    },
    {
      step: 10,
      title: 'View Admin Dashboard',
      description: 'Check platform impact and statistics',
      path: '/admin/dashboard',
      icon: '📈'
    }
  ]

  return (
    <Card className="border border-border bg-card-bg shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-primary dark:text-[#8FBF2E]" />
            <CardTitle className="text-xl text-foreground">{t('guide.title')}</CardTitle>
            <Badge variant="secondary">10 Steps</Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="text-neutral-600 dark:text-neutral-400 hover:text-foreground"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-4 h-4 mr-1" />
                {t('guide.collapse')}
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-1" />
                {t('guide.expand')}
              </>
            )}
          </Button>
        </div>
        <CardDescription className="text-neutral-500">
          {t('guide.subtitle')}
        </CardDescription>
      </CardHeader>
      {expanded && (
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-primary/5 dark:bg-primary-950/40 rounded-xl border border-primary/20 dark:border-primary-800">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-primary dark:text-[#8FBF2E] mt-0.5 shrink-0" />
                <div className="text-sm text-foreground">
                  <p className="font-semibold mb-1">Demo Scenario</p>
                  <p className="text-neutral-600 dark:text-neutral-300">800kg Tomatoes from Ramesh Kumar (500kg @ ₹25/kg) + Suresh FPO (300kg @ ₹22/kg) = ₹19,100 total with 15% intermediary savings.</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {steps.map((step) => (
                <div key={step.step} className="flex items-start space-x-4 p-4 bg-card-bg dark:bg-neutral-900/60 rounded-xl border border-border hover:border-primary/40 hover:shadow-md transition-all">
                  <div className="w-10 h-10 rounded-full bg-forest-900 text-white flex items-center justify-center shrink-0 font-bold text-lg shadow-md">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-lg">{step.icon}</span>
                      <h4 className="font-semibold text-foreground">{step.title}</h4>
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-success-light rounded-xl border border-success/30">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-success mt-0.5 shrink-0" />
                <div className="text-sm text-foreground">
                  <p className="font-semibold mb-1">Quick Reset</p>
                  <p className="text-neutral-600 dark:text-neutral-300">Use Admin Dashboard &quot;Reset Demo Data&quot; to start fresh anytime during the demo.</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
