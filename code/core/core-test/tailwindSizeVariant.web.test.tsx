import { beforeAll, describe, expect, test } from 'vitest'

import { defaultConfig } from '@tamagui/config/v6'
import { Text, createTamagui } from '../web/src'
import { simplifiedGetSplitStyles } from './utils'

// size-* maps to the tamagui `size` compound variant. the variant EFFECT is
// component-specific (SizableText/Button expose it; base View/Text don't), so it can
// only be exercised end-to-end in the real app — this test just proves the class is
// recognized and consumed into the `size` prop rather than passed through as dead CSS.
beforeAll(() => {
  createTamagui({
    ...(defaultConfig as any),
    settings: {
      ...(defaultConfig as any).settings,
      styleMode: 'tamagui-and-tailwind',
    },
  })
})

function leftover(className: string) {
  const styles = simplifiedGetSplitStyles(Text, { className } as any)
  return styles.viewProps?.className || ''
}

describe('styleMode size variant utility', () => {
  test('size-5 is consumed (recognized as the size variant, not left as a dead class)', () => {
    expect(leftover('size-5')).not.toContain('size-5')
  })

  test('size-[14px] is consumed', () => {
    expect(leftover('size-[14px]')).not.toContain('size-[14px]')
  })

  test('unknown class is still preserved', () => {
    expect(leftover('foo-bar')).toContain('foo-bar')
  })
})
