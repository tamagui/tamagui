import { isVariable } from '../createVariable'
import type { ResolveVariableAs, Variable } from '../types'

export function resolveVariableValue(
  key: string,
  valOrVar: Variable | any,
  resolveValues?: ResolveVariableAs
) {
  if (resolveValues === 'none' || !isVariable(valOrVar)) {
    return valOrVar
  }
  let value
  if (resolveValues === 'value') {
    value = valOrVar.val
  } else {
    // @ts-expect-error dynamic variables may expose a platform-aware getter
    const get = valOrVar.get

    // compound CSS strings cannot contain native dynamic color objects.
    const needsLiteralColor =
      key === 'shadowColor' ||
      key === 'boxShadow' ||
      key === 'textShadow' ||
      key === 'backgroundImage'
    value =
      (process.env.TAMAGUI_TARGET !== 'native' || !needsLiteralColor) &&
      typeof get === 'function'
        ? get(resolveValues === 'web' ? 'web' : undefined)
        : process.env.TAMAGUI_TARGET === 'native'
          ? valOrVar.val
          : valOrVar.variable
  }
  // compiler variables can return native literals from a web-built resolver.
  return key === 'lineHeight' && typeof value === 'number' ? `${value}px` : value
}
