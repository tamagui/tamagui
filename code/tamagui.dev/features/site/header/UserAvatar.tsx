import { Avatar } from 'tamagui'
import { getDefaultAvatarImage } from '~/features/user/getDefaultAvatarImage'
import { useUser } from '~/features/user/useUser'

export const UserAvatar = ({ size = 28 }: { size?: number }) => {
  const userSwr = useUser()

  return (
    <Avatar circular size={size}>
      <Avatar.Image
        width={size}
        height={size}
        source={{
          width: size,
          height: size,
          uri:
            userSwr.data?.userDetails?.avatar_url ||
            getDefaultAvatarImage(
              userSwr.data?.userDetails?.full_name || userSwr.data?.user?.email || 'User'
            ),
        }}
      />
    </Avatar>
  )
}
