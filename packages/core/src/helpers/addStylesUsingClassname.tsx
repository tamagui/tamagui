// @ts-ignore
import { useInsertionEffect } from 'react'

import { getStylesAtomic } from './getStylesAtomic'
import { insertStyleRule, updateInsertedCache } from './insertStyleRule'

// TODO can drop most of this code once we drop support for 17
// uses new useInsertionEffect for better perf if available

// could be cleared occasionally
let added = new Set<string>()

export function useStylesAsClassname(styles: any[], disable = false, debug = false) {
  if (!useInsertionEffect) {
    return addStylesUsingClassname(disable ? styles : [], debug)
  } else {
    const insertions: any[] = []
    const className = addStylesUsingClassname(disable ? [] : styles, debug, (identifier, rules) => {
      for (const rule of rules) {
        insertions.push({ identifier, rule })
      }
    })
    // avoid race conditions in lookups because useInsertionEffect is delayed
    for (const { identifier, rule } of insertions) {
      updateInsertedCache(identifier, rule)
    }
    useInsertionEffect(() => {
      for (const { identifier, rule } of insertions) {
        insertStyleRule(identifier, rule)
      }
    })
    return className
  }
}

export function addStylesUsingClassname(
  styles: any[],
  debug: boolean | 'verbose' = false,
  onAdd?: (identifier: string, rules: string[]) => any
) {
  let className = ''
  for (const style of styles) {
    if (!style) continue
    if (Array.isArray(style)) {
      className += ' ' + addStylesUsingClassname(style)
      continue
    }
    const atomicStyles = getStylesAtomic(style)
    if (process.env.NODE_ENV === 'development') {
      if (debug === 'verbose') {
        console.log(' atomicStyles ', atomicStyles)
      }
    }
    for (const { identifier, rules } of atomicStyles) {
      className += ` ${identifier}`
      if (added.has(identifier)) {
        continue
      }
      added.add(identifier)
      if (onAdd) {
        onAdd(identifier, rules)
      } else {
        insertStyleRule(identifier, rules[0])
      }
    }
  }
  return className
}
