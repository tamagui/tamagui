import React, { type ReactNode, type Ref as ReactRef } from 'react'
import { HOC_REPLAY } from './contexts/ComponentContext'
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
  component: TamaguiComponent<
    Props,
    Ref,
    NonStyledProps,
    BaseStyles,
    VariantProps,
    ParentStaticProperties
  >,
  render: (
    props: NoInfer<
      Props extends TamaDefer
        ? GetFinalProps<NonStyledProps, BaseStyles, VariantProps>
        : Props
    > &
      CustomProps,
    ref?: ReactRef<NoInfer<Ref>>
  ) => ReactNode,
  options?: StyledHOCOptions
): TamaguiComponent<
  // with no custom props the wrapper adds nothing to the prop surface, so keep
  // the base component's deferred props: styled() then composes it through the
  // same lazy path as any styled component instead of re-expanding a fully
  // computed prop type (which hits TS2590 "union too complex" downstream)
  keyof CustomProps extends never
    ? Props
    : StyledHOCMergedProps<
        Props extends TamaDefer
          ? GetFinalProps<NonStyledProps, BaseStyles, VariantProps>
          : Props,
        CustomProps
      >,
  Ref,
  NonStyledProps & CustomProps,
  BaseStyles,
  VariantProps,
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
  extendedConfig[HOC_REPLAY] = staticConfig[HOC_REPLAY] || staticConfig

  let out: any = function StyledHOCComponent(props: any) {
    'use no memo'

    const { ref, ...rest } = props
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
