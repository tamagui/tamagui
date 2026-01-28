import { createCSSVariable, getVariableValue } from '../createVariable'
import type { Variable, VariableVal } from '../types'

export const registerCSSVariable = (v: Variable | VariableVal) => {
  if (!process.env.TAMAGUI_DID_OUTPUT_CSS) {
    tokensValueToVariable.set(getVariableValue(v), v)
  }
}

export const variableToCSS = (v: Variable, unitless = false) => {
  if (!process.env.TAMAGUI_DID_OUTPUT_CSS) {
    return `--${process.env.TAMAGUI_CSS_VARIABLE_PREFIX || ''}${createCSSVariable(
      v.name,
      false
    )}:${!unitless && typeof v.val === 'number' ? `${v.val}px` : v.val}`
  }
  return ''
}

export const tokensValueToVariable = new Map<any, any>()

// auto-generated vars for theme values not in tokens
let autoVarId = 0
export const autoVariables: Variable[] = []

export const getOrCreateVariable = (val: any): Variable => {
  if (tokensValueToVariable.has(val)) {
    return tokensValueToVariable.get(val)!
  }
  const name = `t${autoVarId++}`
  const variable = `var(--${name})`
  const v = { val, name, variable } as Variable
  tokensValueToVariable.set(val, v)
  autoVariables.push(v)
  return v
}
