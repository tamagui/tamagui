import type { SplitStyleProps, TamaguiComponentState } from '@tamagui/web'
import { getSplitStyles, normalizeStyle } from '@tamagui/web'
import {
  StyleObjectIdentifier,
  StyleObjectProperty,
  StyleObjectPseudo,
  StyleObjectRules,
} from '@tamagui/helpers'

const emptyObj = {} as any

const mountedState: TamaguiComponentState = {
  hover: false,
  press: false,
  pressIn: false,
  focus: false,
  focusVisible: false,
  focusWithin: false,
  unmounted: false,
  disabled: false,
}

/**
 * Runs the shared renderer with a Tailwind component. `getSplitStyles` follows
 * the component's descriptor for static-config normalization and direct-caller
 * preprocessing, which is the same package-selected path production uses.
 */
export function splitTailwindStyles(
  component: { staticConfig: any },
  props: Record<string, any>,
  options: {
    mediaState?: Record<string, any>
    componentState?: Partial<TamaguiComponentState>
    theme?: any
    themeName?: string
    groupContext?: any
  } = {}
) {
  const styleProps = {
    mediaState: options.mediaState,
    isAnimated: false,
    resolveValues: 'auto',
  } satisfies SplitStyleProps

  const result = getSplitStyles(
    props,
    component.staticConfig,
    options.theme ?? emptyObj,
    options.themeName ?? '',
    {
      ...mountedState,
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
    undefined,
    true
  )!
  return result
}

function cssRuleApplies(rule: string, pseudo?: string) {
  const hasState = rule.includes(':where(:')
  const hasWrapper = rule.startsWith('@media') || rule.startsWith('@container')
  if (!pseudo) return !hasState && !hasWrapper
  if (hasState) return rule.includes(`:${pseudo}`)
  return !hasWrapper
}

function applyLogicalAliases(style: Record<string, any>) {
  for (const [logical, targets] of [
    ['paddingInline', ['paddingLeft', 'paddingRight']],
    ['paddingInlineStart', ['paddingLeft']],
    ['paddingInlineEnd', ['paddingRight']],
    ['marginInline', ['marginLeft', 'marginRight']],
    ['marginInlineStart', ['marginLeft']],
    ['marginInlineEnd', ['marginRight']],
    ['borderInlineWidth', ['borderLeftWidth', 'borderRightWidth']],
    ['borderInlineStartWidth', ['borderLeftWidth']],
    ['borderInlineEndWidth', ['borderRightWidth']],
    ['borderInlineColor', ['borderLeftColor', 'borderRightColor']],
    ['borderInlineStartColor', ['borderLeftColor']],
    ['borderInlineEndColor', ['borderRightColor']],
  ] as const) {
    const value = style[logical]
    if (value === undefined) continue
    for (const target of targets) style[target] = value
  }
}

function applyCSSRule(style: Record<string, any>, rule: string) {
  const start = rule.lastIndexOf('{') + 1
  const end = rule.lastIndexOf('}')
  if (!start || end < start) return
  for (const declaration of rule.slice(start, end).split(';')) {
    const colon = declaration.indexOf(':')
    if (colon === -1) continue
    const property = declaration
      .slice(0, colon)
      .trim()
      .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
    const value = declaration.slice(colon + 1).trim()
    const normalized = normalizeStyle({ [property]: value })
    applyLogicalAliases(normalized)
    Object.assign(style, normalized)
  }
}

function resolvedRuleStyle(rules: readonly string[], pseudo?: string) {
  const style: Record<string, any> = {}
  for (const rule of rules) {
    if (cssRuleApplies(rule, pseudo)) applyCSSRule(style, rule)
  }
  return style
}

export function resolvedStyle(result: any, pseudo?: string): Record<string, any> {
  const style: Record<string, any> = { ...result.style }
  for (const styleObject of Object.values(result.rulesToInsert || {})) {
    Object.assign(
      style,
      resolvedRuleStyle((styleObject as any)[StyleObjectRules] || [], pseudo)
    )
  }
  return style
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
    const rules = r[StyleObjectRules] || []
    const value = resolvedRuleStyle(rules, pseudo)[prop]
    if (value !== undefined) {
      return [prop, value, r[StyleObjectIdentifier], pseudo, rules]
    }
  }
  return null
}

/** the resolved native style record, which is what native components render with */
export function styleOf(result: { style?: any }): Record<string, any> {
  return (result.style || {}) as Record<string, any>
}
