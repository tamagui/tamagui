import { setConfigFont } from './conf'
import { createFont } from './createFont'
import { Variable } from './createVariable'
import { DeepVariableObject, createVariables } from './createVariables'
import { registerCSSVariable, variableToCSS } from './helpers/registerCSSVariable'
import { GenericFont } from './types'

/**
 * Runtime dynamic insert font
 */
export function insertFont<A extends GenericFont>(name: string, fontIn: A): DeepVariableObject<A> {
  const font = createFont(fontIn)
  const tokened = createVariables(font, name) as GenericFont
  const parsed = parseFont(tokened) as DeepVariableObject<A>
  if (process.env.TAMAGUI_TARGET === 'web' && typeof document !== 'undefined') {
    const fontVars = registerFontVariables(parsed)
    const style = document.createElement('style')
    style.innerText = `:root .font_${name} {${fontVars.join(';')}}`
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
      let val = attr[key] as any
      // is a theme reference
      if (val.val?.[0] === '$') {
        val = val.val
      }
      parsed[attrKey][`$${key}`] = val
    }
  }
  return parsed
}

export function registerFontVariables(parsedFont: any) {
  const response: string[] = []

  for (const fkey in parsedFont) {
    if (fkey === 'family') {
      const val = parsedFont[fkey] as Variable
      registerCSSVariable(val)
      response.push(variableToCSS(val))
    } else {
      for (const fskey in parsedFont[fkey]) {
        const fval = parsedFont[fkey][fskey]
        if (typeof fval === 'string') {
          // no need to add its a theme reference like "$borderColor"
        } else {
          const val = parsedFont[fkey][fskey] as Variable
          registerCSSVariable(val)
          response.push(variableToCSS(val))
        }
      }
    }
  }
  return response
}
