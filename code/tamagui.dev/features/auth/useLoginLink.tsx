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
        console.error('Failed to open popup')
        return
      }

      const handleMessage = async (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return
        if (event.data.type === 'SUPABASE_AUTH_SUCCESS') {
          window.removeEventListener('message', handleMessage)
          await supabaseClient.auth.refreshSession()
          userSwr.refresh()
        }
      }

      window.addEventListener('message', handleMessage)
    },
  }
}
