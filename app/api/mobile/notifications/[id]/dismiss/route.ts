import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/api/mobile-auth'
import { dismissNotification } from '@/lib/actions/notification-actions'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await authenticateRequest(req)
    if (!authResult.ok) {
      return NextResponse.json(authResult, { status: 401 })
    }

    const result = await dismissNotification(params.id)

    return NextResponse.json(result, {
      status: result.ok ? 200 : 400
    })
  } catch (error) {
    console.error('[API] Dismiss notification error:', error)
    return NextResponse.json(
      { ok: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
