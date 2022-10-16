import { getConfig } from './config'
import { createComponent } from './createComponent'
import {
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

// TODO may be able to use this in the options?: arg below directly
export type StyledOptions<ParentComponent extends StylableComponent> = GetProps<ParentComponent> & {
  name?: string
  variants?: VariantDefinitions<ParentComponent> | undefined
  defaultVariants?: { [key: string]: any }
}

// can't infer from styled(<YStack />) which would be nice
// * excessively deep type instantiation

type GetBaseProps<A extends StylableComponent> =
  // A extends TamaguiReactElement
  //   ? GetBaseProps<A['type']> :
  A extends TamaguiComponent<any, any, infer P> ? P : GetProps<A>

type GetVariantProps<A extends StylableComponent> =
  // A extends TamaguiReactElement
  //   ? GetVariantProps<A['type']>
  //   :
  A extends TamaguiComponent<any, any, any, infer V> ? V : {}

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
    acceptsClassName?: boolean
  },
  staticExtractionOptions?: Partial<StaticConfig>
) {
  // allows passing styled(<H1 bc="red" />)
  // but to get types right would be tricky
  // if (isValidElement(Component) && isTamaguiComponent(Component.type)) {
  //   const props = Component.props
  //   if (props && typeof props === 'object') {
  //     Component = Component.type as any
  //     options = options ? ({ ...props, ...options } as any) : props
  //   }
  // }

  const tamaguiConfig = getConfig()

  const staticConfigProps = (() => {
    const parentStaticConfig =
      'staticConfig' in Component ? (Component.staticConfig as StaticConfig) : null

    if (process.env.NODE_ENV === 'development') {
      if (parentStaticConfig?.isHOC) {
        // eslint-disable-next-line no-console
        console.warn(
          `Warning: Parent component is a functional component, not a Tamagui styled() component. Extending with styled() will break and lead to incorrect styles.`
        )
      }
    }

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
      const isReactNativeWeb = Boolean(
        parentStaticConfig?.isReactNativeWeb || staticExtractionOptions?.isReactNativeWeb
      )
      const reactNativeWebComponent = isReactNativeWeb
        ? parentStaticConfig?.reactNativeWebComponent || Component
        : null
      const isTamagui = !isReactNativeWeb && !!parentStaticConfig
      const Comp = reactNativeWebComponent || (Component as any)

      console.warn('need to conf Text')
      const isText = Boolean(
        staticExtractionOptions?.isText || parentStaticConfig?.isText || Comp === null
      )

      const acceptsClassName = acceptsClassNameProp ?? (isTamagui || isReactNativeWeb)

      const conf: Partial<StaticConfig> = {
        ...staticExtractionOptions,
        ...(!isTamagui && {
          Component: Comp,
        }),
        // this type gets messed up by options?: Partial<GetProps<ParentComponent>> above
        // take away the Partial<> and it's fine
        variants,
        defaultProps,
        defaultVariants,
        componentName: name,
        isReactNativeWeb,
        // for nesting multiple levels of rnw styled() need keep use the OG component
        reactNativeWebComponent,
        isText,
        acceptsClassName,
      }

      // TODO compiler doesn't have logic to include children, de-opt (see EnsureFlexed for test usage)
      // bail on non className views as well
      if (defaultProps.children || !acceptsClassName) {
        conf.neverFlatten = true
      }

      return conf
    }
    return {}
  })()

  const component = createComponent(staticConfigProps, Component)

  // get parent props without pseudos and medias so we can rebuild both with new variants
  // get parent props without pseudos and medias so we can rebuild both with new variants
  type ParentPropsBase = GetBaseProps<ParentComponent>
  type ParentVariants = GetVariantProps<ParentComponent>

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

  type StyledComponent = TamaguiComponent<
    Props,
    TamaguiElement,
    ParentPropsBase,
    ParentVariants & OurVariants
  >

  return component as StyledComponent
}

// import { Stack } from './views/Stack'
// const X = styled(Stack, {
//   variants: {
//     size: {
//       '...size': (val) => {
//         return {}
//       }
//     },
//     disabled: {
//       true: {
//         opacity: 0.5,
//         pointerEvents: 'none',
//       },
//     },
//   } as const
// })
// type variants = GetStyledVariants<typeof X>
// const y = <X disabled size="$10" />
