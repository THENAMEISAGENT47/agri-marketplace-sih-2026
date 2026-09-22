'use client'

import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { RouteOptimization } from '@/components/ai'
import { LoadingSpinner } from '@/components/ui'

function RouteContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id') || undefined

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <RouteOptimization initialOrderId={orderId} />
    </div>
  )
}

export default function BuyerRoutePage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-[50vh] flex flex-col items-center justify-center py-16">
          <LoadingSpinner size="lg" />
          <span className="mt-3 text-xs font-mono text-muted-foreground">
            Loading logistics routing workspace...
          </span>
        </div>
      }
    >
      <RouteContent />
    </Suspense>
  )
}
