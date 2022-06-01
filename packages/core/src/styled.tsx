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
import { Stack } from './views/Stack'

// TODO may be able to use this in the options?: arg below directly
export type StyledOptions<ParentComponent extends StylableComponent> = GetProps<ParentComponent> & {
  name?: string
  variants?: VariantDefinitions<ParentComponent> | undefined
  defaultVariants?: { [key: string]: any }
}

export function styled<
  ParentComponent extends StylableComponent,
  Variants extends VariantDefinitions<ParentComponent> | void = VariantDefinitions<ParentComponent> | void
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
      const reactNativeWebComponent = isReactNativeWeb
        ? Component['staticConfig']?.reactNativeWebComponent || Component
        : null
      const isTamagui = !isReactNativeWeb && 'staticConfig' in Component
      const Comp = reactNativeWebComponent || (Component as any)
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
        // for nesting multiple levels of rnw styled() need keep use the OG component
        reactNativeWebComponent,
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

  type OurVariants = Variants extends void
    ? {}
    : {
        [Key in keyof Variants]?: Variants[Key] extends VariantSpreadFunction<any, infer Val>
          ? Val
          : GetVariantValues<keyof Variants[Key]>
      }

  type VariantProps = Omit<ParentVariants, keyof OurVariants> & OurVariants
  type OurPropsBase = ParentPropsBase & VariantProps

  type Props = Variants extends void
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

// breaking...
// TODO see core/types.ts bug

// export const XStack = styled(Stack, {
//   variants: {
//     horizontal: {
//       true: {
//         // flexDirection: 'row',
//         width: 0,
//       },
//     },
//   },
// })

// const Separator = styled(Stack, {
//   variants: {
//     vertical: {
//       true: {
//         flexDirection: 'row',
//       },
//     },
//   },
//            <--- have to add as const to get working???
// })

// type props = GetProps<typeof XStack>
// type variants = typeof XStack extends TamaguiComponent<any, infer Variants> ? Variants : never
// type variants2 = typeof Separator extends TamaguiComponent<any, infer Variants> ? Variants : never

// const x = <XStack horizontal />
// const x2 = <Separator vertical />
