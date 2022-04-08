// @ts-ignore
import { useInsertionEffect } from 'react'

import { getStylesAtomic } from './getStylesAtomic'
import { insertStyleRule } from './insertStyleRule'

// TODO can drop most of this code once we drop support for 17
// uses new useInsertionEffect for better perf if available

// could be cleared occasionally
let added = new Set<string>()

export function useStylesAsClassname(styles: any[], disable = false) {
  if (!useInsertionEffect) {
    return addStylesUsingClassname(styles)
  } else {
    const insertions: any[] = []
    const className = addStylesUsingClassname(disable ? [] : styles, (identifier, rules) => {
      for (const rule of rules) {
        insertions.push({ identifier, rule })
      }
    })
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
  onAdd?: (identifier: string, rules: string[]) => any
) {
  let className = ''
  for (const style of styles) {
    if (!style) continue
    if (Array.isArray(style)) {
      className += ' ' + addStylesUsingClassname(style)
      continue
    }
    for (const { identifier, rules } of getStylesAtomic(style)) {
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
