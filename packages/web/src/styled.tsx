import { stylePropsAll } from '@tamagui/helpers'
import { forwardRef } from 'react'

import { createComponent } from './createComponent.js'
import { ReactNativeStaticConfigs } from './setupReactNative.js'
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
} from './types.js'

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
    // thought i had this typed, but can't get it linked
    // this causes issues with 3+ levels of inheritance: GetVariantAcceptedValues<Variants>
    defaultVariants?: { [key: string]: any }
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

  const Component: any = isPlainStyledComponent
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
      const {
        variants,
        name,
        defaultVariants,
        acceptsClassName: acceptsClassNameProp,
        ...defaultProps
      } = options
      if (defaultVariants) {
        Object.assign(defaultProps, defaultVariants)
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
        ...nativeConf,
      }

      // bail on non className views as well
      if (defaultProps.children || !acceptsClassName) {
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

  type OurVariantProps = GetVariantAcceptedValues<Variants>

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
      'defaultProps' | 'propTypes' | '$$typeof' | 'staticConfig' | 'extractable'
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

// sanity check types
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
