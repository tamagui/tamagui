import * as React from 'react'
import { Avatar } from 'tamagui'
import { useUser } from '~/features/user/useUser'
import { getDefaultAvatarImage } from '~/features/user/getDefaultAvatarImage'

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
              userSwr.data?.userDetails?.full_name ||
                userSwr.data?.session?.user?.email ||
                'User'
            ),
        }}
      />
    </Avatar>
  )
}
