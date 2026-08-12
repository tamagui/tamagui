import React, { type ReactNode, type Ref as ReactRef } from 'react'
import {
  componentDisplayName,
  setComponentDisplayName,
} from './helpers/componentDisplayName'
import { themeable } from './helpers/themeable'
import type {
  GetFinalProps,
  StaticConfig,
  StyledHOCMergedProps,
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

  let out: any = function StyledHOCComponent(props: any) {
    const { ref, ...rest } = props
    return render(rest, ref)
  }

  out = options?.disableTheme ? out : themeable(out, extendedConfig, true)

  if (extendedConfig.memo || process.env.TAMAGUI_MEMOIZE_STYLED_HOC) {
    out = React.memo(out)
  }

  const displayName = options?.displayName || (component as any)[componentDisplayName]
  setComponentDisplayName(out, displayName)

  out.staticConfig = extendedConfig
  return out
}
