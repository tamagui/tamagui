import { isVariable } from '../createVariable'
import type { ResolveVariableAs, Variable } from '../types'

export function resolveVariableValue(
  key: string,
  valOrVar: Variable | any,
  resolveValues?: ResolveVariableAs
) {
  if (resolveValues === 'none') {
    return valOrVar
  }
  if (isVariable(valOrVar)) {
    if (resolveValues === 'value') {
      return valOrVar.val
    }

    // @ts-expect-error dynamic variables may expose a platform-aware getter
    const get = valOrVar?.get

    // shadowColor doesn't support dynamic style
    if (process.env.TAMAGUI_TARGET !== 'native' || key !== 'shadowColor') {
      if (typeof get === 'function') {
        const resolveDynamicFor = resolveValues === 'web' ? 'web' : undefined
        return get(resolveDynamicFor)
      }
    }

    return process.env.TAMAGUI_TARGET === 'native' ? valOrVar.val : valOrVar.variable
  }
  return valOrVar
}
