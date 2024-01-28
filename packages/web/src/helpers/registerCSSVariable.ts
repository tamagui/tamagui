import type { Variable } from '../createVariable'
import { createCSSVariable, getVariableValue } from '../createVariable'
import type { VariableVal } from '../types'

export const registerCSSVariable = (v: Variable | VariableVal) => {
  tokensValueToVariable.set(getVariableValue(v), v)
}

export const variableToCSS = (v: Variable, unitless = false) => {
  return `--${createCSSVariable(v.name, false)}:${
    !unitless && typeof v.val === 'number' ? `${v.val}px` : v.val
  }`
}

export const tokensValueToVariable = new Map<any, any>()
