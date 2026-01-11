import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/api/auth-middleware'
import { getMyMessages, sendGuardMessage } from '@/lib/actions/message-actions'
import { z } from 'zod'

const sendMessageSchema = z.object({
  content: z.string().min(1, 'Message content is required'),
})

export async function GET(req: NextRequest) {
  try {
    const authResult = await authenticateRequest(req)
    if (!authResult.ok) {
      return NextResponse.json(authResult, { status: 401 })
    }

    const result = await getMyMessages()

    return NextResponse.json(result)
  } catch (error) {
    console.error('[API] Get messages error:', error)
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
    const validation = sendMessageSchema.safeParse(body)

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

    const result = await sendGuardMessage(validation.data.content)

    return NextResponse.json(result, {
      status: result.ok ? 201 : 400
    })
  } catch (error) {
    console.error('[API] Send message error:', error)
    return NextResponse.json(
      { ok: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
