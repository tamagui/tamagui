import NextLink from 'next/link'
import React from 'react'
import { Button, Paragraph, YStack } from 'tamagui'

export const AlphaButton = () => (
  <YStack $sm={{ width: 0, height: 0, overflow: 'hidden', mx: -4 }}>
    <NextLink href="/blog/tamagui-enters-beta-themes-and-animations" passHref>
      <Paragraph
        theme="orange_alt2"
        p="$2"
        px="$3"
        cursor="pointer"
        opacity={0.9}
        hoverStyle={{ opacity: 1 }}
        tag="a"
        size="$3"
      >
        New
      </Paragraph>
    </NextLink>
  </YStack>
)
