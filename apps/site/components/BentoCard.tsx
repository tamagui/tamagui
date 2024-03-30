import React, { useState } from 'react'
import { ChevronRight } from '@tamagui/lucide-icons'
import { Card, H3, Paragraph, Stack, View, YStack } from 'tamagui'
import { ThemeTintAlt } from '@tamagui/logo'
import { BentoIcon } from './BentoIcon'
import { NextLink } from './NextLink'

export function BentoCard({ link, ...props }) {
  const [isHovered, setHovered] = useState(false)

  return (
    <NextLink passHref href={link}>
      <Stack
        theme="surface4"
        animation="quickest"
        bg="$background"
        f={1}
        ai="center"
        jc="center"
        w="$20"
        h="$17"
        mx="auto"
        padding={0}
        br="$4"
        ov="hidden"
        hoverStyle={{ y: -2, bg: '$color7' }}
        pressStyle={{ y: 2, bg: '$color5' }}
        onHoverIn={() => setHovered(true)}
        onHoverOut={() => setHovered(false)}
      >
        <ThemeTintAlt offset={6}>
          <YStack
            fullscreen
            zi={0}
            br="$4"
            style={{
              background: `linear-gradient(transparent, var(--color05))`,
              mixBlendMode: 'color',
            }}
          />
        </ThemeTintAlt>

        <Card tag="a" bg="transparent" {...props}>
          <View
            pos="absolute"
            als="flex-end"
            animation="quicker"
            t={isHovered ? '$-4' : '$-6'}
            r={isHovered ? '$3' : '$-0.25'}
            rotateZ={isHovered ? '0deg' : '-5deg'}
            scale={isHovered ? 1.15 : 1}
          >
            <BentoIcon scale={2.5} />
          </View>
          <Card.Header>
            <YStack ai="center" gap="$5" px="$5">
              <H3>Bento</H3>
              <Paragraph size="$5" theme="alt1">
                A suite of nicely designed copy-paste components and screens.
              </Paragraph>
            </YStack>
          </Card.Header>

          <Card.Footer animation="quicker" x={isHovered ? 5 : 0}>
            <ChevronRight
              size="$1"
              pos="absolute"
              mb="$-5"
              b="$4"
              r="$4"
              color="$color11"
            />
          </Card.Footer>
        </Card>
      </Stack>
    </NextLink>
  )
}
