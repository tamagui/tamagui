import {
  Shorthands,
  Stack,
  StackProps,
  StackStyleProps,
  TamaguiConfig,
  TamaguiStylesBase,
  TamaguiThemedStackStyleProps,
  ThemeKeyVariables,
  ThemeKeys,
  ThemeObject,
  createTamagui,
  styled,
} from '@tamagui/core'

import { shorthands, tokens } from './testConstants'
import { themes } from './testThemes'

type x2 = Shorthands['bc']
type x = Shorthands['p']
type x3 = Shorthands['s']
type y = Shorthands['asdasd']
type x333 = StackStyleProps
type x222 = TamaguiStylesBase['borderColor']
type x22222 = TamaguiThemedStackStyleProps['borderColor']
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
    bg: {
      'ok wut': {
        backgroundColor: 'red',
      },
    },
  },
})

const ZStack = styled(Stack, {
  variants: {
    bg: {
      alternate: {
        backgroundColor: 'blue',
      },
    },
    spread: {
      '...size': (val) => ({ width: val }),
    },
    typed: {
      '[number]': (val) => ({ height: val }),
    },
    specific: {
      1: { height: 1 },
    },
  },
})

export const x = () => {
  return (
    <>
      <YStack
        p={10}
        scale="$2"
        x="$2"
        y="$s"
        borderColor="$red"
        backgroundColor="red"
        bg="ok wut"
        aok="err"
      >
        <div />
        <div />
      </YStack>
      <ZStack bg="ok wut" aok="err">
        <div />
        <div />
      </ZStack>
    </>
  )
}
