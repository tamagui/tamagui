import {
  StyleObjectIdentifier,
  StyleObjectProperty,
  StyleObjectPseudo,
} from '@tamagui/helpers'
import type { SplitStyleProps } from '../web/src'
import { getDefaultProps, getSplitStyles } from '../web/src'
import { defaultComponentState } from '../web/src/defaultComponentState'
import { mergeComponentProps } from '../web/src/helpers/mergeProps'

const emptyObj = {} as any

export function simplifiedGetSplitStyles(
  component: any,
  props: Record<string, any>,
  options: {
    render?: string
    mediaState?: Record<string, any>
    componentState?: Partial<typeof defaultComponentState>
    mergeDefaultProps?: boolean
    theme?: any
    themeName?: string
    groupContext?: any
  } = {}
) {
  const context = component.staticConfig.context
  const contextPropKeys = component.staticConfig.contextProps || context?.propKeys
  const styledContext = contextPropKeys
    ? {
        ...contextPropKeys.reduce<Record<string, any>>((next, key) => {
          next[key] = true
          return next
        }, {}),
        ...(context.props || {}),
      }
    : context?.props
  // optionally merge in default/context props like createComponent does
  let mergedProps = props
  if (options.mergeDefaultProps) {
    const defaults = getDefaultProps(component.staticConfig, props.componentName)
    ;[mergedProps] = mergeComponentProps(defaults, styledContext, props)
  }

  const styleProps = {
    mediaState: options.mediaState,
    isAnimated: false,
    resolveValues: 'auto',
    styledContext,
  } satisfies SplitStyleProps

  return getSplitStyles(
    mergedProps,
    component.staticConfig,
    options.theme ?? emptyObj,
    options.themeName ?? '',
    {
      ...defaultComponentState,
      ...options.componentState,
    },
    styleProps,
    emptyObj,
    {
      animationDriver: {},
      groups: {
        state: {},
      },
    } as any,
    options.groupContext,
    options.render,
    true
  )!
}

// find a rule by CSS property name, optionally filtering by pseudo state
export function findRule(rulesToInsert: any, prop: string, pseudo?: string) {
  for (const rule of Object.values(rulesToInsert || {})) {
    const r = rule as any
    if (r[StyleObjectProperty] === prop) {
      if (pseudo === undefined) {
        if (
          r[StyleObjectPseudo] === undefined &&
          !r[StyleObjectIdentifier]?.includes('_sm') &&
          !r[StyleObjectIdentifier]?.includes('_md')
        ) {
          return r
        }
      } else if (r[StyleObjectPseudo] === pseudo) {
        return r
      }
    }
  }
  return null
}

// find ANY rule by property name (for tests that don't care about modifiers)
export function findAnyRule(rulesToInsert: any, prop: string) {
  for (const rule of Object.values(rulesToInsert || {})) {
    if ((rule as any)[StyleObjectProperty] === prop) {
      return rule as any
    }
  }
  return null
}
