import { TamaguiComponent, getSplitStyles } from '../core/src'

export function simplifiedGetSplitStyles(
  component: TamaguiComponent,
  props: Record<string, any>,
  tag?: string,
  mediaState?: Record<string, any>
) {
  return getSplitStyles(
    props,
    component.staticConfig,
    {} as any,
    {
      hover: false,
      press: false,
      pressIn: false,
      focus: false,
      unmounted: true,
      mediaState,
    },
    undefined,
    undefined,
    tag,
    true
  )
}
