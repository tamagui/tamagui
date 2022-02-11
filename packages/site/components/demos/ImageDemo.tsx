import React from 'react'
import { Image, XStack } from 'tamagui'

export function ImageDemo() {
  return (
    <XStack space>
      <Image source={{ uri: 'http://placekitten.com/200/300' }} width={200} height={300} />
    </XStack>
  )
}
