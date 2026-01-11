"use server"

import { auth } from '@clerk/nextjs/server'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { Result } from '@/lib/utils/RenderError'
import type { User } from '@prisma/client'

/**
 * Validates Clerk token from Authorization header
 * Returns userId if valid, error if not
 */
export async function validateClerkToken(
  req: NextRequest
): Promise<Result<{ userId: string }>> {
  try {
    // Get Clerk session from request
    const { userId } = await auth()

    if (!userId) {
      return { ok: false, message: 'Unauthorized - No valid session' }
    }

    return { ok: true, data: { userId } }
  } catch (error) {
    console.error('[AUTH_MIDDLEWARE] Token validation error:', error)
    return { ok: false, message: 'Invalid authentication token' }
  }
}

/**
 * Gets user from database by Clerk ID
 * Syncs user if not found
 */
export async function getUserFromClerkId(
  clerkUserId: string
): Promise<Result<User>> {
  try {
    // First, try to find user by Clerk ID
    let user = await prisma.user.findUnique({
      where: { clerkId: clerkUserId },
    })

    // If not found, try to sync (handles new users)
    if (!user) {
      console.log('[AUTH_MIDDLEWARE] User not found, attempting sync...')
      // Import sync function
      const { syncUserToDatabase } = await import('@/lib/auth/sync-user')
      const syncResult = await syncUserToDatabase()

      if (!syncResult.success || !syncResult.user) {
        return { ok: false, message: 'Failed to sync user' }
      }

      user = syncResult.user
    }

    return { ok: true, data: user }
  } catch (error) {
    console.error('[AUTH_MIDDLEWARE] Error fetching user:', error)
    return { ok: false, message: 'Failed to fetch user' }
  }
}

/**
 * Combined auth check - validates token and gets user
 * Use this in all API routes
 */
export async function authenticateRequest(
  req: NextRequest
): Promise<Result<User>> {
  const tokenResult = await validateClerkToken(req)

  if (!tokenResult.ok) {
    return tokenResult
  }

  return await getUserFromClerkId(tokenResult.data.userId)
}
