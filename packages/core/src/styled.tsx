import * as ReactNative from 'react-native'
import { Image, Text, TextInput } from 'react-native'

import { createComponent } from './createComponent'
import { extendStaticConfig } from './helpers/extendStaticConfig'
import {
  GetProps,
  GetVariantProps,
  MediaPropKeys,
  MediaProps,
  PseudoProps,
  PsuedoPropKeys,
  StaticComponent,
  StaticConfig,
  StylableComponent,
  VariantDefinitions,
} from './types'

// bye bye tree shaking... but only way to properly detect react-native components...
// also neither rnw nor react support tree shaking atm
const RNComponents = new WeakMap()
// I was looping over all of them, but casuses deprecation warnings and there's only a few
// we realistically support - lets whitelist rather than blacklist
for (const key of ['Image', 'TextInput', 'Text', 'View']) {
  const val = ReactNative[key]
  if (val && typeof val === 'object') {
    RNComponents.set(val, true)
  }
}

export function styled<
  ParentComponent extends StylableComponent,
  // = VariantDefinitions<GetProps<ParentComponent>> gives type inference to variants: { true: { ... } }
  // but causes "Type instantiation is excessively deep and possibly infinite."...
  Variants extends VariantDefinitions<any> | symbol =
    | VariantDefinitions<GetProps<ParentComponent>>
    | symbol
>(
  Component: ParentComponent,
  // this should be Partial<GetProps<ParentComponent>> but causes excessively deep type issues
  options?: GetProps<ParentComponent> & {
    name?: string
    variants?: Variants | undefined
    defaultVariants?: Variants extends Object ? GetVariantProps<Variants> : never
  },
  staticExtractionOptions?: StaticConfig
) {
  const staticConfigProps = (() => {
    if (options) {
      const { variants, name, defaultVariants, ...defaultProps } = options
      if (defaultVariants) {
        Object.assign(defaultProps, defaultVariants)
      }
      const isReactNativeWeb = RNComponents.has(Component)
      const isTamagui = !isReactNativeWeb && 'staticConfig' in Component
      const Comp = Component as any
      const isImage = !!(defaultProps.isImage || (!isTamagui ? Comp === Image : false))
      const isInput = !!(defaultProps.isInput || (!isTamagui ? Comp === TextInput : false))
      const isText = !!(defaultProps.isText || (!isTamagui ? isInput || Comp === Text : false))
      const conf: StaticConfig = {
        ...staticExtractionOptions,
        ...(!isTamagui && {
          Component: Comp,
        }),
        isTamagui,
        // this type gets messed up by options?: Partial<GetProps<ParentComponent>> above
        // take away the Partial<> and it's fine
        variants,
        defaultProps,
        componentName: name,
        isReactNativeWeb,
        isInput,
        isText,
        isImage,
      }
      return conf
    }
    return {}
  })()
  const config = extendStaticConfig(Component, staticConfigProps)
  const component = createComponent(config!) // error is good here its on init

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
