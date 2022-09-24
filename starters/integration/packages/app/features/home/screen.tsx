import { YStack } from '@my/ui'
import React from 'react'
import { SeparatorTest } from './SeparatorTest'

export function HomeScreen() {
  return (
    <YStack f={1} jc="center" ai="center" p="$4" space>
      <SeparatorTest />
    </YStack>
  )
}
