// @ts-ignore
import { useInsertionEffect } from 'react'

import { getStylesAtomic } from './getStylesAtomic'
import { insertStyleRule } from './insertStyleRule'

// can be cleared occasionally
let added = new Set<string>()
let cached = new Map()

// TODO use upcoming react method for inserting

export function addStylesUsingClassname(styles: any[]) {
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
      for (const rule of rules) {
        insertStyleRule(rule)
      }
    }
  }
  return className
}

export function useStylesAsClassname(styles: any[]) {
  let className = ''
  let insertions: any[] = []

  for (const style of styles.flat(1)) {
    if (!style) continue
    for (const key in style) {
      const cacheKey = `${key}${style[key]}`
      if (cached.has(cacheKey)) {
        className += ` ${cached.get(cacheKey)}`
        continue
      }
      let cns = ``
      for (const { identifier, rules } of getStylesAtomic({ [key]: style[key] })) {
        cns += ` ${identifier}`
        for (const rule of rules) {
          insertions.push(rule)
        }
      }
      cached.set(cacheKey, cns)
      className += cns
    }
  }

  useInsertionEffect(() => {
    for (const ruleset of insertions) {
      insertStyleRule(ruleset)
    }
  })

  return className
}
