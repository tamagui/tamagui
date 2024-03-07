import { CSS_VARIABLE_PREFIX } from '../constants/constants'
import type { Variable } from '../createVariable'
import { createCSSVariable, getVariableValue } from '../createVariable'
import type { VariableVal } from '../types'

export const registerCSSVariable = (v: Variable | VariableVal) => {
  tokensValueToVariable.set(getVariableValue(v), v)
}

export const variableToCSS = (v: Variable, unitless = false) => {
  const _prefix = process.env.TAMAGUI_CSS_VARIABLE_PREFIX || CSS_VARIABLE_PREFIX
  return `--${_prefix}${createCSSVariable(v.name, false)}:${
    !unitless && typeof v.val === 'number' ? `${v.val}px` : v.val
  }`
}

export const tokensValueToVariable = new Map<any, any>()
