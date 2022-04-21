import { Image, Text, TextInput } from 'react-native'

import { createComponent } from './createComponent'
import { extendStaticConfig } from './helpers/extendStaticConfig'
import { RNComponents } from './helpers/RNComponents'
import {
  GetProps,
  GetVariantProps,
  GetVariantValues,
  MediaProps,
  PseudoProps,
  StaticConfig,
  StylableComponent,
  TamaguiComponent,
  VariantDefinitions,
} from './types'

export function styled<
  ParentComponent extends StylableComponent,
  // = VariantDefinitions<GetProps<ParentComponent>> gives type inference to variants: { true: { ... } }
  // but causes "Type instantiation is excessively deep and possibly infinite."...
  Variants extends VariantDefinitions<ParentComponent> | symbol =
    | VariantDefinitions<ParentComponent>
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

  // get parent props without pseudos and medias so we can rebuild both with new variants
  type ParentPropsBase = ParentComponent extends TamaguiComponent<any, any, infer P>
    ? P
    : GetProps<ParentComponent>
  type ParentVariants = ParentComponent extends TamaguiComponent<any, any, any, infer V>
    ? V
    : Object

  // sprinkle in our variants
  type OurVariants = Variants extends symbol
    ? {}
    : {
        [Key in keyof Variants]?: GetVariantValues<keyof Variants[Key]>
      }

  type VariantProps = Omit<ParentVariants, keyof OurVariants> & OurVariants
  type OurPropsBase = ParentPropsBase & VariantProps

  type Props = Variants extends void | symbol
    ? GetProps<ParentComponent>
    : // start with base props
      OurPropsBase &
        // add in media (+ pseudos nested)
        MediaProps<Partial<OurPropsBase>> &
        // add in pseudos
        PseudoProps<Partial<OurPropsBase>>

  return component as TamaguiComponent<
    Props,
    // TODO infer ref
    any,
    ParentPropsBase,
    ParentVariants & OurVariants
  >
}

// test types:

// export const SizableText = styled(Stack, {
//   name: 'SizableText',
//   backgroundColor: 'red',
//   variants: {
//     size: {
//       '...fontSize': (val, { props }) => {
//         return {
//           backgroundColor: '',
//         }
//       },
//     },
//   },
// })
// export const Heading = styled(SizableText, {
//   tag: 'span',
//   name: 'Heading',
//   accessibilityRole: 'header',
//   size: '$8',
//   margin: 0,
// })
// export const Paragraph = styled(SizableText, {
//   tag: 'p',
//   margin: 10,
//   variants: {
//     another: {
//       true: {},
//     },
//   },
// })
// export const Paragraph2 = styled(Paragraph, {
//   tag: 'p',
//   variants: {
//     another: {
//       '...color': (val) => ({
//         backgroundColor: 'red',
//       }),
//     },
//   },
// })
// const a = <SizableText size="$10" />
// const b = <Paragraph size="$10" another />
// const c = <Paragraph2 size="$10" another="aliceblue" />
// export const SizableText2 = styled(SizableText, {
// })
// const xx = <SizableText2 abc />
// export const Paragraph = styled(SizableText, {
//   name: 'Paragraph',
// })
// export const Heading = styled(Paragraph, {
//   tag: 'span',
//   margin: 0,
// })
// export const H2 = styled(Heading, {
//   name: 'H2',
// })
// const x = <H2 color="red" />
