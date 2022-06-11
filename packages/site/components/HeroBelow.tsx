import { Compass, Cpu, Layers } from '@tamagui/feather-icons'
import { memo } from 'react'
import { H3, Paragraph, XStack, YStack } from 'tamagui'

import { ContainerLarge } from './Container'
import { IconStack } from './IconStack'
import { Link } from './Link'

export const HeroBelow = memo(() => {
  return (
    <ContainerLarge>
      <XStack
        flex={1}
        overflow="hidden"
        maxWidth="100%"
        space="$8"
        flexWrap="nowrap"
        px="$2"
        mb={-8}
        py="$4"
        $sm={{ flexDirection: 'column' }}
      >
        <YStack width="33%" $sm={{ width: 'auto', maxWidth: 500, mx: 'auto' }} flexShrink={1}>
          <IconStack theme="purple_alt2">
            <Cpu size={18} color="var(--colorHover)" />
          </IconStack>
          <H3 color="$color" size="$6" my="$5" mb="$2">
            Performant
          </H3>
          <Paragraph size="$4" theme="alt2">
            The fastest UI kit - thanks to an advanced compiler that handles styles, media queries,
            CSS variables, and tree&nbsp;flattening.
          </Paragraph>
        </YStack>

        <YStack width="33%" $sm={{ width: 'auto', maxWidth: 500, mx: 'auto' }} flexShrink={1}>
          <IconStack theme="green_alt2">
            <Compass size={18} color="var(--colorHover)" />
          </IconStack>
          <H3 color="$color" size="$6" my="$5" mb="$2">
            Easy to adopt
          </H3>
          <Paragraph size="$4" theme="alt2">
            Works with React - Native and Web . Use it as a style library or full component kit.
            Comes with beautiful themes, or BYO.
          </Paragraph>
        </YStack>

        <YStack width="33%" $sm={{ width: 'auto', maxWidth: 500, mx: 'auto' }} flexShrink={1}>
          <IconStack theme="pink_alt2">
            <Layers size={18} color="var(--colorHover)" />
          </IconStack>
          <H3 color="$color" size="$6" my="$5" mb="$2">
            Productive
          </H3>
          <Paragraph size="$4" theme="alt2">
            Typed inline styles without performance downside with themes, tokens, shorthands, media
            queries, and animations.
          </Paragraph>
        </YStack>
      </XStack>
    </ContainerLarge>
  )
})
