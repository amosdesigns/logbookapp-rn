import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/api/auth-middleware'
import { getShifts } from '@/lib/actions/shift-actions'

export async function GET(req: NextRequest) {
  try {
    const authResult = await authenticateRequest(req)
    if (!authResult.ok) {
      return NextResponse.json(authResult, { status: 401 })
    }

    // Parse query params
    const { searchParams } = new URL(req.url)
    const params = {
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      locationId: searchParams.get('locationId') || undefined,
    }

    const result = await getShifts(params)

    return NextResponse.json(result)
  } catch (error) {
    console.error('[API] Get shifts error:', error)
    return NextResponse.json(
      { ok: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
