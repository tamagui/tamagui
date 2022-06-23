import { isWeb } from '@tamagui/core'
import { setConfigFont } from './conf'
import { createFont } from './createFont'
import { Variable } from './createVariable'
import { DeepVariableObject, createVariables } from './createVariables'
import { registerCSSVariable } from './helpers/registerCSSVariable'
import { GenericFont } from './types'

export function insertFont<A extends GenericFont>(name: string, fontIn: A): DeepVariableObject<A> {
  const font = createFont(fontIn)
  const tokened = createVariables(font, name) as GenericFont
  const parsed = parseFont(tokened) as DeepVariableObject<A>
  if (isWeb && typeof document !== 'undefined') {
    const css = registerFontVariables(parsed, true)
    const style = document.createElement('style')
    style.innerText = `:root {${css}}`
    style.setAttribute('data-tamagui-font', name)
    document.head.appendChild(style)
  }
  setConfigFont(name, tokened, parsed)
  return parsed
}

export function parseFont<A extends GenericFont>(definition: A): DeepVariableObject<A> {
  const parsed: any = {}
  for (const attrKey in definition) {
    const attr = definition[attrKey]
    if (attrKey === 'family') {
      parsed[attrKey] = attr
      continue
    }
    parsed[attrKey] = {}
    for (const key in attr) {
      let val = attr[key] as any as Variable
      // is a theme reference
      if (val.val[0] === '$') {
        val = val.val
      }
      parsed[attrKey][`$${key}`] = val
    }
  }
  return parsed
}

export function registerFontVariables(parsedFont: any, collect = false) {
  let vals = ''
  for (const fkey in parsedFont) {
    if (fkey === 'family') {
      const val = registerCSSVariable(parsedFont[fkey])
      if (collect) vals += val + ';'
    } else {
      for (const fskey in parsedFont[fkey]) {
        const fval = parsedFont[fkey][fskey]
        if (typeof fval === 'string') {
          // no need to add its a theme reference like "$borderColor"
        } else {
          const val = registerCSSVariable(parsedFont[fkey][fskey])
          if (collect) vals += val + ';'
        }
      }
    }
  }
  return vals
}
