process.env.TAMAGUI_TARGET = 'web'

import { beforeAll, describe, expect, test } from 'vitest'

import config from '../config-default-node'
import { Stack, createTamagui, getSplitStyles } from '../core/src'

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

  test(`prop "paddingStart" value 10 becomes "10px"`, () => {
    const out = getSplitStylesStack(
      {
        paddingStart: 10,
      },
      'input'
    )
    expect(out.rulesToInsert[0]?.value).toEqual('10px')
  })

  // test(`prop "tabIndex" defaults to "0", overrides to "-1" when tag = button`, () => {
  //   expect(
  //     getSplitStylesStack(
  //       {
  //         focusable: true,
  //       },
  //       'button'
  //     )['tabIndex']
  //   ).toEqual('0')

  //   expect(
  //     getSplitStylesStack(
  //       {
  //         tabIndex: '-1',
  //       },
  //       'button'
  //     )['tabIndex']
  //   ).toEqual('-1')
  // })
})

function getSplitStylesStack(props: Record<string, any>, tag?: string) {
  return getSplitStyles(
    props,
    Stack.staticConfig,
    {} as any,
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
