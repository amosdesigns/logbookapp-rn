import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/api/mobile-auth'
import { getLogs, createLog } from '@/lib/actions/logs'
import { createLogSchema } from '@/lib/validations/log'

export async function GET(req: NextRequest) {
  try {
    const authResult = await authenticateRequest(req)
    if (!authResult.ok) {
      return NextResponse.json(authResult, { status: 401 })
    }

    // Parse query params
    const { searchParams } = new URL(req.url)
    const params = {
      locationId: searchParams.get('locationId') || undefined,
      type: searchParams.get('type') || undefined,
      status: searchParams.get('status') || undefined,
      search: searchParams.get('search') || undefined,
      year: searchParams.get('year') || undefined,
      month: searchParams.get('month') || undefined,
      dayOfWeek: searchParams.get('dayOfWeek') || undefined,
    }

    const result = await getLogs(params)

    return NextResponse.json(result)
  } catch (error) {
    console.error('[API] Get logs error:', error)
    return NextResponse.json(
      { ok: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await authenticateRequest(req)
    if (!authResult.ok) {
      return NextResponse.json(authResult, { status: 401 })
    }

    const body = await req.json()
    const validation = createLogSchema.safeParse(body)

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

    const result = await createLog(validation.data)

    return NextResponse.json(result, {
      status: result.ok ? 201 : 400
    })
  } catch (error) {
    console.error('[API] Create log error:', error)
    return NextResponse.json(
      { ok: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
