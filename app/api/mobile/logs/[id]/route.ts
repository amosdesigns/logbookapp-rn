import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/api/auth-middleware'
import { getLogById, updateLog, deleteLog } from '@/lib/actions/logs'
import { updateLogSchema } from '@/lib/validations/log'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await authenticateRequest(req)
    if (!authResult.ok) {
      return NextResponse.json(authResult, { status: 401 })
    }

    const result = await getLogById(params.id)

    return NextResponse.json(result, {
      status: result.ok ? 200 : 404
    })
  } catch (error) {
    console.error('[API] Get log error:', error)
    return NextResponse.json(
      { ok: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await authenticateRequest(req)
    if (!authResult.ok) {
      return NextResponse.json(authResult, { status: 401 })
    }

    const body = await req.json()
    const validation = updateLogSchema.safeParse(body)

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

    const result = await updateLog(params.id, validation.data)

    return NextResponse.json(result, {
      status: result.ok ? 200 : 400
    })
  } catch (error) {
    console.error('[API] Update log error:', error)
    return NextResponse.json(
      { ok: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await authenticateRequest(req)
    if (!authResult.ok) {
      return NextResponse.json(authResult, { status: 401 })
    }

    const result = await deleteLog(params.id)

    return NextResponse.json(result, {
      status: result.ok ? 200 : 400
    })
  } catch (error) {
    console.error('[API] Delete log error:', error)
    return NextResponse.json(
      { ok: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
