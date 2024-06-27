import type { SplitStyleProps} from '../core/src';
import { getSplitStyles } from '../core/src'
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
    {
      animationDriver: {},
      groups: {
        state: {},
      },
    } as any,
    options.tag,
    true
  )
}
