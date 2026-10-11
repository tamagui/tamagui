import type { ComponentSize } from '@tamagui/core'
import { useState } from 'react'
import { Text, View } from 'tamagui'
import { tone } from '../../tone'
import { Avatar, avatarPx } from './components/Avatar'

const people = [
  'https://images.unsplash.com/photo-1588798204072-e5f8e649d269?w=100',
  'https://images.unsplash.com/photo-1736754079614-8b43bcba9926?w=100',
  'https://images.unsplash.com/photo-1588798204072-e5f8e649d269?w=100',
  'https://images.unsplash.com/photo-1736754079614-8b43bcba9926?w=100',
]

/** ------ EXAMPLE ------ */
export function AvatarsGrouped() {
  return (
    <View items="center" justify="center" gap="8" p="4">
      <AvatarGroup size="sm" images={people} extra={3} />
      <AvatarGroup size="lg" images={people} extra={12} />
    </View>
  )
}

function AvatarGroup({
  size,
  images,
  extra,
}: {
  size: ComponentSize
  images: string[]
  extra?: number
}) {
  const [open, setOpen] = useState(false)
  const px = avatarPx(size)
  // each face covers a third of the one before it, and fans out on hover
  const overlap = Math.round(px / 3)
  const spread = open ? Math.round(px / 6) : 0

  return (
    <View
      flexDirection="row"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onPressIn={() => setOpen(true)}
      onPressOut={() => setOpen(false)}
    >
      {images.map((src, index) => (
        <View
          key={index}
          z={index}
          ml={index ? -overlap : 0}
          x={spread * index}
          transition="200ms"
          rounded="full"
          borderWidth={2}
          borderColor="background"
        >
          <Avatar size={size}>
            <Avatar.Content circular>
              <Avatar.Image objectFit="cover" src={src} />
              <Avatar.Fallback bg={tone.fill} />
            </Avatar.Content>
          </Avatar>
        </View>
      ))}
      {extra ? (
        <View
          z={images.length}
          ml={-overlap}
          x={spread * images.length}
          transition="200ms"
          width={px + 4}
          height={px + 4}
          rounded="full"
          borderWidth={2}
          borderColor="background"
          bg={tone.fill}
          items="center"
          justify="center"
        >
          <Text
            fontFamily="body"
            fontWeight="600"
            color="color-11"
            fontSize={Math.round(px / 3)}
          >
            +{extra}
          </Text>
        </View>
      ) : null}
    </View>
  )
}
