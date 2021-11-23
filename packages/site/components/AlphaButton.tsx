import NextLink from 'next/link'
import React from 'react'
import { Button, YStack } from 'tamagui'

export const AlphaButton = () => (
  <YStack $sm={{ width: 0, overflow: 'hidden', mx: -18 }}>
    <NextLink href="/blog/introducing-tamagui" passHref>
      <YStack tag="a" mx={-6}>
        <Button theme="orange" textProps={{ size: '$3', color: '$color3' }} br="$6">
          New
        </Button>
      </YStack>
    </NextLink>
  </YStack>
)
