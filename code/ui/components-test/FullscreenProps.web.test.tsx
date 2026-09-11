import { ScrollView } from '@tamagui/scroll-view'
import { YStack } from '@tamagui/stacks'
import { describe, expect, test } from 'vitest'

function variantNames(component: any) {
  return Object.keys(component.staticConfig?.variants ?? {})
}

describe('fullscreen prop removal', () => {
  test('does not register fullscreen as a stack or scroll-view variant', () => {
    expect(variantNames(YStack)).not.toContain('fullscreen')
    expect(variantNames(ScrollView)).not.toContain('fullscreen')
  })
})
