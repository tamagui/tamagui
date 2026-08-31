import {
  StyleObjectIdentifier,
  StyleObjectProperty,
  StyleObjectPseudo,
  StyleObjectRules,
  StyleObjectValue,
} from '@tamagui/helpers'
import type { SplitStyleProps } from '../web/src'
import { getConfig, getSplitStyles } from '../web/src'
import { getStyleStaticConfig } from '../web/src/helpers/styleStaticConfig'
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
    isAnimated?: boolean
    animationDriver?: Record<string, any>
    canPlatformPseudo?: boolean
    noClass?: boolean
    theme?: any
    themeName?: string
    groupContext?: any
  } = {}
) {
  const context = component.staticConfig.context
  const styleStaticConfig = getStyleStaticConfig(component.staticConfig, getConfig())
  const contextPropKeys = styleStaticConfig.styledContextKeys
  const styledContext = contextPropKeys
    ? {
        ...[...contextPropKeys].reduce<Record<string, any>>((next, key) => {
          next[key] = true
          return next
        }, {}),
        ...context.props,
      }
    : context?.props
  // optionally merge in default/context props like createComponent does
  let mergedProps = props
  if (options.mergeDefaultProps) {
    // mirror createComponent: styled() styles are a base layer, not props
    const { defaultProps } = styleStaticConfig
    ;[mergedProps] = mergeComponentProps(defaultProps, styledContext, props)
  }

  const styleProps = {
    mediaState: options.mediaState,
    isAnimated: options.isAnimated ?? false,
    canPlatformPseudo: options.canPlatformPseudo,
    noClass: options.noClass,
    resolveValues: 'auto',
    styledContext,
  } satisfies SplitStyleProps

  const result = getSplitStyles(
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
      animationDriver: options.animationDriver ?? {},
      groups: {
        state: {},
      },
    } as any,
    options.groupContext,
    options.render,
    true,
    undefined,
    undefined,
    styleStaticConfig
  )!
  return exposeClassProperties(result)
}

export function exposeClassProperties<T extends any>(result: T): T {
  for (const styleObject of Object.values(result?.rulesToInsert || {})) {
    const rule = styleObject as any
    const identifier = rule[StyleObjectIdentifier]
    for (const css of rule[StyleObjectRules] || []) {
      const declarations = css.matchAll(/[;{]([a-z][\w-]*):/g)
      for (const declaration of declarations) {
        const property = declaration[1].replace(/-([a-z])/g, (_, letter) =>
          letter.toUpperCase()
        )
        result.classNames[property] ??= identifier
      }
    }
  }
  return result
}

const toCSSProperty = (property: string) =>
  property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)

function declarationValue(rule: string, property: string) {
  const name = `${toCSSProperty(property)}:`
  let start = rule.indexOf(name)
  while (start !== -1) {
    const before = rule[start - 1]
    if (before === '{' || before === ';') {
      start += name.length
      const semicolon = rule.indexOf(';', start)
      const brace = rule.indexOf('}', start)
      const end =
        semicolon === -1 ? brace : brace === -1 ? semicolon : Math.min(semicolon, brace)
      return rule.slice(start, end === -1 ? undefined : end).trim()
    }
    start = rule.indexOf(name, start + name.length)
  }
}

export function rulesForProperty(result: any, property: string): string[] {
  const out: string[] = []
  for (const styleObject of Object.values(result.rulesToInsert || {})) {
    for (const rule of (styleObject as any)[StyleObjectRules] || []) {
      if (declarationValue(rule, property) !== undefined) out.push(rule)
    }
  }
  return out
}

export function getStyleValue(result: any, property: string): any {
  if (result.style?.[property] !== undefined) return result.style[property]
  for (const rule of rulesForProperty(result, property)) {
    const value = declarationValue(rule, property)
    if (value !== undefined) return value
  }
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
    for (const css of r[StyleObjectRules] || []) {
      const value = declarationValue(css, prop)
      if (value !== undefined && (pseudo === undefined || css.includes(`:${pseudo}`))) {
        return [prop, value, r[StyleObjectIdentifier], pseudo, [css]]
      }
    }
  }
  return null
}

// find ANY rule by property name (for tests that don't care about modifiers)
export function findAnyRule(rulesToInsert: any, prop: string) {
  for (const rule of Object.values(rulesToInsert || {})) {
    const r = rule as any
    if (r[StyleObjectProperty] === prop) {
      return r
    }
    for (const css of r[StyleObjectRules] || []) {
      const value = declarationValue(css, prop)
      if (value !== undefined) {
        return [prop, value, r[StyleObjectIdentifier], r[StyleObjectPseudo], [css]]
      }
    }
  }
  return null
}
