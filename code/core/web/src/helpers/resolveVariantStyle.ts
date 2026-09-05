import type { GetStyleState } from '../types'
import { emitVariantStyle, walkConditionalValue } from './getSplitStyles'
import { isObj } from './isObj'
import { skipProps } from './skipProps'
import { styleOriginalValues } from './styleOriginalValues'
import { normalizeValueWithProperty } from './normalizeValueWithProperty'
import { getDynamicEnv, isStyledDynamic } from './styledDynamic'

export function resolveVariantStyle(
  state: GetStyleState,
  variants: Record<string, any>,
  key: string,
  value: any,
  parentKey = key,
  parentCondition?: unknown
) {
  const definition = variants[key]
  // bare styled.dynamic<T>(): the prop is typed and consumed here; its style
  // comes from a component resolver reading it off props
  if (typeof definition !== 'function' && isStyledDynamic(definition)) {
    return
  }
  if (
    !(
      typeof value === 'string' &&
      definition &&
      typeof definition === 'object' &&
      value in definition
    ) &&
    walkConditionalValue(state, key, value, parentCondition, (payload, condition) =>
      resolveSelection(state, variants, key, payload, parentKey, condition || undefined)
    )
  ) {
    return
  }
  resolveSelection(state, variants, key, value, parentKey, parentCondition)
}

function resolveSelection(
  state: GetStyleState,
  variants: Record<string, any>,
  key: string,
  value: any,
  parentKey: string,
  condition?: unknown
) {
  const definition = variants[key]
  let output
  if (isStyledDynamic(definition) && typeof definition === 'function') {
    // styled.dynamic(fn): pure function of the (per-clause) value + env
    output = definition(value, getDynamicEnv(state))
  } else if (definition && typeof definition === 'object' && value !== undefined) {
    output = definition[value]
  }
  if (!isObj(output)) return

  const originals = styleOriginalValues.get(output)
  for (const outputKey in output) {
    if (!state.styleProps.noSkip && outputKey in skipProps) continue
    const raw = output[outputKey]
    // A dynamic's static shape is allowed to use undefined values for
    // conditionals. They are absent, matching resolver output semantics, and
    // must not normalize into an "undefined" atomic rule.
    if (raw == null) continue
    const value = state.styleProps.noNormalize
      ? raw
      : normalizeValueWithProperty(raw, state.conf.shorthands[outputKey] || outputKey)
    emitVariantStyle(
      state,
      outputKey,
      value,
      originals?.[outputKey] ?? raw,
      condition,
      parentKey === key && outputKey === key
    )
  }
}
