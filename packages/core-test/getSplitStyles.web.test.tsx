process.env.TAMAGUI_TARGET = 'web'

import { beforeAll, describe, expect, test } from 'vitest'

import config from '../config-default-node'
import {
  Stack,
  TamaguiComponent,
  Text,
  createTamagui,
  getSplitStyles,
  styled,
} from '../core/src'

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig())
})

describe('getSplitStyles', () => {
  test(`prop "accessibilityRequired" becomes "aria-required" and "required"`, () => {
    const { viewProps } = simplifiedGetSplitStyles(
      Stack,
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
    const out = simplifiedGetSplitStyles(
      Stack,
      {
        paddingStart: 10,
      },
      'input'
    )
    expect(out.rulesToInsert[0]?.value).toEqual('10px')
  })

  test(`fonts get merged properly`, () => {
    const CustomText = styled(Text, {
      variants: {
        type: {
          myValue: {
            fontFamily: '$mono',
            fontSize: '$10',
          },
        },
      },
    })
    const case1 = simplifiedGetSplitStyles(CustomText, {
      type: 'myValue',
      fontSize: '$2',
    })
    expect(case1.fontFamily).toEqual('$mono')
    expect(case1.rulesToInsert.find((rule) => rule.property === 'fontSize')?.value).toEqual(
      '$2'
    )

    const case2 = simplifiedGetSplitStyles(CustomText, {
      fontSize: '$2',
      type: 'myValue',
      fontFamily: "$body",
    })
    expect(case2.fontFamily).toEqual('$body')
    expect(case2.rulesToInsert.find((rule) => rule.property === 'fontSize')?.value).toEqual(
      '$10'
    )
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

function simplifiedGetSplitStyles(
  component: TamaguiComponent,
  props: Record<string, any>,
  tag?: string
) {
  return getSplitStyles(
    props,
    component.staticConfig,
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
