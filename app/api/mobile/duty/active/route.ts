import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/api/mobile-auth'
import { getActiveDutySession } from '@/lib/actions/duty-session-actions'

export async function GET(req: NextRequest) {
  try {
    const authResult = await authenticateRequest(req)
    if (!authResult.ok) {
      return NextResponse.json(authResult, { status: 401 })
    }

    // getActiveDutySession() uses auth() internally to get current user
    const result = await getActiveDutySession()

    return NextResponse.json(result)
  } catch (error) {
    console.error('[API] Get active duty error:', error)
    return NextResponse.json(
      { ok: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
