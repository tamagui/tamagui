import { Avatar } from 'tamagui'
import { getDefaultAvatarImage } from '~/features/user/getDefaultAvatarImage'
import { useUser } from '~/features/user/useUser'

export const UserAvatar = ({ size = 28 }: { size?: number }) => {
  const userSwr = useUser()

  // Try userDetails first, then fall back to user metadata from auth
  const avatarUrl =
    userSwr.data?.userDetails?.avatar_url || userSwr.data?.user?.user_metadata?.avatar_url

  return (
    <Avatar circular size={size}>
      <Avatar.Image
        width={size}
        height={size}
        source={{
          width: size,
          height: size,
          uri:
            avatarUrl ||
            getDefaultAvatarImage(
              userSwr.data?.userDetails?.full_name ||
                userSwr.data?.user?.user_metadata?.name ||
                userSwr.data?.user?.email ||
                'User'
            ),
        }}
      />
    </Avatar>
  )
}
