import { NextRequest, NextResponse } from 'next/server'
import { setupSIHDemo } from '@/lib/demo/sih-demo'

export async function POST(request: NextRequest) {
  try {
    const result = setupSIHDemo()
    
    return NextResponse.json(result)
  } catch (error: any) {
    console.error('SIH demo setup error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to setup SIH demo scenario' },
      { status: 500 }
    )
  }
}