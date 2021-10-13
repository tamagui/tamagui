import { getStylesAtomic } from '@tamagui/helpers'

import { insertStyleRule } from './insertStyleRule'

let added = {}

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
      if (added[identifier]) {
        continue
      }
      added[identifier] = true
      for (const rule of rules) {
        insertStyleRule(rule)
      }
    }
  }
  return className
}
