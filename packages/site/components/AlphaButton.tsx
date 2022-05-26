import { Tag } from '@tamagui/feather-icons'
import NextLink from 'next/link'
import { Button, YStack } from 'tamagui'

export const AlphaButton = () => {
  return (
    <NextLink href="/blog/tamagui-enters-beta-themes-and-animations" passHref>
      <Button
        accessibilityLabel="Beta blog post"
        rotate="1.25deg"
        mx="$1"
        theme="pink_alt2"
        cursor="pointer"
        opacity={0.9}
        hoverStyle={{ opacity: 1 }}
        tag="a"
        size="$2"
        icon={Tag}
        $sm={{ disp: 'none' }}
      >
        Beta
      </Button>
    </NextLink>
  )
}
