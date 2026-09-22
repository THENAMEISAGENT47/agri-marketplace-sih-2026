import { NextResponse } from 'next/server'
import { setupSIHDemo } from '@/lib/demo/sih-demo'

export async function POST() {
  try {
    const result = setupSIHDemo()
    
    return NextResponse.json(result)
  } catch (error: unknown) {
    console.error('SIH demo setup error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to setup SIH demo scenario' },
      { status: 500 }
    )
  }
}