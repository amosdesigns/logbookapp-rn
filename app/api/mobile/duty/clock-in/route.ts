import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/api/mobile-auth'
import { clockIn } from '@/lib/actions/duty-session-actions'
import { z } from 'zod'

const clockInSchema = z.object({
  locationId: z.string().cuid().optional(),
  shiftId: z.string().cuid().optional(),
})

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate
    const authResult = await authenticateRequest(req)
    if (!authResult.ok) {
      return NextResponse.json(authResult, { status: 401 })
    }

    // 2. Parse and validate body
    const body = await req.json()
    const validation = clockInSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          ok: false,
          message: 'Invalid request data',
          meta: { errors: validation.error.flatten() }
        },
        { status: 400 }
      )
    }

    // 3. Call server action
    // Note: clockIn() internally calls auth() to get the authenticated user
    const result = await clockIn(validation.data)

    // 4. Return result
    return NextResponse.json(result, {
      status: result.ok ? 200 : 400
    })
  } catch (error) {
    console.error('[API] Clock in error:', error)
    return NextResponse.json(
      { ok: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
