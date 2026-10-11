import React, { type ReactNode, type Ref as ReactRef } from 'react'
import { componentDisplayName } from './helpers/componentDisplayName'
import { Theme } from './views/Theme'
import type {
  GetFinalProps,
  StaticConfig,
  StyledHOCMergedProps,
  StyledHOCOptions,
  TamaguiComponent,
  TamaDefer,
  ThemeProps,
} from './types'

export function createStyledHOC<
  Props,
  Ref,
  NonStyledProps,
  BaseStyles extends object,
  VariantProps,
  ParentStaticProperties,
  CustomProps extends object = {},
>(
  // infer from the stored tuple instead of comparing the expanded call signature.
  // intersecting hundreds of conditional style props can exceed the union limit.
  component: {
    __tama: [Props, Ref, NonStyledProps, BaseStyles, VariantProps, ParentStaticProperties]
    staticConfig: StaticConfig
  },
  render: (
    props: Omit<
      NoInfer<
        Props extends TamaDefer
          ? GetFinalProps<NonStyledProps, BaseStyles, VariantProps>
          : Props
      >,
      keyof CustomProps
    > &
      CustomProps,
    // always a ref value (null when the caller passed none), so a render
    // callback may declare a required `Ref<TamaguiElement>` parameter
    ref: ReactRef<NoInfer<Ref>> | null
  ) => ReactNode,
  options?: StyledHOCOptions
): TamaguiComponent<
  // keep deferred parents deferred even when the receiver adds custom props.
  // their declared owners live in the tuple until a caller needs the props.
  Props extends TamaDefer
    ? string extends keyof NonStyledProps
      ? StyledHOCMergedProps<
          GetFinalProps<NonStyledProps, BaseStyles, VariantProps>,
          CustomProps
        >
      : TamaDefer
    : StyledHOCMergedProps<Props, CustomProps>,
  Ref,
  StyledHOCMergedProps<NonStyledProps, CustomProps>,
  BaseStyles,
  keyof CustomProps extends never ? VariantProps : Omit<VariantProps, keyof CustomProps>,
  ParentStaticProperties
> {
  const staticConfig = component.staticConfig

  const extendedConfig: StaticConfig = {
    ...staticConfig,
    ...options?.staticConfig,
    neverFlatten: true,
    isHOC: true,
    isStyledHOC: false,
  }

  let out: any = function StyledHOCComponent(props: any) {
    'use no memo'

    const { ref = null, ...rest } = props
    if (options?.disableTheme) {
      return render(rest, ref)
    }

    const defaultTheme = extendedConfig.defaultProps?.theme
    const { theme: _, ...themedRest } = rest
    const element = render({ ...themedRest, 'data-disable-theme': true }, ref)

    let themeProps: Partial<ThemeProps> | null = null
    if ('debug' in props) {
      themeProps = { debug: props.debug }
    }
    if ('theme' in props || defaultTheme) {
      ;(themeProps ||= {}).name = 'theme' in props ? props.theme : defaultTheme
    }

    // keeping the theme key present with a null value keeps the tree stable
    // across theme changes, while an entirely absent key avoids mounting Theme.
    if (!themeProps) {
      return element
    }

    const context = extendedConfig.context
    if (!context) {
      return (
        <Theme disable-child-theme {...themeProps}>
          {element}
        </Theme>
      )
    }

    const contextValue = React.useContext(context)
    let overriddenContextProps: object | undefined
    for (const key in context.props) {
      const value = props[key]
      if (value !== undefined) {
        ;(overriddenContextProps ||= {})[key] = value
      }
    }
    const Provider = context.Provider
    return (
      <Provider {...contextValue} {...overriddenContextProps}>
        <Theme disable-child-theme {...themeProps}>
          {element}
        </Theme>
      </Provider>
    )
  }

  if (extendedConfig.memo || process.env.TAMAGUI_MEMOIZE_STYLED_HOC) {
    out = React.memo(out)
  }

  const displayName = options?.displayName || (component as any)[componentDisplayName]
  if (displayName) {
    out.displayName = displayName
    out[componentDisplayName] = displayName
  }

  out.staticConfig = extendedConfig
  return out
}
