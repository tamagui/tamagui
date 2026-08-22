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

/**
 * Bumped whenever anything the emitted CSS derives from the shared value map
 * changes: a token registering (which can re-point a value another config
 * already resolved) or an auto variable being created. `getCSS` caches its
 * configuration-static half against this, so it must move for both.
 */
let variableGeneration = 0
export const getVariableGeneration = () => variableGeneration

export const registerCSSVariable = (v: Variable | VariableVal) => {
  if (!process.env.TAMAGUI_DID_OUTPUT_CSS) {
    const key = variableKey(getVariableValue(v))
    if (tokensValueToVariable.has(key) || tokensValueToVariable.size < 10_000) {
      tokensValueToVariable.set(key, v)
      variableGeneration++
    }
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

// auto-generated vars for theme values not in tokens. this CSS session owns at
// most 10,000 variable declarations. later values stay literal, because
// evicting or renaming a variable could invalidate CSS that still references it.
let autoVarId = 0
export const autoVariables: Variable[] = []

const serializeVariables = (variables: Variable[]) =>
  variables.map((v) => `--${v.name}:${v.val}`).join(';')

export const getAutoVariableCSS = () => serializeVariables(autoVariables)

export const getOrCreateVariable = (val: any): Variable => {
  const key = variableKey(val)
  if (tokensValueToVariable.has(key)) {
    return tokensValueToVariable.get(key)!
  }
  if (tokensValueToVariable.size >= 10_000) {
    return { val, name: '', variable: String(val) } as Variable
  }
  const name = `t${autoVarId++}`
  const variable = `var(--${name})`
  const v = { val, name, variable } as Variable
  tokensValueToVariable.set(key, v)
  autoVariables.push(v)
  variableGeneration++
  return v
}

// for runtime theme changes, use a disjoint 10,000-id range. like normal auto
// variables, later values stay literal instead of recycling a live name.
let mutatedVarId = 10000
export const mutatedAutoVariables: Variable[] = []
const mutatedTokensValueToVariable = new Map<any, any>()

export const getMutatedAutoVariableCSS = () => serializeVariables(mutatedAutoVariables)

export const getOrCreateMutatedVariable = (val: any): Variable => {
  const key = variableKey(val)
  if (mutatedTokensValueToVariable.has(key)) {
    return mutatedTokensValueToVariable.get(key)!
  }
  if (mutatedTokensValueToVariable.size >= 10_000) {
    return { val, name: '', variable: String(val) } as Variable
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
  autoRetainedBytes: [...tokensValueToVariable].reduce((bytes, [key, value]) => {
    const variable = value as Partial<Variable>
    return (
      bytes +
      String(key).length +
      String(variable.val ?? '').length +
      String(variable.name ?? '').length +
      String(variable.variable ?? '').length
    )
  }, 0),
  autoCSSBytes: getAutoVariableCSS().length,
})
