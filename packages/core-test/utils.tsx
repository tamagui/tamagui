import { TamaguiComponent, getSplitStyles } from '../core/src'

const emptyObj = {} as any
const componentState = {
  hover: false,
  press: false,
  pressIn: false,
  focus: false,
  unmounted: true,
}
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
    componentState,
    styleProps,
    emptyObj,
    emptyObj,
    options.tag,
    true
  )
}
