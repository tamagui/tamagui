import { Image, Text, TextInput } from 'react-native'

import { createComponent } from './createComponent'
import { RNComponents } from './helpers/RNComponents'
import {
  GetProps,
  GetVariantValues,
  MediaProps,
  PseudoProps,
  StaticConfig,
  StylableComponent,
  TamaguiComponent,
  VariantDefinitions,
  VariantSpreadFunction,
} from './types'

// TODO may be able to use this in the options?: arg below directly
export type StyledOptions<ParentComponent extends StylableComponent> = GetProps<ParentComponent> & {
  name?: string
  variants?: VariantDefinitions<ParentComponent> | undefined
  defaultVariants?: { [key: string]: any }
}

export function styled<
  ParentComponent extends StylableComponent,
  Variants extends VariantDefinitions<ParentComponent> | symbol =
    | VariantDefinitions<ParentComponent>
    | symbol
>(
  Component: ParentComponent,
  // this should be Partial<GetProps<ParentComponent>> but causes excessively deep type issues
  options?: GetProps<ParentComponent> & {
    name?: string
    variants?: Variants | undefined
    // thought i had this typed, but can't get it linked
    defaultVariants?: { [key: string]: any }
  },
  staticExtractionOptions?: Partial<StaticConfig>
) {
  const staticConfigProps = (() => {
    if (options) {
      const { variants, name, defaultVariants, ...defaultProps } = options
      if (defaultVariants) {
        Object.assign(defaultProps, defaultVariants)
      }
      const isReactNativeWeb =
        'staticConfig' in Component
          ? Component.staticConfig.isReactNativeWeb
          : RNComponents.has(Component)
      const isTamagui = !isReactNativeWeb && 'staticConfig' in Component
      const Comp = Component as any
      const isImage = !!(defaultProps.isImage || (!isTamagui ? Comp === Image : false))
      const isInput = !!(defaultProps.isInput || (!isTamagui ? Comp === TextInput : false))
      const isText = !!(defaultProps.isText || (!isTamagui ? isInput || Comp === Text : false))
      const conf: Partial<StaticConfig> = {
        ...staticExtractionOptions,
        ...(!isTamagui && {
          Component: Comp,
        }),
        isTamagui,
        // this type gets messed up by options?: Partial<GetProps<ParentComponent>> above
        // take away the Partial<> and it's fine
        variants,
        defaultProps,
        defaultVariants,
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

  const component = createComponent(staticConfigProps, Component)

  // get parent props without pseudos and medias so we can rebuild both with new variants
  type ParentPropsBase = ParentComponent extends TamaguiComponent<any, any, infer P>
    ? P
    : GetProps<ParentComponent>
  type ParentVariants = ParentComponent extends TamaguiComponent<any, any, any, infer V> ? V : {}

  type OurVariants = Variants extends symbol
    ? {}
    : {
        [Key in keyof Variants]?: Variants[Key] extends VariantSpreadFunction<any, infer Val>
          ? Val
          : GetVariantValues<keyof Variants[Key]>
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
// // variants
// export const XStack = styled(Stack, {
//   flexDirection: 'row',
//   name: 'XStack',
//   variants: {
//     fullscreen: {
//       true: {},
//     },
//     elevation: {
//       '...size': (val) => ({}),
//     },
//   },
// })
// const InBetween = styled(XStack, {})
// type INBVariants = typeof InBetween extends TamaguiComponent<any, any, any, infer Variants> ? Variants: never
// const SwitchFrame = styled(InBetween, {
//   name: 'Switch',
//   tag: 'button',
//   borderRadius: 100,
//   borderWidth: 0,
//   variants: {
//     name: {
//       true: {
//         backgroundColor: 'aliceblue'
//       },
//       // 1: {

//       // },
//       // ':number': (val) => {
//       //   return {}
//       // },
//       // "...fontSize": (val) => {
//       //   return {}
//       // },
//       // "...color": (val) => {
//       //   return {}
//       // }
//     }
//   },
//   defaultVariants: {
//     size: '$4',
//   },
// })
// const x = <XStack fullscreen />
// const y = <XStack fullscreen />
// const z = <SwitchFrame fullscreen name />

// depth:
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
