import { scanFlatValue, type FlatValueHandler } from '@tamagui/style-grammar/runtime'

import { isVariable } from '../createVariable'
import type { GetStyleState } from '../types'
import {
  emitVariantStyle,
  isVariantConditionValid,
  resolveVariantCondition,
} from './getSplitStyles'
import { getVariantExtras } from './getVariantExtras'
import { isObj } from './isObj'
import { normalizeValueWithProperty } from './normalizeValueWithProperty'
import { skipProps } from './skipProps'
import { styleOriginalValues } from './styleOriginalValues'
import { getVariantDefinition } from './variantResolvers'

type ScanContext = [GetStyleState, Record<string, any>, string, string, unknown]

const handler: FlatValueHandler<ScanContext> = {
  segment(ctx, start, end, isBase, valid, source, chainStart, chainEnd, chainValid) {
    if (start === end || !valid || (!isBase && !chainValid)) return
    const condition = isBase
      ? ctx[4]
      : resolveVariantCondition(ctx[0], source.slice(chainStart, chainEnd), ctx[4])
    if (!isBase && !isVariantConditionValid(condition)) return
    resolveSelection(ctx[0], ctx[1], ctx[2], source.slice(start, end), ctx[3], condition)
  },
  chain() {
    return true
  },
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
  if (
    typeof value === 'string' &&
    !(definition && typeof definition === 'object' && value in definition)
  ) {
    scanFlatValue(value, handler, [state, variants, key, parentKey, parentCondition])
    return
  }

  const objectValue =
    value && typeof value === 'object' && !Array.isArray(value) && !isVariable(value)
  if (objectValue) {
    const hasDefault = 'default' in value
    let first = !hasDefault
    let conditional = hasDefault
    for (const conditionKey in value) {
      if (conditionKey === 'default') continue
      const condition = resolveVariantCondition(state, conditionKey, parentCondition)
      if (first) {
        first = false
        conditional = isVariantConditionValid(condition)
        if (!conditional) break
      }
    }
    if (conditional) {
      if (value.default != null) {
        resolveSelection(state, variants, key, value.default, parentKey, parentCondition)
      }
      for (const conditionKey in value) {
        if (conditionKey === 'default' || value[conditionKey] == null) continue
        resolveSelection(
          state,
          variants,
          key,
          value[conditionKey],
          parentKey,
          resolveVariantCondition(state, conditionKey, parentCondition)
        )
      }
      return
    }
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
  let output = getVariantDefinition(variants[key], value, state.conf, state)
  if (typeof output === 'function') output = output(value, getVariantExtras(state))
  if (!isObj(output)) return

  const originals = styleOriginalValues.get(output)
  for (const outputKey in output) {
    if (!state.styleProps.noSkip && outputKey in skipProps) continue
    const raw = output[outputKey]
    emitVariantStyle(
      state,
      outputKey,
      state.styleProps.noNormalize
        ? raw
        : normalizeValueWithProperty(raw, state.conf.shorthands[outputKey] || outputKey),
      originals?.[outputKey] ?? raw,
      condition,
      parentKey === key && outputKey === key
    )
  }
}
