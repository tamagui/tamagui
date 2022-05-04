import { Tag } from '@tamagui/feather-icons'
import NextLink from 'next/link'
import { Button, YStack } from 'tamagui'

export const AlphaButton = () => {
  return (
    <YStack $sm={{ width: 0, height: 0, overflow: 'hidden', mx: -4 }}>
      <NextLink href="/blog/tamagui-enters-beta-themes-and-animations" passHref>
        <Button
          debug="verbose"
          rotate="-2.5deg"
          theme="pink_alt2"
          cursor="pointer"
          opacity={0.9}
          hoverStyle={{ opacity: 1 }}
          tag="a"
          size="$2"
          icon={Tag}
        >
          Beta
        </Button>
      </NextLink>
    </YStack>
  )
}
