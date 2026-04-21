import { AuthClient } from '@supabase/auth-js'
import { useEffect, useLayoutEffect, useState } from 'react'
import { YStack, Text, Spinner, Button, Paragraph } from 'tamagui'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export default function Auth() {
  const [slow, setSlow] = useState(false)

  useLayoutEffect(() => {
    exchangeSession()
  }, [])

  // surface a fallback after 6s so users are never stuck silently
  useEffect(() => {
    const id = setTimeout(() => setSlow(true), 6000)
    return () => clearTimeout(id)
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
      <Text>Authenticating...</Text>
      <Spinner size="large" />
      {slow ? (
        <YStack gap="$2" items="center" maxW={360} px="$4">
          <Paragraph size="$2" color="$color10" text="center">
            Taking longer than expected?
          </Paragraph>
          <Button
            size="$3"
            onPress={() => {
              clearPkceState()
              window.location.href = '/login'
            }}
          >
            Back to login
          </Button>
        </YStack>
      ) : null}
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
      await navigator.locks.request(
        'lock:sb-auth-token',
        { steal: true },
        async () => {}
      )
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

const exchangeSession = async () => {
  const url = new URL(window.location.href)
  const code = url.searchParams.get('code')

  if (!code) {
    finishPopupOrRedirect('/account', { type: 'SUPABASE_AUTH_SUCCESS' })
    return
  }

  await stealAuthLock()

  const authClient = createExchangeClient()
  const { error } = await authClient.exchangeCodeForSession(code)

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
