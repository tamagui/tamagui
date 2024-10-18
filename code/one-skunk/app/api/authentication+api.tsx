/**
 * This endpoint will handle user authentication including sign-up, login, update, delete, and logout.
 * We will use the Node.js standard library for password hashing and verification.
 * The methods will be:
 * - GET: Check if the user is logged in
 * - POST: Sign-up a new user
 * - PUT: Update user details
 * - DELETE: Delete a user account
 * - GET (logout): Log out the user using a query string parameter
 */

import { eq } from 'drizzle-orm'
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto'
import { db } from '~/code/db/connection'
import { users } from '~/code/db/schema'

// Helper function to hash passwords
const hashPassword = (password: string) => {
  const salt = randomBytes(16).toString('hex')
  const hash = createHash('sha256')
    .update(password + salt)
    .digest('hex')
  return `${salt}:${hash}`
}

// Helper function to verify passwords
const verifyPassword = (password: string, storedHash: string) => {
  const [salt, originalHash] = storedHash.split(':')
  const hash = createHash('sha256')
    .update(password + salt)
    .digest('hex')
  return timingSafeEqual(Buffer.from(hash), Buffer.from(originalHash))
}

// Helper function to get session from cookies
const getSession = (request: Request) => {
  const cookie = request.headers.get('Cookie')
  if (!cookie) return null
  const sessionCookie = cookie.split('; ').find((c) => c.startsWith('session='))
  if (!sessionCookie) return null
  const session = JSON.parse(decodeURIComponent(sessionCookie.split('=')[1]))
  return session
}

// Helper function to destroy session
const destroySession = (session: any) => {
  // Invalidate the session (implementation depends on your session management)
  // For example, you could remove the session from a database or cache
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const action = url.searchParams.get('action')

  if (action === 'logout') {
    // Log out the user by destroying the session
    const session = getSession(request)
    if (session) {
      destroySession(session)
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }
    return new Response(JSON.stringify({ error: 'No active session' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Check if the user is logged in
  const session = getSession(request)
  if (session?.user) {
    return new Response(JSON.stringify({ loggedIn: true, user: session.user }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }
  return new Response(JSON.stringify({ loggedIn: false }), {
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function POST(request: Request) {
  const { username, email, password } = await request.json()

  // Hash the password
  const passwordHash = hashPassword(password)

  try {
    // Insert the new user into the database
    const newUser = await db
      .insert(users)
      .values({ username, email, passwordHash })
      .returning({ id: users.id, username: users.username, email: users.email })
      .then((res) => res[0])

    return new Response(JSON.stringify(newUser), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to sign up' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export async function PUT(request: Request) {
  const { id, username, email, password } = await request.json()

  // Hash the new password if provided
  const passwordHash = password ? hashPassword(password) : undefined

  try {
    // Update the user details in the database
    const updatedUser = await db
      .update(users)
      .set({ username, email, ...(passwordHash && { passwordHash }) })
      .where(eq(users.id, id))
      .returning({ id: users.id, username: users.username, email: users.email })
      .then((res) => res[0])

    return new Response(JSON.stringify(updatedUser), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update user' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export async function DELETE(request: Request) {
  const { id } = await request.json()

  try {
    // Delete the user from the database
    await db.delete(users).where(eq(users.id, id))

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to delete user' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
