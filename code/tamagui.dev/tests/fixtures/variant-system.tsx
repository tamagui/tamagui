// compile fixture for data/docs/core/variants.mdx, styled.mdx, style-pieces.mdx, and tailwind.mdx.
// every snippet from these docs is reproduced here so typechecking proves the guidance compiles.

import * as React from 'react'
import {
  Checkbox,
  GetProps,
  ScrollView,
  SizeTokens,
  Tabs,
  Text,
  ToggleGroup,
  View,
  XGroup,
  YStack,
  style,
  styled,
} from 'tamagui'
import {
  Text as TailwindText,
  View as TailwindView,
  styled as tailwindStyled,
} from '@tamagui/tailwind'

// § Variants: bare dynamic variant declaration + component resolver
export const AlertBox = styled(View, {
  backgroundColor: 'background',
  padding: '4',

  variants: {
    tone: styled.dynamic<'neutral' | 'critical'>(),
    disabled: {
      true: { opacity: 0.5 },
    },
  } as const,
}).resolve((props, env) => ({
  backgroundColor:
    props.tone === 'critical' ? (env.theme.red10?.val ?? 'red') : undefined,
  borderColor: props.tone === 'critical' ? (env.theme.red8?.val ?? 'red') : undefined,
  opacity: props.disabled ? 0.5 : undefined,
}))

export const AlertBoxUsage = () => <AlertBox tone="critical" disabled />

// § Variants: dynamic value domains
export const ColorfulView = styled(View, {
  variants: {
    colorful: styled.dynamic<true | string>((val) => ({
      color: val === true ? 'red' : val,
    })),
  } as const,
})

export const ColorfulViewUsage = () => (
  <>
    <ColorfulView colorful={true} />
    <ColorfulView colorful="blue" />
  </>
)

// § Variants: dynamic number variant
export const MyView = styled(View, {
  variants: {
    doubleMargin: styled.dynamic<number>((val) => ({
      margin: val * 2,
    })),
  } as const,
})

export const MyViewUsage = () => <MyView doubleMargin={8} />

// § Variants: defaultVariants with dynamic
export const DynamicSquare = styled(View, {
  variants: {
    size: styled.dynamic<SizeTokens>((size: any, { tokens }) => ({
      width: tokens.size[size] ?? size,
      height: tokens.size[size] ?? size,
    })),
  } as const,
  defaultVariants: {
    size: '10',
  },
})

// § Styled: parent-first resolver chaining
const ResolverParent = styled(View, {
  variants: {
    tone: styled.dynamic<'neutral' | 'critical'>(),
  },
}).resolve((props, env) => ({
  backgroundColor:
    props.tone === 'critical' ? (env.theme.red10?.val ?? 'red') : undefined,
  width: 100,
}))

export const ResolverChild = styled(ResolverParent, {}).resolve((props) => ({
  width: props.tone === 'critical' ? 200 : undefined,
}))

// § Style pieces: module-scope definition and array usage
const cardActive = style({
  backgroundColor: 'background-press',
  borderColor: 'border-color-hover',
  opacity: 0.9,
})

const baseCardStyle = style({ padding: 16, borderRadius: 8 })

export function CardUsage({ active }: { active?: boolean }) {
  return (
    <>
      <View style={cardActive} />
      <View style={[baseCardStyle, active && cardActive, { opacity: 0.8 }]} />
    </>
  )
}

// § Style pieces: piece-typed component props
const activeCheckboxStyle = style({
  backgroundColor: 'blue-500',
  borderColor: 'blue-600',
})

const scrollContainer = style({
  padding: 20,
  gap: 12,
})

export function PieceTypedPropsUsage() {
  return (
    <ScrollView contentContainerStyle={scrollContainer}>
      <Checkbox activeStyle={activeCheckboxStyle}>
        <Checkbox.Indicator activeStyle={activeCheckboxStyle} />
      </Checkbox>
    </ScrollView>
  )
}

// § Component docs: ToggleGroup with style()
const activeToggleStyle = style({ backgroundColor: 'color5' })

export function ToggleGroupUsage() {
  return (
    <ToggleGroup type="single">
      <XGroup>
        <XGroup.Item>
          <ToggleGroup.Item value="foo" activeStyle={activeToggleStyle}>
            Foo
          </ToggleGroup.Item>
        </XGroup.Item>
        <XGroup.Item>
          <ToggleGroup.Item value="bar" activeStyle={activeToggleStyle}>
            Bar
          </ToggleGroup.Item>
        </XGroup.Item>
      </XGroup>
    </ToggleGroup>
  )
}

// § Component docs: Tabs with style()
const activeTabStyle = style({ backgroundColor: 'background-press' })

export function TabsUsage() {
  return (
    <Tabs defaultValue="tab1">
      <Tabs.List>
        <Tabs.Tab value="tab1" activeStyle={activeTabStyle}>
          <Text>Tab 1</Text>
        </Tabs.Tab>
      </Tabs.List>
    </Tabs>
  )
}

// § Tamagui Tailwind: basic usage
export function TailwindCard() {
  return (
    <TailwindView className="flex flex-row items-center gap-3 p-4 rounded-lg bg-slate-100">
      <TailwindView className="w-10 h-10 rounded-full bg-blue-500" />
      <TailwindText className="text-base font-semibold text-slate-900">
        Tamagui Tailwind
      </TailwindText>
    </TailwindView>
  )
}

// § Tamagui Tailwind: styled() with class variants
export const TailwindButton = tailwindStyled(
  TailwindView,
  'px-4 py-2 rounded-md font-medium',
  {
    variants: {
      variant: {
        primary: 'bg-blue-500 hover:bg-blue-600 text-white',
        secondary: 'bg-slate-200 hover:bg-slate-300 text-slate-800',
      },
      size: {
        small: 'text-sm py-1 px-2',
        large: 'text-lg py-3 px-6',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  }
)

export function TailwindButtonUsage() {
  return <TailwindButton variant="primary" size="large" />
}

// § Tamagui Tailwind: mixing with Tamagui components
export function MixedTreeUsage() {
  return (
    <View padding="4" backgroundColor="background">
      <TailwindView className="flex flex-row items-center gap-2 p-2 rounded bg-blue-50">
        <TailwindText className="text-blue-700 font-bold">Mixed Tree</TailwindText>
      </TailwindView>
    </View>
  )
}
