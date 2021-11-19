import {
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
  ThemeKeys,
  ThemeObject,
  Themes,
  Tokens,
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

export const x = () => {
  return (
    <>
      <YStack
        p={10}
        scale={10}
        width="$1"
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
      <ZStack spread="$10" bc="$bg" bg="alternate" aok="err" specific={1}>
        <div />
        <div />
      </ZStack>
    </>
  )
}

const ZStack = test(YStack, {
  variants: {
    bg: {
      alternate: {
        backgroundColor: 'blue',
      },
    },
    spread: {
      '...size': (val) => ({ width: val }),
    },
    // typed: {
    //   '[number]': (val) => ({ height: val }),
    // },
    specific: {
      1: { height: 1 },
    },
  },
})

export function test<
  A extends StaticComponent | React.Component<any>,
  StyledVariants extends void | {
    [key: string]: {
      [key: string]:
        | Partial<GetProps<A>>
        | ((
            val: any,
            config: {
              tokens: TamaguiConfig['tokens']
              theme: Themes extends { [key: string]: infer B } ? B : unknown
            }
          ) => Partial<GetProps<A>>)
    }
  }
>(
  Component: A,
  options?: GetProps<A> & {
    variants?: StyledVariants
  }
) {
  // const config = extendStaticConfig(Component, staticConfigProps)
  const component = 1 as any //createComponent(config!) // error is good here its on init
  // type ParentVariants = A extends StaticComponent<any, infer Variants> ? Variants : {}

  type VariantProps = StyledVariants extends void
    ? {}
    : {
        [Key in keyof StyledVariants]?: keyof StyledVariants[Key] extends `...${infer VariantSpread}`
          ? VariantSpread extends keyof Tokens
            ? keyof Tokens[VariantSpread] extends string | number
              ? `$${keyof Tokens[VariantSpread]}`
              : unknown
            : unknown
          : keyof StyledVariants[Key] extends 'true'
          ? boolean
          : keyof StyledVariants[Key]
      }

  return component as StaticComponent<GetProps<A> & VariantProps, VariantProps>
}

export type GetProps<A> = A extends StaticComponent<infer Props>
  ? Props
  : A extends React.Component<infer Props>
  ? Props
  : {}
