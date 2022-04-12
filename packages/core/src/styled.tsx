import * as ReactNative from 'react-native'
import { Text, TextInput } from 'react-native'

import { createComponent } from './createComponent'
import { extendStaticConfig } from './helpers/extendStaticConfig'
import {
  GetProps,
  GetVariantProps,
  MediaPropKeys,
  MediaProps,
  PseudoProps,
  PsuedoPropKeys,
  StackProps,
  StaticComponent,
  StaticConfig,
  StylableComponent,
  VariantDefinitions,
} from './types'

// bye bye tree shaking... but only way to properly detect react-native components...
// also neither rnw nor react support tree shaking atm
// this takes about 0.1ms in node console so not bad
const RNComponents = new WeakMap()
for (const key in ReactNative) {
  const val = ReactNative[key]
  if (typeof val === 'object') {
    RNComponents.set(val, true)
  }
}

export function styled<
  ParentComponent extends StylableComponent = StaticComponent<StackProps>,
  Variants extends VariantDefinitions<any> | symbol = VariantDefinitions<any> | symbol
>(
  Component: ParentComponent,
  options?: GetProps<ParentComponent> & {
    name?: string
    variants?: Variants | undefined
    defaultVariants?: Variants extends Object ? GetVariantProps<Variants> : never
  },
  staticExtractionOptions?: StaticConfig
) {
  const staticConfigProps: StaticConfig = (() => {
    if (options) {
      const { variants, name, ...defaultProps } = options
      const isReactNativeWeb = RNComponents.has(Component)
      const isTamagui = !isReactNativeWeb && 'staticConfig' in Component
      const isInput =
        defaultProps.isInput || (!isTamagui ? Component === (TextInput as any) : undefined)
      const isText = defaultProps.isText || (!isTamagui ? isInput || Component === Text : undefined)
      if (options.defaultVariants) {
        Object.assign(defaultProps, options.defaultVariants)
      }
      const conf = {
        ...staticExtractionOptions,
        ...(!isTamagui && {
          Component,
        }),
        isTamagui,
        variants,
        defaultProps,
        componentName: name,
        isReactNativeWeb,
        isInput,
        isText,
      }
      return conf
    }
    return {}
  })()
  const config = extendStaticConfig(Component, staticConfigProps)
  const component = createComponent(config!) // error is good here its on init

  if (process.env.NODE_ENV === 'development' && options?.debug) {
    console.log(`🐛 tamagui styled(${staticConfigProps.componentName})`, {
      options,
      staticConfigProps,
      config,
    })
  }

  type ParentProps = GetProps<ParentComponent>
  type VariantProps = Variants extends symbol ? {} : Expand<GetVariantProps<Variants>>
  type VariantKeys = Variants extends symbol ? never : keyof Variants[keyof Variants]
  type ParentPropsWithoutOurVariants = VariantKeys extends never
    ? ParentProps
    : Omit<ParentProps, VariantKeys>
  type StyleProps = VariantProps & ParentPropsWithoutOurVariants
  type Props = Variants extends undefined | symbol
    ? ParentProps
    : Omit<
        ParentProps extends Object ? ParentProps : {},
        (VariantKeys extends never ? ImpossibleKey : VariantKeys) | MediaPropKeys | PsuedoPropKeys
      > &
        VariantProps &
        MediaProps<StyleProps> &
        PseudoProps<StyleProps>

  return component as StaticComponent<Props, VariantProps>
}

type ImpossibleKey = 1234556123312321
type Expand<T> = T extends infer O ? { [K in keyof O]?: O[K] } : never
