process.env.TAMAGUI_TARGET = 'web'

import { Stack, createTamagui, getSplitStyles } from '@tamagui/core-node'
import { beforeAll, describe, expect, test } from 'vitest'

import config from '../config-default-node'

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig())
})

describe('getSplitStyles', () => {
  test(`prop "accessibilityRequired" becomes "aria-required" and "required"`, () => {
    const { viewProps } = getSplitStylesStack(
      {
        accessibilityRequired: false,
      },
      'input'
    )

    expect(viewProps['aria-required']).toEqual(false)
    expect(viewProps.required).toEqual(false)
    expect(viewProps.accessibilityRequired).toEqual(undefined)
  })
})

function getSplitStylesStack(props: Record<string, any>, tag?: string) {
  return getSplitStyles(
    props,
    Stack.staticConfig as any,
    {},
    {
      hover: false,
      press: false,
      pressIn: false,
      focus: false,
      unmounted: true,
    },
    undefined,
    undefined,
    tag
  )
}
