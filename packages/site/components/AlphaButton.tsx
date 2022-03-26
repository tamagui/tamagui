import NextLink from 'next/link'
import React from 'react'
import { Button, Paragraph, YStack } from 'tamagui'

export const AlphaButton = () => (
  <YStack $sm={{ width: 0, overflow: 'hidden', mx: -18 }}>
    <NextLink href="/blog/tamagui-enters-beta-themes-and-animations" passHref>
      <Button tag="a" mx={-6} theme="orange" br="$6">
        <Paragraph cursor="inherit" theme="alt2" size="$3">
          New
        </Paragraph>
      </Button>
    </NextLink>
  </YStack>
)
