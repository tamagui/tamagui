import React, { type ReactNode, type Ref as ReactRef } from 'react'
import { themeable } from './helpers/themeable'
import type {
  GetFinalProps,
  StaticConfig,
  StyledHOCFactory,
  StyledHOCOptions,
  TamaguiComponent,
  TamaDefer,
} from './types'

export function createStyledHOC<
  Props,
  Ref,
  NonStyledProps,
  BaseStyles extends object,
  VariantProps,
  ParentStaticProperties,
>(
  component: TamaguiComponent<
    Props,
    Ref,
    NonStyledProps,
    BaseStyles,
    VariantProps,
    ParentStaticProperties
  >
): StyledHOCFactory<
  Props extends TamaDefer
    ? GetFinalProps<NonStyledProps, BaseStyles, VariantProps>
    : Props,
  Ref,
  NonStyledProps,
  BaseStyles,
  VariantProps,
  ParentStaticProperties
> {
  const staticConfig = component.staticConfig

  return function createStyledHOCComponent(
    Component: (props: any, ref?: ReactRef<Ref>) => ReactNode,
    options?: StyledHOCOptions
  ) {
    const extendedConfig: StaticConfig = {
      ...staticConfig,
      ...options?.staticConfig,
      neverFlatten: true,
      isHOC: true,
      isStyledHOC: false,
    }

    let out: any = function StyledHOCComponent(props: any) {
      const { ref, ...rest } = props
      return Component(rest, ref)
    }

    out = options?.disableTheme ? out : themeable(out, extendedConfig, true)

    if (extendedConfig.memo || process.env.TAMAGUI_MEMOIZE_STYLED_HOC) {
      out = React.memo(out)
    }

    out.staticConfig = extendedConfig
    return out
  } as any
}
