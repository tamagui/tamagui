import {
  GetProps,
  GetVariantProps,
  GetVariants,
  ShorthandStyleProps,
  Shorthands,
  Stack,
  StackProps,
  StackStyleProps,
  StaticComponent,
  TamaguiConfig,
  TamaguiStylesBase,
  TamaguiThemedStackStyleProps,
  ThemeKeyVariables,
  createTamagui,
  styled,
} from '@tamagui/core'

import { shorthands, tokens } from './testConstants'
import { themes } from './testThemes'

type abc = TamaguiThemedStackStyleProps & ShorthandStyleProps
type asd2 = abc['borderColor']

type x2 = Shorthands['bc']
type x = Shorthands['p']
type x3 = Shorthands['s']
type y = Shorthands['asdasd']
type asd = ShorthandStyleProps['bc']
type x22222 = TamaguiThemedStackStyleProps['borderColor']
type x333 = StackStyleProps['borderColor']
type x222 = TamaguiStylesBase['borderColor']
type x22 = StackProps['borderColor']
type sz = ThemeKeyVariables
type asdsad = keyof TamaguiConfig['themes']

const config = createTamagui({
  defaultTheme: 'light',
  disableRootThemeClass: true,
  shorthands,
  themes,
  tokens,
  media: {
    xs: { maxWidth: 660 },
    notXs: { minWidth: 660 + 1 },
    sm: { maxWidth: 860 },
    notSm: { minWidth: 860 + 1 },
    md: { minWidth: 980 },
    notMd: { minWidth: 980 + 1 },
    lg: { minWidth: 1120 },
    notLg: { minWidth: 1120 + 1 },
    xl: { minWidth: 1280 },
    notXl: { minWidth: 1280 + 1 },
    xxl: { minWidth: 1420 },
    short: { maxHeight: 820 },
    tall: { minHeight: 820 },
    hoverNone: { hover: 'none' },
    pointerCoarse: { pointer: 'coarse' },
  },
})

type OurConfig = typeof config

declare module '@tamagui/core' {
  export interface TamaguiCustomConfig extends OurConfig {}
}

export default config

const YStack = styled(Stack, {
  variants: {
    lala: {
      test: {
        x: 10,
      },
    },
    bg: {
      'ok wut': {
        backgroundColor: 'red',
      },
    },
  },
})

const ZStack = styled(YStack, {
  variants: {
    bg: {
      alternate: {
        backgroundColor: 'blue',
      },
    },
    spread: {
      '...size': (val, { tokens, theme, props }) => ({ width: val }),
    },
    // typed: {
    //   '[number]': (val) => ({ height: val }),
    // },
    specific: {
      1: { height: 1 },
    },
  },
})

type z1 = GetProps<typeof YStack>
type z11 = z1['bg']

type z2 = GetProps<typeof ZStack>
type zSV = GetVariants<typeof ZStack>
type zVP = GetVariantProps<zSV>
type z2222 = z2['bg']

export const x = (props: StackProps) => {
  return (
    <>
      <YStack p={10} width="$1" x="$2" y="$s" borderColor="$red" bg="ok wut" aok="err" {...props}>
        <div />
      </YStack>
      <ZStack spread="$10" bc="$bg" bg="alternate" aok="err" specific={1}>
        <div />
      </ZStack>
    </>
  )
}
