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
