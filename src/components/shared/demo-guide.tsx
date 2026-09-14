'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '../ui'

export function DemoGuide() {
  const [expanded, setExpanded] = useState(true)

  const steps = [
    {
      step: 1,
      title: 'Login as Buyer',
      description: 'Use buyer1@demo.com / demo123',
      path: '/login'
    },
    {
      step: 2,
      title: 'Go to AI Matching',
      description: 'Navigate to Buyer Dashboard → AI Matching',
      path: '/buyer/matching'
    },
    {
      step: 3,
      title: 'Load 800kg Tomato Demo',
      description: 'Click "Load Demo Data (800kg Tomatoes)" button',
      path: '/buyer/matching'
    },
    {
      step: 4,
      title: 'View AI Recommendations',
      description: 'See optimal supplier combination (Ramesh + Suresh)',
      path: '/buyer/matching'
    },
    {
      step: 5,
      title: 'Place Order',
      description: 'Click "Place Order with Optimal Combination"',
      path: '/buyer/matching'
    },
    {
      step: 6,
      title: 'View Order in Buyer Dashboard',
      description: 'Check Orders tab to see the 800kg order',
      path: '/buyer/orders'
    },
    {
      step: 7,
      title: 'Check Inventory',
      description: 'Inventory decreased for tomato products',
      path: '/marketplace'
    },
    {
      step: 8,
      title: 'Farmer Updates Status',
      description: 'Login as farmer, accept order, update status',
      path: '/farmer/orders'
    },
    {
      step: 9,
      title: 'Buyer Receives Notifications',
      description: 'Check notification bell for status updates',
      path: '/buyer/dashboard'
    },
    {
      step: 10,
      title: 'View Admin Dashboard',
      description: 'Check platform impact and statistics',
      path: '/admin/dashboard'
    }
  ]

  return (
    <Card className="border-2 border-accent bg-blue-50">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">
            🍅 SIH Demo Guide
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Collapse' : 'Expand'}
          </Button>
        </div>
      </CardHeader>
      {expanded && (
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-gray-700 mb-4">
              Follow these steps to demonstrate the complete 800kg tomato scenario:
            </p>
            {steps.map((step) => (
              <div key={step.step} className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center flex-shrink-0 font-bold">
                  {step.step}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{step.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">{step.description}</p>
                </div>
              </div>
            ))}
            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800 font-semibold">
                💡 Quick Reset: Use Admin Dashboard → "Reset Demo Data" to start fresh
              </p>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
