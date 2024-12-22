import { Stack, createTamagui, getSplitStyles } from '@tamagui/core'
import { beforeAll, describe, expect, test } from 'vitest'

import config from '../config-default'

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig('native'))
})

describe('getSplitStyles', () => {
  test(`prop "accessibilityRequired" becomes "aria-required" and "required"`, () => {
    const { style } = getSplitStylesStack({
      columnGap: 10,
      rowGap: 10,
    })

    expect(style?.columnGap).toBe(10)
    expect(style?.rowGap).toBe(10)
  })
})

function getSplitStylesStack(props: Record<string, any>, tag?: string) {
  return getSplitStyles(
    props,
    Stack.staticConfig,
    {} as any,
    '',
    {
      hover: false,
      press: false,
      pressIn: false,
      focus: false,
      unmounted: true,
      disabled: false,
      focusVisible: false,
    },
    {
      isAnimated: false,
    },
    undefined,
    undefined,
    tag
  )
}
