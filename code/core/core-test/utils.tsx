import type { SplitStyleProps } from '../web/src'
import { getDefaultProps, getSplitStyles } from '../web/src'
import { defaultComponentState } from '../web/src/defaultComponentState'

const emptyObj = {} as any

const styleProps = {
  mediaState: undefined,
  isAnimated: false,
  resolveValues: 'auto',
} satisfies SplitStyleProps

export function simplifiedGetSplitStyles(
  component: any,
  props: Record<string, any>,
  options: {
    render?: string
    mediaState?: Record<string, any>
    mergeDefaultProps?: boolean
    theme?: any
    themeName?: string
  } = {}
) {
  // optionally merge in default props like createComponent does
  let mergedProps = props
  if (options.mergeDefaultProps) {
    const defaults = getDefaultProps(component.staticConfig, props.componentName)
    mergedProps = { ...defaults, ...props }
  }

  return getSplitStyles(
    mergedProps,
    component.staticConfig,
    options.theme ?? emptyObj,
    options.themeName ?? '',
    defaultComponentState,
    styleProps,
    emptyObj,
    {
      animationDriver: {},
      groups: {
        state: {},
      },
    } as any,
    undefined,
    options.render,
    true
  )!
}
