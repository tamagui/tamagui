import { createVariable, isVariable } from '../createVariable'
import type { GenericVariables, TokensParsed, Variable } from '../types'
import { findVariableToken, isUnitlessVariableKey } from './variableValue'
import { warnOnce } from './warnOnce'

export function mergeConfigVariablesIntoTheme(
  theme: Record<string, Variable>,
  themeName: string,
  variables: GenericVariables,
  tokensParsed: TokensParsed
) {
  const scheme = themeName.startsWith('dark') ? 'dark' : 'light'
  const resolving = new Set<string>()

  const resolveRawValue = (key: string, value: unknown): unknown => {
    if (typeof value === 'object' && value !== null) {
      if (isVariable(value)) return value.val
      if ('needsPx' in value) return value
      if ('light' in value || 'dark' in value) {
        return resolveRawValue(key, (value as any)[scheme] ?? (value as any).light)
      }
      return
    }
    if (typeof value === 'string') {
      const name = value
      if (name in variables && !(name in theme)) {
        if (resolving.has(name)) {
          warnOnce(
            `config-cycle:${name}`,
            `createTamagui variables: reference cycle at "${name}". Dropping.`
          )
          return
        }
        resolving.add(name)
        const res = resolveRawValue(name, variables[name])
        resolving.delete(name)
        return res
      }
      const themeValue = theme[name]
      if (themeValue !== undefined) {
        return isVariable(themeValue) ? themeValue.val : themeValue
      }
      const token = findVariableToken(tokensParsed, name)
      return token ? token.val : value
    }
    return value
  }

  for (const key in variables) {
    if (key in theme) continue
    let raw = resolveRawValue(key, variables[key])
    if (raw === undefined) continue
    let needsPx = typeof raw === 'number' && !isUnitlessVariableKey(key)
    if (typeof raw === 'object' && raw !== null && 'needsPx' in raw) {
      needsPx = true
      raw = (raw as unknown as { val: number }).val
    }
    const variable = createVariable({ key, name: key, val: raw as any })
    if (needsPx) {
      variable.needsPx = true
    }
    theme[key] = variable
  }
}
