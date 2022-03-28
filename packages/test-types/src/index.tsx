import {
  ColorTokens,
  GetProps,
  GetVariantProps,
  GetVariants,
  Shorthands,
  Stack,
  StackProps,
  TamaguiConfig,
  Text,
  ThemeKeyVariables,
  ThemeObject,
  Variable,
  createTamagui,
  styled,
} from '@tamagui/core'
import { shorthands } from '@tamagui/shorthands'
import { themes, tokens } from '@tamagui/theme-base'

type x2 = Shorthands['bc']
type x = Shorthands['p']
type x3 = Shorthands['s']
type y = Shorthands['asdasd']
type x22 = StackProps['borderColor']
type sz = ThemeKeyVariables
type asdsad = keyof TamaguiConfig['themes']

const config = createTamagui({
  defaultTheme: 'light',
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

type s = OurConfig['shorthands']

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

type abc = ColorTokens

type z1 = GetProps<typeof YStack>
type z11 = z1['bc']
type z111 = z1['backgroundColor']
type z12 = ThemeObject
type themes = TamaguiConfig['themes']
type themekeys = keyof themes
type z123 = themes[themekeys]

type z2 = GetProps<typeof ZStack>
type zSV = GetVariants<typeof ZStack>
type zVP = GetVariantProps<zSV>
type z2222 = z2['bg']
type z22222 = z2['shoulderr']

export const SizableTextTEST = styled(Text, {
  variants: {
    size: {
      '...size': (val, { tokens, props }) => {
        const family = (
          typeof props.fontFamily === 'string'
            ? props.fontFamily.replace('$', '')
            : props.fontFamily instanceof Variable
            ? props.fontFamily.val
            : props.fontFamily || 'body'
        ) as any
        const font = tokens.font?.[family]
        const fontSize = font.size[val]
        const lineHeight = font.lineHeight[val]
        const fontWeight = font.weight[val]
        const letterSpacing = font.letterSpacing[val]
        console.log('got em', font, fontSize, lineHeight, fontWeight, letterSpacing)
        if (fontSize instanceof Variable) {
          return {
            fontWeight,
            letterSpacing,
            fontSize,
            lineHeight,
          }
        }
        const fs = +val
        // TODO can have props.sizeLineHeight
        const lh = +val * (Math.log(Math.max(1.6, val)) * 0.01 + 1.1)
        return {
          fontSize: fs,
          lineHeight: lh,
        }
      },
    },
  },
})

export const Paragraph = styled(SizableTextTEST, {
  fontFamily: '$body',
  color: '$color',
  size: '$4',
})

type pp = GetProps<typeof Paragraph>
type ppp = pp['m']

const EmptyExtension = styled(Text)

export const InteractiveFrame = styled(Stack, {
  variants: {
    size: {
      '...size': (val = '4', { tokens, props }) => {
        const sizeIndex = Object.keys(tokens.size).indexOf(val)
        const size = tokens.size[sizeIndex] ?? tokens.size[val] ?? val
        const px = Math.round(+(size instanceof Variable ? size.val : size) * 0.8)
        const py = Math.round(+(size instanceof Variable ? size.val : size) * 0.33)
        return {
          paddingHorizontal: px,
          paddingVertical: py,
          borderRadius: py * 0.5,
        }
      },
    },

    disabled: {
      true: {
        // TODO turning this on ruins types
        // pointerEvents: 'none',
        opacity: 0.5,
        hoverStyle: {
          backgroundColor: '$background',
        },
      },
    },
  },
})

export const x = (props: StackProps) => {
  return (
    <>
      <Paragraph ta="center" />
      <EmptyExtension elevation="" asd="asds" />
      <Stack bc="$background" asdsadasd="sadsd" />
      <YStack asdsadasd="sadsd" />
      <YStack $lg={{ notValid: 1, x: 10 }} />
      <InteractiveFrame asdsadasd="sadsd" />
      <InteractiveFrame $lg={{ notValid: 0 }} />
      <Text asdsadasd="sadsd" />
      <Text $lg={{ x: 10, wut: 1 }} />
      <SizableTextTEST asdsadasd="sadsd" />
      <SizableTextTEST $sm={{ size: '$2', wut: 3 }} />
      <Paragraph size="$5" $lg={{ size: '$0', wut: 0 }} />
      <Paragraph
        color="$color"
        opacity={0.7}
        size="$3"
        ta="center"
        asdasd={1}
        $lg={{
          m: 10,
          asdsad: 1,
        }}
        // $gtSm={{
        //   ta: 'center',
        //   size: '$5',
        // }}
      />
      <YStack
        $lg={{
          p: 10,
          x: 10,
          width: 10,
        }}
        p={10}
        width="$1"
        x="$2"
        y="$s"
        borderColor="$red"
        bg="ok wut"
        aok="err"
        {...props}
      >
        <div />
      </YStack>
      <ZStack
        $lg={{
          p: '$-0',
        }}
        spread="$10"
        bc="$background"
        bg="alternate"
        asdsad={1}
        aok="err"
        specific={1}
      >
        <div />
      </ZStack>
      <Text asdsd={1} x={10} m={100} $lg={{ m: 20 }} />
    </>
  )
}
