import React from 'react'
import { Avatar, XStack } from 'tamagui'

export function AvatarDemo() {
  return (
    <XStack alignItems="center" gap="$6">
      <Avatar circular size="$10">
        <Avatar.Image
          accessibilityLabel="Cam"
          src="https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80"
        />
        <Avatar.Fallback backgroundColor="$blue10" />
      </Avatar>

      <Avatar circular size="$8">
        <Avatar.Image
          accessibilityLabel="Nate Wienert"
          src="https://images.unsplash.com/photo-1531384441138-2736e62e0919?&w=100&h=100&dpr=2&q=80"
        />
        <Avatar.Fallback delayMs={600} backgroundColor="$blue10" />
      </Avatar>
    </XStack>
  )
}
