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

  test(`font props get the font family, regardless of the order`, () => {
    expect(
      simplifiedGetSplitStyles(Text, {
        fontSize: '$1',
      }).rulesToInsert.find((rule) => rule.property === 'fontSize')?.value
    ).toEqual('$1') // no family provided - this is expected

    expect(
      simplifiedGetSplitStyles(Text, {
        fontSize: '$1',
        fontFamily: '$body',
      }).rulesToInsert.find((rule) => rule.property === 'fontSize')?.value
    ).toEqual('var(--f-si-1)')

    expect(
      simplifiedGetSplitStyles(Text, {
        fontFamily: '$body',
        fontSize: '$1',
      }).rulesToInsert.find((rule) => rule.property === 'fontSize')?.value
    ).toEqual('var(--f-si-1)')
  })

  test(`font props get the font family from a variant, regardless of the order`, () => {
    const CustomText = styled(Text, {
      variants: {
        type: {
          myValue: {
            fontFamily: '$body',
          },
        },
      } as const,
    })

    expect(
      simplifiedGetSplitStyles(CustomText, {
        fontSize: '$1',
        type: 'myValue',
      }).rulesToInsert.find((rule) => rule.property === 'fontSize')?.value
    ).toEqual('var(--f-si-1)')

    expect(
      simplifiedGetSplitStyles(CustomText, {
        type: 'myValue',
        fontSize: '$1',
      }).rulesToInsert.find((rule) => rule.property === 'fontSize')?.value
    ).toEqual('var(--f-si-1)')
  })

  test(`z-index resolves to respective tokens`, () => {
    const styles = simplifiedGetSplitStyles(Text, {
      zIndex: '$1',
    })
    expect(styles.rulesToInsert[0].property === 'zIndex').toBeTruthy()
    expect(styles.rulesToInsert[0].value).toEqual('var(--zIndex-2)')
  })

  // this test is failing:
  // TODO: support this - might need the getSplitStyles refactor (unifying getSubStyle)
  // + write another similar test for pseudos
  // test(`fonts get merged correctly if fontSize is media activates font family`, () => {
  //   const CustomText = styled(Text, {
  //     variants: {
  //       type: {
  //         myValue: {
  //           fontFamily: '$body',
  //         },
  //       },
  //     } as const,
  //   })
  //   const splitStyles = simplifiedGetSplitStyles(
  //     CustomText,
  //     {
  //       type: 'myValue',
  //       $xs: {
  //         fontSize: '$1',
  //       },
  //     },
  //     'p',
  //     { xs: true }
  //   )

  //   const fontSizeRule = splitStyles.rulesToInsert.find(
  //     (rule) => rule.property === 'fontSize'
  //   )

  //   expect(fontSizeRule?.rules[0].includes('font-size:var(--f-si-1)')).toBeTruthy()
  // })

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
  tag?: string,
  mediaState?: Record<string, any>
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
      mediaState,
    },
    undefined,
    undefined,
    tag,
    true
  )
}
