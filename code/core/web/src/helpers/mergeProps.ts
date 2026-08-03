/**
 * Preserves prop ordering, so that the order most closely matches the last spread objects
 * Useful for having { ...defaultProps, ...props } that ensure props ordering is always kept
 *
 * Honestly this is somehwat backwards logically from Object.assign, reason was that we typically
 * are merging defaultProps, givenProps, but we started using it elsewhere and now its a bit confusing
 * Should look into refactoring this to match common usage
 *
 *    Given:
 *      mergeProps({ a: 1, b: 2 }, { b: 1, a: 2 })
 *    The final key order will be:
 *      b, a
 *
 */

import { stylePropsAll, stylePropsTransform } from '@tamagui/helpers'
import {
  mergePrograms,
  transformFamilyProps,
  type ParsedValue,
} from '@tamagui/style-grammar/runtime'

import { getConfigMaybe } from '../config'
import { createGrammarRuntimeContext, type GrammarRuntimeContext } from './grammarConfig'
import { getCachedPrograms, setProgramCacheContext } from './programCache'

export type GenericProps = Record<string, any>

let grammarContext: GrammarRuntimeContext | null = null

export const mergeProps = (defaultProps: object, props: object) => {
  const out: GenericProps = {}

  // in general objects keys are sorted by order of insertion
  // we merge "defaultProps" first as they should come first
  // (so Object.keys(finalProps) will list [...defaultPropKeys] first)
  // but we ignore any keys from props, and merge it after, that way
  // final order is [...defaultPropKeys, ...propKeys]

  // ⚠️ keep in sync with mergeComponentProps logic

  for (const key in defaultProps) {
    if (key in props) continue
    out[key] = defaultProps[key]
  }

  for (const key in props) {
    mergeProp(out, defaultProps, props, key)
  }

  return out
}

// merge props but also handles defaultProps + styledContext
export const mergeComponentProps = (
  // this is "a" in mergeProps
  defaultProps: object | null | undefined,
  contextProps: object | undefined,
  // this is "b" in mergeProps
  props: object
) => {
  let overriddenContext: GenericProps | null = null

  if (!defaultProps && !contextProps) {
    return [props, overriddenContext] as const
  }

  if (defaultProps && !contextProps) {
    return [mergeProps(defaultProps, props), overriddenContext] as const
  }

  // the only unique case is contextProps, we need to track overrides and do something a bit tricky
  // since we respect prop order for styles, we want to preserve the object key order in overriddenContext

  const out: GenericProps = {}

  // ⚠️ keep in sync with mergeProps logic
  // same logic as mergeProps but tracking overrides!

  for (const key in defaultProps) {
    if (key in props) continue
    out[key] = defaultProps[key]
  }

  // styled context props go after defaultProps but before props
  for (const key in contextProps) {
    if (key in props) continue
    const contextValue = contextProps[key]
    // don't merge undefined context values to preserve inheritance
    if (contextValue !== undefined) {
      out[key] = contextValue
    }
  }

  for (const key in props) {
    mergeProp(out, defaultProps, props, key)
    if (contextProps && key in contextProps) {
      overriddenContext ||= {}
      overriddenContext[key] = props[key]
    }
  }

  return [out, overriddenContext] as const
}

function mergeProp(
  out: GenericProps,
  defaultProps: object | undefined | null,
  props: object,
  key: string
) {
  let val = props[key]

  if (
    defaultProps &&
    key in defaultProps &&
    typeof defaultProps[key] === 'string' &&
    typeof val === 'string' &&
    (defaultProps[key].indexOf(':') !== -1 || val.indexOf(':') !== -1)
  ) {
    const config = getConfigMaybe()
    const property = config?.shorthands[key] || key
    if (
      config &&
      property in stylePropsAll &&
      (!(property in stylePropsTransform) || transformFamilyProps.has(property))
    ) {
      const context = createGrammarRuntimeContext(config)
      if (context !== grammarContext) {
        grammarContext = context
        setProgramCacheContext({
          registry: context.registry,
          configRevision: context.configRevision,
          colorTokens: context.colorTokens,
        })
      }

      const earlier = getCachedPrograms(property, defaultProps[key])
      const later = getCachedPrograms(property, val)
      if (earlier.programs && later.programs) {
        let hasClauses = false
        for (const entry of earlier.programs) {
          if (entry.value.clauses.length) {
            hasClauses = true
            break
          }
        }
        if (!hasClauses) {
          for (const entry of later.programs) {
            if (entry.value.clauses.length) {
              hasClauses = true
              break
            }
          }
        }

        if (hasClauses) {
          const entries: Array<{ prop: string; value: ParsedValue }> = []
          for (const entry of earlier.programs) {
            entries.push({ prop: entry.property, value: entry.value })
          }
          for (const entry of later.programs) {
            entries.push({ prop: entry.property, value: entry.value })
          }

          for (const program of mergePrograms(entries).values()) {
            const parts: string[] = []
            if (program.value.base !== null) {
              parts.push(program.value.base)
            }
            for (const clause of program.value.clauses) {
              parts.push(`${clause.modifiers.join(':')}:${clause.payload}`)
            }
            delete out[program.property]
            out[program.property] = parts.join(' ')
          }
          return
        }
      }
    }
  }

  out[key] = val
}
