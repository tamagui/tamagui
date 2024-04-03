import React, { useState } from 'react'
import { ChevronRight } from '@tamagui/lucide-icons'
import { Card, H3, Paragraph, Stack, View, YStack } from 'tamagui'
import { ThemeTintAlt } from '@tamagui/logo'
import { BentoIcon } from './BentoIcon'
import { NextLink } from './NextLink'

export function BentoCard({ link, ...props }) {
  return (
    <NextLink passHref href={link}>
      <Stack
        group="card"
        theme="surface4"
        animation="quickest"
        bg="$background"
        f={1}
        ai="center"
        jc="center"
        w="55%"
        miw="$20"
        h="$17"
        mx="auto"
        padding={0}
        br="$4"
        ov="hidden"
        hoverStyle={{ y: -2, bg: '$color7' }}
        pressStyle={{ y: 2, bg: '$color5' }}
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
            t={'$-8'}
            $lg={{ t: '$-6' }}
            r={'$-0.25'}
            rotateZ={'-5deg'}
            scale={1}
            $group-card-hover={{ t: '$-4.5', r: '$3.5', rotateZ: '0deg', scale: 1.15 }}
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

          <Card.Footer animation="quicker" x={0} $group-card-hover={{ x: 5 }}>
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
