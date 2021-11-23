// @ts-ignore
import { useInsertionEffect } from 'react'

import { getStylesAtomic } from './getStylesAtomic'
import { insertStyleRule } from './insertStyleRule'

// uses new useInsertionEffect for better perf if available

// could be cleared occasionally
let added = new Set<string>()

export function useStylesAsClassname(styles: any[]) {
  if (!useInsertionEffect) {
    return addStylesUsingClassname(styles)
  } else {
    const insertions: any[] = []
    const className = addStylesUsingClassname(styles, (_, rules) => {
      for (const rule of rules) {
        insertions.push(rule)
      }
    })

    useInsertionEffect(() => {
      for (const ruleset of insertions) {
        insertStyleRule(ruleset)
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
        for (const rule of rules) {
          insertStyleRule(rule)
        }
      }
    }
  }
  return className
}
