import { useSupabase } from '~/features/auth/useSupabaseClient'
import { useEffect, useLayoutEffect, useState } from 'react'
import { YStack, Text, Spinner, Button, Paragraph } from 'tamagui'

export default function Auth() {
  const { supabase } = useSupabase()
  const [slow, setSlow] = useState(false)

  useLayoutEffect(() => {
    if (supabase) {
      exchangeSession(supabase)
    }
  }, [supabase])

  // surface a fallback after 8s so users are never stuck silently
  useEffect(() => {
    const id = setTimeout(() => setSlow(true), 8000)
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

const exchangeSession = async (supabase: ReturnType<typeof useSupabase>['supabase']) => {
  const url = new URL(window.location.href)
  const code = url.searchParams.get('code')

  if (!supabase) {
    console.error(`no supabase?`)
    finishPopupOrRedirect('/login?error=client_unavailable', {
      type: 'SUPABASE_AUTH_ERROR',
      error: 'client_unavailable',
    })
    return
  }

  if (!code) {
    finishPopupOrRedirect('/account', { type: 'SUPABASE_AUTH_SUCCESS' })
    return
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code)

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
