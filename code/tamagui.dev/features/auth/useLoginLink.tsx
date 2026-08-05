import { toast } from 'tamagui'
import { navigateToInternalPath } from '~/features/security/navigation'
import { useUser } from '../user/useUser'
import { useSupabaseClient } from './useSupabaseClient'

export const useLoginLink = () => {
  const userSwr = useUser()
  const supabaseClient = useSupabaseClient()

  return {
    handleLogin: async (e: any) => {
      e.preventDefault()

      // Open popup for GitHub auth
      const width = 600
      const height = 800
      const left = window.screenX + (window.innerWidth - width) / 2
      const top = window.screenY + (window.innerHeight - height) / 2

      // Open popup with the auth URL
      const popup = window.open(
        `${window.location.origin}/login`,
        'Login with GitHub',
        `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no`
      )

      if (!popup) {
        // popup was blocked, show toast and redirect after delay
        toast('Popup blocked, redirecting to login...')
        setTimeout(() => {
          navigateToInternalPath('/login')
        }, 2000)
        return
      }

      const handleMessage = async (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return
        if (event.source !== popup) return
        if (!isAuthPopupMessage(event.data)) return

        if (event.data.type === 'SUPABASE_AUTH_SUCCESS') {
          window.removeEventListener('message', handleMessage)
          await supabaseClient.auth.refreshSession()
          userSwr.refresh()
        } else if (event.data.type === 'SUPABASE_AUTH_ERROR') {
          window.removeEventListener('message', handleMessage)
          toast('Login failed', {
            description: event.data.error || 'Please try again.',
          })
        }
      }

      window.addEventListener('message', handleMessage)
    },
  }
}

function isAuthPopupMessage(
  data: unknown
): data is
  | { type: 'SUPABASE_AUTH_SUCCESS' }
  | { type: 'SUPABASE_AUTH_ERROR'; error?: string } {
  if (!data || typeof data !== 'object') {
    return false
  }

  const message = data as { type?: unknown; error?: unknown }

  if (message.type === 'SUPABASE_AUTH_SUCCESS') {
    return true
  }

  if (message.type !== 'SUPABASE_AUTH_ERROR') {
    return false
  }

  return message.error === undefined || typeof message.error === 'string'
}
