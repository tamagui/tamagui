import { TamaguiComponent, defaultComponentState, getSplitStyles } from '../core/src'

const emptyObj = {} as any

const styleProps = {
  mediaState: undefined,
  isAnimated: false,
}

export function simplifiedGetSplitStyles(
  component: TamaguiComponent,
  props: Record<string, any>,
  options: {
    tag?: string
    mediaState?: Record<string, any>
  } = {}
) {
  return getSplitStyles(
    props,
    component.staticConfig,
    emptyObj,
    '',
    defaultComponentState,
    styleProps,
    emptyObj,
    emptyObj,
    options.tag,
    true
  )
}
