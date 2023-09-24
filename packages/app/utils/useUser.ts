import { useSessionContext } from './supabase/useSessionContext'

import { api } from 'app/utils/api'
export type User = ReturnType<typeof useUser>
export const useUser = () => {
  const { session, isLoading: isLoadingSession } = useSessionContext()
  const user = session?.user

  const {
    data: profile,
    isLoading: isLoadingProfile,
    refetch,
  } = api.me.profile.read.useQuery()

  const avatarUrl = (function () {
    if (profile?.avatar_url) return profile.avatar_url
    if (typeof user?.user_metadata.avatar_url === 'string')
      return user.user_metadata.avatar_url

    const params = new URLSearchParams()
    const name = profile?.first_name || user?.email || ''
    params.append('name', name)
    params.append('size', '256') // will be resized again by NextImage/SolitoImage
    return `https://ui-avatars.com/api.jpg?${params.toString()}`
  })()

  return {
    session,
    user,
    profile,
    avatarUrl,
    updateProfile: () => refetch(),
    isLoadingSession,
    isLoadingProfile,
    isLoading: isLoadingSession || isLoadingProfile,
  }
}
