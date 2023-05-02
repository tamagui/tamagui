import { Variable, createCSSVariable } from '../createVariable'

export const registerCSSVariable = (v: Variable) => {
  tokensValueToVariable.set(v.val, v)
}

export const variableToCSS = (v: Variable, unitless = false) => {
  return `--${createCSSVariable(v.name, false)}:${
    !unitless && typeof v.val === 'number' ? `${v.val}px` : v.val
  }`
}

export const tokensValueToVariable = new Map<any, any>()
