import { useState } from 'react'
import type { SizeTokens } from 'tamagui'
import { View, getTokenValue } from 'tamagui'
import { Avatar } from './components/Avatar'

const items = [1, 2, 3, 4, 5]

/** ------ EXAMPLE ------ */
export function AvatarsGrouped() {
  return (
    <View flex={1} items="center" justify="center" gap="6" p="4">
      <AvatarGroup
        size="3"
        items={items.map((index) => (
          <Item
            key={index}
            size="3"
            imageUrl={`https://images.unsplash.com/photo-1588798204072-e5f8e649d269?w=100`}
          />
        ))}
      />
      <AvatarGroup
        size="6"
        items={items.map((index) => (
          <Item
            key={index}
            size="6"
            imageUrl={`https://images.unsplash.com/photo-1736754079614-8b43bcba9926?w=100`}
          />
        ))}
      />
    </View>
  )
}

function AvatarGroup({
  size,
  items,
}: {
  size: SizeTokens
  items: React.ReactNode[]
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <View
      flexDirection="row"
      onTouchStart={() => setHovered(true)}
      onTouchEnd={() => setHovered(false)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {items.map((item, index) => (
        <View
          key={index}
          z={index}
          ml={index !== 0 ? -(getTokenValue(size as any) ?? 20) * 1.5 : undefined}
          style={{ transition: 'transform 150ms ease' }}
          x={0}
          {...(hovered && {
            x: index * 8,
          })}
        >
          {item}
        </View>
      ))}
    </View>
  )
}

AvatarsGrouped.fileName = 'AvatarsGrouped'

function Item({ imageUrl, size }: { imageUrl: string; size: SizeTokens }) {
  return (
    <Avatar size={size}>
      <Avatar.Content circular>
        <Avatar.Image objectFit="cover" src={imageUrl} />
        <Avatar.Fallback bg="background" />
      </Avatar.Content>
    </Avatar>
  )
}
