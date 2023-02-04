import { Variable, createCSSVariable } from '../createVariable'

export const registerCSSVariable = (v: Variable) => {
  tokensValueToVariable.set(v.val, v)
}

export const variableToCSS = (v: Variable) => {
  return `--${createCSSVariable(v.name, false)}:${
    typeof v.val === 'number' ? `${v.val}px` : v.val
  }`
}

export const tokensValueToVariable = new Map<any, any>()
