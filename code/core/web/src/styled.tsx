import { createComponent } from './createComponent'
import type { StyledContext } from './helpers/createStyledContext'
import { mergeVariants } from './helpers/mergeVariants'
import type { GetRef } from './interfaces/GetRef'
import { getReactNativeConfig } from './setupReactNative'
import type {
  GetBaseStyles,
  GetNonStyledProps,
  GetStaticConfig,
  GetStyledVariants,
  GetVariantValues,
  InferStyledProps,
  StaticConfig,
  StaticConfigPublic,
  StylableComponent,
  TamaDefer,
  TamaguiComponent,
  ThemeValueGet,
  VariantDefinitions,
  VariantSpreadFunction,
} from './types'
import type { Text } from './views/Text'

type AreVariantsUndefined<Variants> =
  // because we pass in the Generic variants which for some reason has this :)
  Required<Variants> extends { _isEmpty: 1 } ? true : false

type GetVariantAcceptedValues<V> = V extends Object
  ? {
      [Key in keyof V]?: V[Key] extends VariantSpreadFunction<any, infer Val>
        ? Val
        : GetVariantValues<keyof V[Key]>
    }
  : undefined

export function styled<
  ParentComponent extends StylableComponent,
  StyledStaticConfig extends StaticConfigPublic,
  Variants extends VariantDefinitions<ParentComponent, StyledStaticConfig>,
>(
  ComponentIn: ParentComponent,
  // this should be Partial<GetProps<ParentComponent>> but causes excessively deep type issues
  options?: Partial<InferStyledProps<ParentComponent, StyledStaticConfig>> & {
    name?: string
    variants?: Variants | undefined
    defaultVariants?: GetVariantAcceptedValues<Variants>
    context?: StyledContext
    /** @deprecated pass in instead as the third argument to styled() */
    acceptsClassName?: boolean
  },
  staticExtractionOptions?: StyledStaticConfig
) {
  // do type stuff at top for easier readability

  // get parent props without pseudos and medias so we can rebuild both with new variants
  // get parent props without pseudos and medias so we can rebuild both with new variants
  type ParentNonStyledProps = GetNonStyledProps<ParentComponent>
  type ParentStylesBase = GetBaseStyles<ParentComponent, StyledStaticConfig>
  type ParentVariants = GetStyledVariants<ParentComponent>

  type OurVariantProps = AreVariantsUndefined<Variants> extends true
    ? {}
    : GetVariantAcceptedValues<Variants>
  type MergedVariants = AreVariantsUndefined<Variants> extends true
    ? ParentVariants
    : AreVariantsUndefined<ParentVariants> extends true
      ? Omit<OurVariantProps, '_isEmpty'>
      : {
          // exclude _isEmpty as it no longer is empty
          [Key in Exclude<keyof ParentVariants | keyof OurVariantProps, '_isEmpty'>]?:
            | (Key extends keyof ParentVariants ? ParentVariants[Key] : undefined)
            | (Key extends keyof OurVariantProps ? OurVariantProps[Key] : undefined)
        }

  type Accepted = StyledStaticConfig['accept']
  type CustomTokenProps = Accepted extends Record<string, any>
    ? {
        [Key in keyof Accepted]?:
          | (Key extends keyof ParentStylesBase ? ParentStylesBase[Key] : never)
          | (Accepted[Key] extends 'style'
              ? Partial<InferStyledProps<ParentComponent, StyledStaticConfig>>
              : Accepted[Key] extends 'textStyle'
                ? Partial<InferStyledProps<typeof Text, StyledStaticConfig>>
                : Omit<ThemeValueGet<Accepted[Key]>, 'unset'>)
      }
    : {}

  /**
   * de-opting a bit of type niceness because were hitting depth issues too soon
   * before we had:
   *
   * type OurPropsBase = OurStylesBase & PseudoProps<Partial<OurStylesBase>>
   * and then below in type Props you would remove the PseudoProps line
   * that would give you nicely merged pseudo sub-styles but its just too much for TS
   * so now pseudos wont be nicely typed inside media queries, but at least we can nest
   */

  type StyledComponent = TamaguiComponent<
    TamaDefer,
    GetRef<ParentComponent>,
    ParentNonStyledProps,
    Accepted extends Record<string, any>
      ? ParentStylesBase & CustomTokenProps
      : ParentStylesBase,
    MergedVariants,
    GetStaticConfig<ParentComponent, StyledStaticConfig>
  >

  // validate not using a variant over an existing valid style
  if (process.env.NODE_ENV !== 'production') {
    if (!ComponentIn) {
      throw new Error(`No component given to styled()`)
    }
  }

  const parentStaticConfig = ComponentIn['staticConfig'] as StaticConfig | undefined

  const isPlainStyledComponent =
    !!parentStaticConfig &&
    !(parentStaticConfig.isReactNative || parentStaticConfig.isHOC)

  const isNonStyledHOC = parentStaticConfig?.isHOC && !parentStaticConfig?.isStyledHOC

  let Component: any =
    isNonStyledHOC || isPlainStyledComponent
      ? ComponentIn
      : parentStaticConfig?.Component || ComponentIn

  const reactNativeConfig = !parentStaticConfig
    ? getReactNativeConfig(Component)
    : undefined

  const isReactNative = Boolean(
    reactNativeConfig ||
      staticExtractionOptions?.isReactNative ||
      parentStaticConfig?.isReactNative
  )

  const staticConfigProps = (() => {
    let {
      variants,
      name,
      defaultVariants,
      acceptsClassName: acceptsClassNameProp,
      context,
      ...defaultProps
    } = options || {}

    let parentDefaultVariants
    let parentDefaultProps

    if (parentStaticConfig) {
      const avoid = parentStaticConfig.isHOC && !parentStaticConfig.isStyledHOC
      if (!avoid) {
        const pdp = parentStaticConfig.defaultProps

        // apply parent props only if not already defined, they are lesser specificity
        for (const key in pdp) {
          const val = pdp[key]
          if (parentStaticConfig.defaultVariants) {
            if (key in parentStaticConfig.defaultVariants) {
              // ensure we don't add it if its also in our default variants so we keep the order!
              if (!defaultVariants || !(key in defaultVariants)) {
                parentDefaultVariants ||= {}
                parentDefaultVariants[key] = val
              }
            }
          }
          if (!(key in defaultProps) && (!defaultVariants || !(key in defaultVariants))) {
            parentDefaultProps ||= {}
            parentDefaultProps[key] = pdp[key]
          }
        }
        if (parentStaticConfig.variants) {
          // @ts-expect-error
          variants = mergeVariants(parentStaticConfig.variants, variants)
        }
      }
    }

    // applies everything in the right order! order is important
    if (parentDefaultProps || defaultVariants || parentDefaultVariants) {
      defaultProps = {
        ...parentDefaultProps,
        ...parentDefaultVariants,
        ...defaultProps,
        ...defaultVariants,
      }
    }

    if (parentStaticConfig?.isHOC) {
      // if HOC we map name => componentName as we have a difference in how we name prop vs styled() there
      if (name) {
        // @ts-ignore
        defaultProps.componentName = name
      }
    }

    const isText = Boolean(staticExtractionOptions?.isText || parentStaticConfig?.isText)

    const acceptsClassName =
      staticExtractionOptions?.acceptsClassName ??
      acceptsClassNameProp ??
      (isPlainStyledComponent ||
        isReactNative ||
        (parentStaticConfig?.isHOC && parentStaticConfig?.acceptsClassName))

    const conf: Partial<StaticConfig> = {
      ...parentStaticConfig,
      ...staticExtractionOptions,
      ...(!isPlainStyledComponent && {
        Component,
      }),
      // @ts-expect-error
      variants,
      defaultProps,
      defaultVariants,
      componentName: name || parentStaticConfig?.componentName,
      isReactNative,
      isText,
      acceptsClassName,
      context,
      ...reactNativeConfig,
      isStyledHOC: Boolean(parentStaticConfig?.isHOC),
      parentStaticConfig,
    }

    // bail on non className views as well
    if (defaultProps['children'] || !acceptsClassName || context) {
      conf.neverFlatten = true
    }

    return conf
  })()

  const component = createComponent(staticConfigProps || {})

  for (const key in ComponentIn) {
    // dont inherit propTypes
    if (key === 'propTypes') continue
    if (key in component) continue
    // @ts-expect-error assigning static properties over
    component[key] = ComponentIn[key]
  }

  return component as any as StyledComponent
}

// sanity check types:

// type YP = GetProps<typeof InputFrame>
// type x = YP['onChangeText']
// type x2 = YP['size']
// const X = <InputFrame placeholder="red" hoverStyle={{}} />

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

//
// merges variant types properly:

// const OneVariant = styled(Stack, {
//   variants: {
//     variant: {
//       test: { backgroundColor: 'gray' },
//     },
//   } as const,
// })
// const Second = styled(Stack, {
//   variants: {
//     variant: {
//       simple: { backgroundColor: 'gray' },
//       colorful: { backgroundColor: 'violet' },
//     },
//   } as const,
// })
// const TwoVariant = styled(OneVariant, {
//   variants: {
//     variant: {
//       simple: { backgroundColor: 'gray' },
//       colorful: { backgroundColor: 'violet' },
//     },
//   } as const,
// })

// type X = typeof OneVariant extends TamaguiComponent<any, any, any, infer V> ? V : any
// type V = typeof Second extends TamaguiComponent<any, any, any, infer V> ? V : any

// type V2 = VariantDefinitions<typeof OneVariant>

// type R = typeof TwoVariant extends TamaguiComponent<any, any, any, infer V> ? V : any

// type Keys = keyof X | keyof V
// type Z = {
//   [Key in Keys]: V[Key] | X[Key]
// }

// const a: Z = {
//   variant: 'colorful',
// }
// const b: Z = {
//   variant: 'simple',
// }
// const c: Z = {
//   variant: 'invalid',
// }

// const y = <TwoVariant variant="colorful" />
