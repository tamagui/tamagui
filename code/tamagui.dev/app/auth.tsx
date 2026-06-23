import { AuthClient } from '@supabase/auth-js'
import { useLayoutEffect, useRef } from 'react'
import { Spinner, Text, YStack } from 'tamagui'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// if the code exchange hasn't finished by this point, give up and bounce back
// to /login (popup posts an error toast to the opener instead). previous UX
// showed a "Back to login" button after 6s, which read as a dead-end to users.
const EXCHANGE_TIMEOUT_MS = 3000
const TIMEOUT_MESSAGE = 'Login took too long, please try again'

export default function Auth() {
  const completedRef = useRef(false)

  useLayoutEffect(() => {
    exchangeSession(completedRef)

    const timeoutId = setTimeout(() => {
      if (completedRef.current) return
      completedRef.current = true
      clearPkceState()
      finishPopupOrRedirect(`/login?error=${encodeURIComponent(TIMEOUT_MESSAGE)}`, {
        type: 'SUPABASE_AUTH_ERROR',
        error: TIMEOUT_MESSAGE,
      })
    }, EXCHANGE_TIMEOUT_MS)

    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <YStack
      flex={1}
      justify="center"
      items="center"
      gap="$6"
      width="100%"
      height="100%"
      minH={400}
    >
      <Text>Signing you in...</Text>
      <Spinner size="large" />
    </YStack>
  )
}

// clear stale PKCE verifier so the next attempt starts with a fresh flow
const clearPkceState = () => {
  try {
    localStorage.removeItem('sb-auth-token-code-verifier')
  } catch {}
}

// steal any held navigator.lock on sb-auth-token so a prior hung tab can't block us
const stealAuthLock = async () => {
  try {
    if (typeof navigator !== 'undefined' && navigator.locks) {
      await navigator.locks.request('lock:sb-auth-token', { steal: true }, async () => {})
    }
  } catch {}
}

// dedicated client for the code exchange: no navigator.lock coordination, no auto-refresh.
// /auth does exactly one thing — exchange the PKCE code — so we don't need the shared lock,
// and using a no-op lock avoids hanging behind other tabs' auth ops.
const createExchangeClient = () => {
  return new AuthClient({
    url: `${SUPABASE_URL}/auth/v1`,
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    storageKey: 'sb-auth-token',
    storage: window.localStorage,
    flowType: 'pkce',
    detectSessionInUrl: false,
    autoRefreshToken: false,
    persistSession: true,
    lock: async (_name, _acquireTimeout, fn) => fn(),
  })
}

const finishPopupOrRedirect = (target: string, message: any) => {
  if (window.opener && window.opener !== window) {
    try {
      window.opener.postMessage(message, window.location.origin)
    } catch {}
    window.close()
    // close can be blocked; fall back to redirect after a tick so the user isn't stranded
    setTimeout(() => {
      if (!window.closed) window.location.href = target
    }, 250)
    return
  }
  window.location.href = target
}

const exchangeSession = async (completedRef: { current: boolean }) => {
  const url = new URL(window.location.href)
  const code = url.searchParams.get('code')

  if (!code) {
    if (completedRef.current) return
    completedRef.current = true
    finishPopupOrRedirect('/account', { type: 'SUPABASE_AUTH_SUCCESS' })
    return
  }

  await stealAuthLock()
  if (completedRef.current) return

  const authClient = createExchangeClient()
  const { error } = await authClient.exchangeCodeForSession(code)

  if (completedRef.current) return
  completedRef.current = true

  if (error) {
    console.error('Error exchanging code for session:', error)
    clearPkceState()
    finishPopupOrRedirect(`/login?error=${encodeURIComponent(error.message)}`, {
      type: 'SUPABASE_AUTH_ERROR',
      error: error.message,
    })
    return
  }

  finishPopupOrRedirect('/account', { type: 'SUPABASE_AUTH_SUCCESS' })
}
