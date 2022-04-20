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
  Variants extends VariantDefinitions<{}> = {}
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
  type OurVariants = Variants extends Object
    ? {
        [Key in keyof Variants]?: GetVariantValues<keyof Variants[Key]>
      }
    : {}

  type VariantProps = ParentVariants & OurVariants
  type OurPropsBase = ParentPropsBase & VariantProps

  type Props = Variants extends void | symbol
    ? GetProps<ParentComponent>
    : // start with base props
      OurPropsBase &
        // add in media (+ pseudos nested)
        MediaProps<OurPropsBase> &
        // add in pseudos
        PseudoProps<OurPropsBase>

  return component as TamaguiComponent<
    Props,
    // TODO infer ref
    any,
    ParentPropsBase,
    ParentVariants & OurVariants
  >
}

// type Merge<A, B> = Omit<A, keyof B> & B
// import { Stack } from './views/Stack'
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
// export const Paragraph = styled(SizableText, {
//   name: 'Paragraph',
//   tag: 'p',
//   // variants: {
//   //   another: {
//   //     true: {}
//   //   }
//   // }
// })
// export const Paragraph2 = styled(Paragraph, {
//   name: 'Paragraph',
//   tag: 'p',
//   variants: {
//     another: {
//       true: {
//         color: 'red'
//       },
//     }
//   }
// })
// const a = <SizableText size="$10" />
// const y = <Paragraph2 size="$10" another />
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
