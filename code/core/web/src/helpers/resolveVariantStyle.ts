import type { GetStyleState } from '../types'
import { emitVariantStyle, walkConditionalValue } from './getSplitStyles'
import { isObj } from './isObj'
import { getConfigRevisionState } from './grammarConfig'
import { skipProps } from './skipProps'
import { styleOriginalValues } from './styleOriginalValues'
import { normalizeValueWithProperty } from './normalizeValueWithProperty'
import { getDynamicEnv, isStyledDynamic } from './styledDynamic'

export const getVariantExtras = (styleState: GetStyleState) => {
  const cached = (styleState as any).flatVariantExtras
  if (cached) return cached

  const env = getDynamicEnv(styleState)
  const next = {
    fonts: env.fonts,
    tokens: env.tokens,
    theme: env.theme,
    context: styleState.styleProps.styledContext,
    get fontFamily() {
      return env.fontFamily
    },
    get font() {
      return env.font
    },
    props: styleState.props,
  }

  return ((styleState as any).flatVariantExtras = next)
}

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
  } else {
    output = getConfigRevisionState(state.conf).variantDefinition(
      definition,
      value,
      state.theme
    )
    if (typeof output === 'function') output = output(value, getVariantExtras(state))
  }
  if (!isObj(output)) return

  const originals = styleOriginalValues.get(output)
  for (const outputKey in output) {
    if (!state.styleProps.noSkip && outputKey in skipProps) continue
    const raw = output[outputKey]
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
