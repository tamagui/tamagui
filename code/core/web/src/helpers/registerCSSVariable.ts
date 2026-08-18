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
    const key = variableKey(getVariableValue(v))
    if (!tokensValueToVariable.has(key) && tokensValueToVariable.size >= 10_000) {
      rollAutoVariableGeneration()
    }
    tokensValueToVariable.set(key, v)
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

// auto-generated vars for theme values not in tokens. the current generation
// stays object-backed for dedupe; completed generations are serialized because
// emitted CSS may retain their variable names for the rest of this CSS session.
let autoVarId = 0
export const autoVariables: Variable[] = []
const archivedAutoVariableCSS: string[] = []

const serializeVariables = (variables: Variable[]) =>
  variables.map((v) => `--${v.name}:${v.val}`).join(';')

const rollAutoVariableGeneration = () => {
  if (autoVariables.length) {
    archivedAutoVariableCSS.push(serializeVariables(autoVariables))
    autoVariables.length = 0
  }
  tokensValueToVariable.clear()
}

export const getAutoVariableCSS = () =>
  [...archivedAutoVariableCSS, serializeVariables(autoVariables)]
    .filter(Boolean)
    .join(';')

export const getOrCreateVariable = (val: any): Variable => {
  const key = variableKey(val)
  if (tokensValueToVariable.has(key)) {
    return tokensValueToVariable.get(key)!
  }
  if (tokensValueToVariable.size >= 10_000) {
    rollAutoVariableGeneration()
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
const archivedMutatedAutoVariableCSS: string[] = []

const rollMutatedAutoVariableGeneration = () => {
  if (mutatedAutoVariables.length) {
    archivedMutatedAutoVariableCSS.push(serializeVariables(mutatedAutoVariables))
    mutatedAutoVariables.length = 0
  }
  mutatedTokensValueToVariable.clear()
}

export const getMutatedAutoVariableCSS = () =>
  [...archivedMutatedAutoVariableCSS, serializeVariables(mutatedAutoVariables)]
    .filter(Boolean)
    .join(';')

export const getOrCreateMutatedVariable = (val: any): Variable => {
  const key = variableKey(val)
  if (mutatedTokensValueToVariable.has(key)) {
    return mutatedTokensValueToVariable.get(key)!
  }
  if (mutatedTokensValueToVariable.size >= 10_000) {
    rollMutatedAutoVariableGeneration()
  }
  const name = `t${mutatedVarId++}`
  const variable = `var(--${name})`
  const v = { val, name, variable } as Variable
  mutatedTokensValueToVariable.set(key, v)
  mutatedAutoVariables.push(v)
  return v
}

/** cache-generation sizes for development diagnostics and behavior probes */
export const getCSSVariableCacheStats = () => ({
  auto: tokensValueToVariable.size,
  autoDeclarations: autoVariables.length,
  mutated: mutatedTokensValueToVariable.size,
  mutatedDeclarations: mutatedAutoVariables.length,
})
