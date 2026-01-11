import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/api/mobile-auth'
import { getNotifications } from '@/lib/actions/notification-actions'

export async function GET(req: NextRequest) {
  try {
    const authResult = await authenticateRequest(req)
    if (!authResult.ok) {
      return NextResponse.json(authResult, { status: 401 })
    }

    const result = await getNotifications()

    return NextResponse.json(result)
  } catch (error) {
    console.error('[API] Get notifications error:', error)
    return NextResponse.json(
      { ok: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
