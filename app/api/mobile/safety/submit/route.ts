import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/api/auth-middleware'
import { submitSafetyChecklist } from '@/lib/actions/safety-checklist-actions'
import { z } from 'zod'

const submitChecklistSchema = z.object({
  dutySessionId: z.string().cuid(),
  locationId: z.string().cuid(),
  items: z.array(
    z.object({
      itemId: z.string().cuid(),
      checked: z.boolean(),
      notes: z.string().optional(),
    })
  ),
})

export async function POST(req: NextRequest) {
  try {
    const authResult = await authenticateRequest(req)
    if (!authResult.ok) {
      return NextResponse.json(authResult, { status: 401 })
    }

    const body = await req.json()
    const validation = submitChecklistSchema.safeParse(body)

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

    const result = await submitSafetyChecklist(validation.data)

    return NextResponse.json(result, {
      status: result.ok ? 201 : 400
    })
  } catch (error) {
    console.error('[API] Submit checklist error:', error)
    return NextResponse.json(
      { ok: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
