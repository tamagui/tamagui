import { getAccessToken } from '~/features/auth/useSupabaseClient'

/**
 * authenticated fetch helper for client-side API calls
 *
 * IMPORTANT: all API calls that require authentication must use this helper
 * or manually include the Authorization header. cookies alone are not reliable
 * for auth in production due to cross-origin/SameSite issues.
 *
 * the server-side ensureAuth function checks:
 * 1. Authorization header (Bearer token) - preferred
 * 2. cookies - fallback, but unreliable in some environments
 *
 * usage:
 *   const response = await authFetch('/api/create-subscription', {
 *     method: 'POST',
 *     body: JSON.stringify({ ... }),
 *   })
 */
export async function authFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const accessToken = await getAccessToken()

  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`)
  }

  return fetch(url, {
    ...options,
    headers,
  })
}
