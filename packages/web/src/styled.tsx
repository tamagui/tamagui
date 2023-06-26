import { stylePropsAll } from '@tamagui/helpers'

import { createComponent } from './createComponent'
import { StyledContext } from './helpers/createStyledContext'
import { mergeVariants } from './helpers/extendStaticConfig'
import { ReactNativeStaticConfigs } from './setupReactNative'
import type {
  GetProps,
  GetVariantValues,
  MediaProps,
  PseudoProps,
  StaticConfig,
  StylableComponent,
  TamaguiComponent,
  TamaguiElement,
  VariantDefinitions,
  VariantSpreadFunction,
} from './types'

type GetBaseProps<A extends StylableComponent> = A extends TamaguiComponent<
  any,
  any,
  infer P
>
  ? P
  : GetProps<A>

type GetVariantProps<A extends StylableComponent> = A extends TamaguiComponent<
  any,
  any,
  any,
  infer V
>
  ? V
  : {}

type GetVariantAcceptedValues<V> = V extends Object
  ? {
      [Key in keyof V]?: V[Key] extends VariantSpreadFunction<any, infer Val>
        ? Val
        : GetVariantValues<keyof V[Key]>
    }
  : undefined

export function styled<
  ParentComponent extends StylableComponent,
  Variants extends VariantDefinitions<ParentComponent> | void = VariantDefinitions<ParentComponent> | void
>(
  ComponentIn: ParentComponent,
  // this should be Partial<GetProps<ParentComponent>> but causes excessively deep type issues
  options?: GetProps<ParentComponent> & {
    name?: string
    variants?: Variants | undefined
    defaultVariants?: GetVariantAcceptedValues<Variants>
    context?: StyledContext
    acceptsClassName?: boolean
  },
  staticExtractionOptions?: Partial<StaticConfig>
) {
  // validate not using a variant over an existing valid style
  if (process.env.NODE_ENV !== 'production') {
    if (!ComponentIn) {
      throw new Error(`No component given to styled()`)
    }
    if (options?.variants) {
      for (const key in options.variants) {
        if (key in stylePropsAll) {
          console.error(
            `Invalid variant key overlaps with style key: ${key}. Tamagui prevents defining variants that use valid style keys to reduce complexity and confusion.`
          )
        }
      }
    }
  }

  const parentStaticConfig =
    'staticConfig' in ComponentIn ? (ComponentIn.staticConfig as StaticConfig) : null

  const isPlainStyledComponent =
    !!parentStaticConfig &&
    !(parentStaticConfig.isReactNative || parentStaticConfig.isHOC)

  let Component: any = isPlainStyledComponent
    ? ComponentIn
    : parentStaticConfig?.Component || ComponentIn

  const isReactNative = Boolean(
    ReactNativeStaticConfigs.has(Component) ||
      staticExtractionOptions?.isReactNative ||
      ReactNativeStaticConfigs.has(parentStaticConfig?.Component) ||
      parentStaticConfig?.isReactNative
  )

  const staticConfigProps = (() => {
    if (options) {
      let {
        variants,
        name,
        defaultVariants,
        acceptsClassName: acceptsClassNameProp,
        context,
        ...defaultProps
      } = options

      if (parentStaticConfig) {
        defaultProps = {
          ...parentStaticConfig.defaultProps,
          ...defaultProps,
          ...defaultVariants,
        }
      }

      if (defaultVariants) {
        defaultProps = {
          ...defaultProps,
          ...defaultVariants,
        }
      }

      if (parentStaticConfig?.isHOC) {
        variants = mergeVariants(parentStaticConfig.variants, variants)
      }

      const nativeConf =
        (isReactNative && ReactNativeStaticConfigs.get(Component)) || null

      const isText = Boolean(
        staticExtractionOptions?.isText || parentStaticConfig?.isText
      )
      const acceptsClassName =
        acceptsClassNameProp ??
        (isPlainStyledComponent ||
          isReactNative ||
          (parentStaticConfig?.isHOC && parentStaticConfig?.acceptsClassName))

      const conf: Partial<StaticConfig> = {
        ...staticExtractionOptions,
        ...(!isPlainStyledComponent && {
          Component,
        }),
        // this type gets messed up by options?: Partial<GetProps<ParentComponent>> above
        // take away the Partial<> and it's fine
        variants,
        defaultProps,
        defaultVariants,
        componentName: name || parentStaticConfig?.componentName,
        isReactNative,
        isText,
        acceptsClassName,
        context,
        ...nativeConf,
      }

      // bail on non className views as well
      if (defaultProps.children || !acceptsClassName || context) {
        conf.neverFlatten = true
      }

      return conf
    }
  })()

  const component = createComponent(staticConfigProps || {}, Component)

  // get parent props without pseudos and medias so we can rebuild both with new variants
  // get parent props without pseudos and medias so we can rebuild both with new variants
  type ParentPropsBase = GetBaseProps<ParentComponent>
  type ParentVariants = GetVariantProps<ParentComponent>

  type OurVariantProps = Variants extends void ? {} : GetVariantAcceptedValues<Variants>

  type VariantProps = Omit<ParentVariants, keyof OurVariantProps> & OurVariantProps
  type OurPropsBase = ParentPropsBase & VariantProps

  type Props = Variants extends void
    ? GetProps<ParentComponent>
    : // start with base props
      OurPropsBase &
        // add in media (+ pseudos nested)
        MediaProps<Partial<OurPropsBase>> &
        // add in pseudos
        PseudoProps<Partial<OurPropsBase>>

  type ParentStaticProperties = {
    [Key in Exclude<
      keyof ParentComponent,
      | 'defaultProps'
      | 'propTypes'
      | '$$typeof'
      | 'staticConfig'
      | 'extractable'
      | 'styleable'
    >]: ParentComponent[Key]
  }

  type StyledComponent = TamaguiComponent<
    Props,
    TamaguiElement,
    ParentPropsBase,
    ParentVariants & OurVariantProps,
    ParentStaticProperties
  >

  for (const key in ComponentIn) {
    if (key in component) continue
    // @ts-expect-error assigning static properties over
    component[key] = ComponentIn[key]
  }

  return component as any as StyledComponent
}

// sanity check types:

// import { Stack } from './views/Stack'
// const X = styled(Stack, {
//   variants: {
//     size: {
//       '...size': (val) => {
//         return {
//           pointerEvents: 'auto'
//         }
//       }
//     },
//     disabled: {
//       true: {
//         alignContent: 'center',
//         opacity: 0.5,
//         pointerEvents: 'none',
//       },
//     },
//   } as const
// })
// // type variants = GetStyledVariants<typeof X>
// const y = <X disabled size="$10" />

// sanity check more complex types:

// import { Paragraph } from '../../text/src/Paragraph'
// import { Text } from './views/Text'
// import { getFontSized } from '../../get-font-sized/src'
// import { SizableText } from '../../text/src/SizableText'
// const Text1 = styled(Text, {
//   name: 'SizableText',
//   fontFamily: '$body',

//   variants: {
//     size: getFontSized,
//   } as const,

//   defaultVariants: {
//     size: '$true',
//   },
// })

// const Test2 = styled(Text1, {
//   tag: 'p',
//   userSelect: 'auto',
//   color: '$color',
// })

// const Test3 = styled(Test2, {
//   tag: 'p',
//   userSelect: 'auto',
//   color: '$color',

//   variants: {
//     ork: {
//       true: {}
//     }
//   }
// })

// const Test = styled(Paragraph, {
//   tag: 'p',
//   userSelect: 'auto',
//   color: '$color',

//   variants: {
//     someting: {
//       true: {},
//     },
//   } as const,
// })

// type X = typeof Paragraph
// type Props1 = GetProps<typeof Paragraph>
// type z = typeof Text1
// type ParentV = GetVariantProps<typeof Text1>
// type Props = GetProps<typeof Test>

// const y = <Test someting>sadad</Test>
// const z = <Test3 someting="$true" ork>sadad</Test3>
