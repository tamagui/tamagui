import { Variable, createCSSVariable } from '../createVariable'

export const registerCSSVariable = (v: Variable) => {
  tokensValueToVariable.set(v.val, v)
  const val = `--${createCSSVariable(v.name, false)}:${
    typeof v.val === 'number' ? `${v.val}px` : v.val
  }`
  tokenRules.add(val)
  return val
}

export const tokensValueToVariable = new Map<string, Variable>()
export const tokenRules = new Set<string>()
