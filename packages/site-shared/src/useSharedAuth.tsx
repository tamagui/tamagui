import { Session, SupabaseClient } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'

const ACCESS_TOKEN_COOKIE = 'tamagui-access-token'
const REFRESH_TOKEN_COOKIE = 'tamagui-refresh-token'
/**
 * used to share auth between tamagui.dev and other apps
 */
export const useSharedAuth = (
  supabase: SupabaseClient,
  opts?: {
    onAuthenticated?: (session: Session) => void
    onUnauthenticated?: () => void
  }
) => {
  useEffect(() => {
    const updateAuthIfAvailable = async () => {
      const cookies = document.cookie.split(/\s*;\s*/).map((cookie) => cookie.split('='))
      const accessTokenCookie = cookies.find((x) => x[0] == ACCESS_TOKEN_COOKIE)
      const refreshTokenCookie = cookies.find((x) => x[0] == REFRESH_TOKEN_COOKIE)

      if (accessTokenCookie && refreshTokenCookie) {
        try {
          await supabase.auth.setSession({
            access_token: accessTokenCookie[1],
            refresh_token: refreshTokenCookie[1],
          })
          supabase.auth.getUser()
          const session = await supabase.auth.getSession()
          if (session.error) throw new Error(session.error.message)
          if (!session.data.session) throw new Error('No session found.')
          await opts?.onAuthenticated?.(session.data.session)
        } catch {
          await opts?.onUnauthenticated?.()
        }
      } else {
        await opts?.onUnauthenticated?.()
      }
    }
    updateAuthIfAvailable()
  }, [supabase])
  useEffect(() => {
    const listener = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        // delete cookies on sign out
        const expires = new Date(0).toUTCString()
        document.cookie = `${ACCESS_TOKEN_COOKIE}=; Domain=${location.hostname}; path=/; expires=${expires}; SameSite=Lax; secure`
        document.cookie = `${REFRESH_TOKEN_COOKIE}=; Domain=${location.hostname}; path=/; expires=${expires}; SameSite=Lax; secure`
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (!session) return
        const maxAge = 100 * 365 * 24 * 60 * 60 // 100 years, never expires
        document.cookie = `${ACCESS_TOKEN_COOKIE}=${session.access_token}; Domain=${location.hostname}; path=/; max-age=${maxAge}; SameSite=Lax; secure`
        document.cookie = `${REFRESH_TOKEN_COOKIE}=${session.refresh_token}; Domain=${location.hostname}; path=/; max-age=${maxAge}; SameSite=Lax; secure`
      }
    })
    return () => listener.data.subscription.unsubscribe()
  }, [supabase])
}
