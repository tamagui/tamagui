import NextLink from 'next/link'
import React from 'react'
import { Button, SizableText, YStack } from 'tamagui'

export const AlphaButton = () => (
  <YStack $sm={{ width: 0, overflow: 'hidden', mx: -18 }}>
    <NextLink href="/blog/introducing-tamagui" passHref>
      <YStack tag="a" mx={-6}>
        <Button theme="orange" br="$6">
          <SizableText size="$3" color="$color3">
            New
          </SizableText>
        </Button>
      </YStack>
    </NextLink>
  </YStack>
)
