import { useSupabase } from '~/features/auth/useSupabaseClient'
import React, { useLayoutEffect } from 'react'
import { YStack, Text, Spinner } from 'tamagui'

export default function Auth() {
  const { supabase } = useSupabase()
  useLayoutEffect(() => {
    exchangeSession(supabase)
  }, [supabase])
  return (
    <YStack flex={1} justifyContent="center" alignItems="center" gap="$8">
      <Text>Authenticating...</Text>
      <Spinner size="large" />
    </YStack>
  )
}

const exchangeSession = async (supabase: ReturnType<typeof useSupabase>['supabase']) => {
  const url = new URL(window.location.href)
  const code = url.searchParams.get('code')

  if (!code) {
    console.error('No auth code found')
    window.close()
    return
  }
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('Error exchanging code for session:', error)
    window.opener?.postMessage({ type: 'SUPABASE_AUTH_SUCCESS' }, window.location.origin)
  }

  window.close()
}
