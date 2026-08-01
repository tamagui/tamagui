import React, { type ReactNode, type Ref as ReactRef } from 'react'
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
  StyledHOCMergedProps<
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

  out.staticConfig = extendedConfig
  return out
}
