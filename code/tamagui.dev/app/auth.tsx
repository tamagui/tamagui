import { useSupabase } from '~/features/auth/useSupabaseClient'
import { useLayoutEffect } from 'react'
import { YStack, Text, Spinner } from 'tamagui'

export default function Auth() {
  const { supabase } = useSupabase()

  useLayoutEffect(() => {
    if (supabase) {
      exchangeSession(supabase)
    }
  }, [supabase])

  return (
    <YStack
      flex={1}
      justify="center"
      items="center"
      gap="$8"
      width="100%"
      height="100%"
      minH={400}
    >
      <Text>Authenticating...</Text>
      <Spinner size="large" />
    </YStack>
  )
}

const exchangeSession = async (supabase: ReturnType<typeof useSupabase>['supabase']) => {
  const url = new URL(window.location.href)
  const code = url.searchParams.get('code')

  if (!supabase) {
    console.error(`no supabase?`)
    return
  }

  if (!code) {
    // no code is our new flow we can remove old one
    if (window.opener && window.opener !== window) {
      window.opener.postMessage({ type: 'SUPABASE_AUTH_SUCCESS' }, window.location.origin)
      window.close()
    } else {
      // not a popup, redirect to account
      window.location.href = '/account'
    }
    return
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('Error exchanging code for session:', error)
    alert(`${error}`)
    return
  }

  // if opened as popup, notify opener and close
  if (window.opener && window.opener !== window) {
    window.opener.postMessage({ type: 'SUPABASE_AUTH_SUCCESS' }, window.location.origin)
    window.close()
  } else {
    // not a popup, redirect to account
    window.location.href = '/account'
  }
}
