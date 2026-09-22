import { NextResponse } from 'next/server'
import { resetAllDemoData, getDemoState } from '@/lib/demo/reset'

export async function POST() {
  try {
    // In a real application, you would verify admin credentials here
    // For demo purposes, we'll allow the reset without authentication
    
    const result = resetAllDemoData()
    
    return NextResponse.json({
      ...result,
      currentState: getDemoState(),
    })
  } catch (error: unknown) {
    console.error('Demo reset error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to reset demo data' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const state = getDemoState()
    return NextResponse.json(state)
  } catch (error: unknown) {
    console.error('Demo state error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get demo state' },
      { status: 500 }
    )
  }
}