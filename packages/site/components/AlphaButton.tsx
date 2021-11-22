import NextLink from 'next/link'
import React from 'react'
import { Button, YStack } from 'tamagui'

export const AlphaButton = () => (
  <NextLink href="/blog/introducing-tamagui" passHref>
    <YStack tag="a" mx={-6} $sm={{ display: 'none' }}>
      <Button textProps={{ size: '$3' }} br="$6">
        Alpha
      </Button>
    </YStack>
  </NextLink>
)
