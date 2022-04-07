import * as React from 'react'
import { Image, ImageProps, TextInput, TextInputProps } from 'react-native'

import { createComponent } from './createComponent'
import { extendStaticConfig } from './helpers/extendStaticConfig'
import {
  MediaPropKeys,
  MediaProps,
  PseudoProps,
  PsuedoPropKeys,
  StackProps,
  StaticComponent,
  StaticConfig,
  TamaguiConfig,
  TextProps,
  ThemeValueByCategory,
  Themes,
  Tokens,
  WithShorthands,
} from './types'

// this is necessary to match the react-native type defs
type RNComponent = new (...args: any[]) => any

type EmptyVariants = { __EMPTY_VARIANT__: string }

export function styled<
  Props,
  ParentComponent extends StaticComponent | React.Component<any> | RNComponent = React.Component<
    Partial<Props>
  >,
  Variants extends Object = {}
>(
  Component: ParentComponent,
  options?: GetProps<ParentComponent> & {
    name?: string
    variants?: Variants
  },
  staticExtractionOptions?: StaticConfig
) {
  const staticConfigProps: StaticConfig = (() => {
    if (options) {
      const { variants, name, ...defaultProps } = options
      return { ...staticExtractionOptions, variants, defaultProps, componentName: name }
    }
    return {}
  })()
  const config = extendStaticConfig(Component as any, staticConfigProps)
  const component = createComponent(config!) // error is good here its on init

  type MyVariants = Variants extends EmptyVariants ? {} : GetVariantProps<Variants>
  type ParentVariants = ParentComponent extends StaticComponent<void, infer V> ? V : EmptyVariants
  type MyParentVariants = ParentVariants extends EmptyVariants ? {} : ParentVariants
  type VariantProps = MyVariants & Omit<MyParentVariants, keyof MyVariants>
  type BaseProps = Props extends Object ? Props : GetProps<ParentComponent>
  type FullStyleProps = BaseProps & VariantProps & WithShorthands<BaseProps & VariantProps>

  return component as StaticComponent<
    // if not options/variants passed just styled(Text):
    keyof VariantProps extends never
      ? BaseProps
      : // if options passed: styled(Text, { ... })
        Omit<BaseProps, keyof VariantProps | MediaPropKeys | PsuedoPropKeys> &
          VariantProps &
          MediaProps<FullStyleProps> &
          PseudoProps<FullStyleProps>,
    VariantProps
  >
}

// type ParentVariants = A extends StaticComponent<any, infer Variants> ? Variants : {}

export type GetProps<A> = A extends StaticComponent<infer Props>
  ? Props
  : A extends React.Component<infer Props>
  ? Props & StackProps
  : A extends new (props: infer Props) => any
  ? Props & StackProps
  : A extends typeof TextInput
  ? Partial<TextInputProps> & TextProps
  : A extends typeof Image
  ? Partial<ImageProps> & StackProps
  : A extends typeof Image
  ? Partial<ImageProps> & StackProps
  : {}

export type VariantSpreadExtras<Props> = {
  tokens: TamaguiConfig['tokens']
  theme: Themes extends { [key: string]: infer B } ? B : unknown
  props: Props
}

export type VariantSpreadFunction<Props, Val = any> = (
  val: Val,
  config: VariantSpreadExtras<Props>
) => Partial<Props>

export type GetVariants<Props> = void | {
  [key: string]: {
    [key: string]: Partial<Props> | VariantSpreadFunction<Props>
  }
}

export type GetVariantProps<Variants> = Variants extends void
  ? {}
  : {
      // ensure variants actually defined
      [Key in keyof Variants]?: keyof Variants[Key] extends `...${infer VariantSpread}`
        ? VariantSpread extends keyof Tokens
          ? ThemeValueByCategory<VariantSpread> | null
          : unknown
        : keyof Variants[Key] extends 'true' | 'false'
        ? boolean
        : keyof Variants[Key] extends ':string'
        ? string
        : keyof Variants[Key] extends ':boolean'
        ? boolean
        : keyof Variants[Key] extends ':number'
        ? number
        : keyof Variants[Key]
    }

// type X = { ok: 1 }
// type Y = { okk: 2; ok: 3 }
// type Z = X & Y
// type Z2 = Z

// TODO get name
// const displayName = `styled(Component)`
// Object.defineProperty(component, 'name', {
//   value: displayName,
//   writable: false,
// })
