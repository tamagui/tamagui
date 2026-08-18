import { normalizeCSSColor } from '@tamagui/normalize-css-color'
import { createCSSVariable, getVariableValue } from '../createVariable'
import type { Variable, VariableVal } from '../types'

/**
 * The dedupe key for a declared value. Equivalent color spellings are one
 * declaration, so `#333`, `hsl(0, 0%, 20%)` and `hsla(0, 0%, 20%, 1)` share a
 * variable and the artifact carries the color once. Non-colors key on
 * themselves, and a canonical key is written as `#rrggbbaa`, which is itself a
 * color spelling and therefore can never be a non-color raw value.
 *
 * Only the key is canonical. The emitted declaration keeps the spelling the
 * config author wrote, so nothing here rewrites bytes into a longer form.
 *
 * This runs where CSS is generated, so a build that owns its CSS artifact
 * drops it with the rest of the generator.
 */
const variableKey = (val: Variable | VariableVal) => {
  if (typeof val !== 'string') return val
  const color = normalizeCSSColor(val)
  return color == null ? val : `#${color.toString(16).padStart(8, '0')}`
}

export const registerCSSVariable = (v: Variable | VariableVal) => {
  if (!process.env.TAMAGUI_DID_OUTPUT_CSS) {
    tokensValueToVariable.set(variableKey(getVariableValue(v)), v)
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
  const key = variableKey(val)
  if (tokensValueToVariable.has(key)) {
    return tokensValueToVariable.get(key)!
  }
  const name = `t${autoVarId++}`
  const variable = `var(--${name})`
  const v = { val, name, variable } as Variable
  tokensValueToVariable.set(key, v)
  autoVariables.push(v)
  return v
}

// For mutated themes (runtime theme changes like in /theme builder)
// Uses same 't' prefix but starts at 10000 to avoid conflicts with SSR-generated vars
let mutatedVarId = 10000
export const mutatedAutoVariables: Variable[] = []
const mutatedTokensValueToVariable = new Map<any, any>()

export const getOrCreateMutatedVariable = (val: any): Variable => {
  const key = variableKey(val)
  if (mutatedTokensValueToVariable.has(key)) {
    return mutatedTokensValueToVariable.get(key)!
  }
  const name = `t${mutatedVarId++}`
  const variable = `var(--${name})`
  const v = { val, name, variable } as Variable
  mutatedTokensValueToVariable.set(key, v)
  mutatedAutoVariables.push(v)
  return v
}
