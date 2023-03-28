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
      name: 'Heading',
      color: '$color',

      variants: {
        type: {
          myValue: {
            fontFamily: '$body',
          },
        },
      } as const,
    })
    const splitStyles = simplifiedGetSplitStyles(CustomText, {
      fontSize: '$1', // should be able to resolve $body from the variant and find the css value
      type: 'myValue',
    })

    expect(
      splitStyles.rulesToInsert
        .find((rule) => rule.property === 'fontSize')
        ?.value.startsWith('var(--')
    ).toBeTruthy()
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
    tag,
    true
  )
}
