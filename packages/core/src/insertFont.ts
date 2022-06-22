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
  registerFontVariables(parsed)
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

export function registerFontVariables(parsedFont: any) {
  for (const fkey in parsedFont) {
    if (fkey === 'family') {
      registerCSSVariable(parsedFont[fkey])
    } else {
      for (const fskey in parsedFont[fkey]) {
        const fval = parsedFont[fkey][fskey]
        if (typeof fval === 'string') {
          // no need to add its a theme reference
          // tokenRules.add(`--var()`)
        } else {
          registerCSSVariable(parsedFont[fkey][fskey])
        }
      }
    }
  }
}
