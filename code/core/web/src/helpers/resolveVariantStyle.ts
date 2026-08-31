import { scanFlatValue, type FlatValueHandler } from '@tamagui/style-grammar/runtime'
import { getSetting } from '../config'
import { getVariableValue, isVariable } from '../createVariable'
import type {
  GenericFonts,
  GetStyleState,
  LanguageContextType,
  TamaguiInternalConfig,
  VariantResolverName,
} from '../types'
import {
  emitVariantStyle,
  isVariantConditionValid,
  resolveVariantCondition,
} from './getSplitStyles'
import { isObj } from './isObj'
import { normalizeValueWithProperty } from './normalizeValueWithProperty'
import { skipProps } from './skipProps'
import { styleOriginalValues } from './styleOriginalValues'

type CompiledVariantResolver = {
  key: string
  parts: VariantResolverName[]
}

const variantResolverCache = new WeakMap<object, readonly CompiledVariantResolver[]>()

export function getCompiledVariantResolvers(variant: object) {
  let compiled = variantResolverCache.get(variant)
  if (!compiled) {
    const next: CompiledVariantResolver[] = []
    for (const key in variant) {
      if (key) {
        next.push({
          key,
          parts: key.split('|').map((part) => part.trim()) as VariantResolverName[],
        })
      }
    }
    compiled = next
    variantResolverCache.set(variant, compiled)
  }
  return compiled
}

export function getVariantDefinition(
  variant: any,
  value: any,
  conf: TamaguiInternalConfig,
  { theme }: Partial<GetStyleState>
): any {
  if (!variant || value === undefined) return
  if (typeof variant === 'function') return variant
  if (value in variant) return variant[value]

  for (const { key, parts } of getCompiledVariantResolvers(variant)) {
    for (const part of parts) {
      if (matchesVariantResolver(part, value, conf, theme)) {
        return variant[key]
      }
    }
  }
}

function matchesVariantResolver(
  resolverName: VariantResolverName,
  value: any,
  conf: TamaguiInternalConfig,
  theme: Partial<GetStyleState>['theme']
) {
  const string = typeof value === 'string'
  const number = typeof value === 'number'
  const rem =
    string &&
    value.length > 3 &&
    value.endsWith('rem') &&
    Number.isFinite(Number(value.slice(0, -3)))

  switch (resolverName) {
    case 'Size':
    case 'Space':
    case 'Radius':
    case 'ZIndex':
      return (
        value === true ||
        number ||
        string ||
        (resolverName !== 'Size' && isVariable(value))
      )
    case 'Color':
      return string
    case 'Theme':
      return string && !!theme && value in theme
    case 'FontSize':
      return value === true || !!conf.fontsParsed.body?.size?.[value] || number || rem
    case 'FontStyle':
      return (
        !!conf.fontsParsed.body?.style?.[value] ||
        value === 'normal' ||
        value === 'italic'
      )
    case 'FontTransform':
      return (
        !!conf.fontsParsed.body?.transform?.[value] ||
        value === 'none' ||
        value === 'capitalize' ||
        value === 'uppercase' ||
        value === 'lowercase'
      )
    case 'FontLineHeight':
      return !!conf.fontsParsed.body?.lineHeight?.[value] || number || rem
    case 'FontLetterSpacing':
      return !!conf.fontsParsed.body?.letterSpacing?.[value] || number || rem
    case 'number':
    case 'string':
    case 'boolean':
      return typeof value === resolverName
    case 'any':
      return true
  }
}

const extrasCache = new WeakMap<
  GetStyleState,
  { props: GetStyleState['props']; value: any }
>()
const fontLanguageCache = new WeakMap()

export function getFontsForLanguage(fonts: GenericFonts, language: LanguageContextType) {
  if (fontLanguageCache.has(language)) return fontLanguageCache.get(language)
  const next = {
    ...fonts,
    ...Object.fromEntries(
      Object.entries(language).flatMap(([name, lang]) => {
        if (lang === 'default') return []
        return [[name, fonts[`${name}_${lang}`]]]
      })
    ),
  }
  fontLanguageCache.set(language, next)
  return next
}

export const getVariantExtras = (styleState: GetStyleState) => {
  const cached = extrasCache.get(styleState)
  if (cached?.props === styleState.props) return cached.value

  const { props, conf, context, theme, styleProps } = styleState
  let fonts = conf.fontsParsed
  if (context?.language) {
    fonts = getFontsForLanguage(conf.fontsParsed, context.language)
  }

  const next = {
    fonts,
    tokens: conf.tokensParsed,
    theme,
    context: styleProps.styledContext,
    get fontFamily() {
      return (
        getVariableValue(styleState.fontFamily || styleState.props.fontFamily) ||
        props.fontFamily ||
        getVariableValue(getSetting('defaultFont'))
      )
    },
    get font() {
      const found = fonts[this.fontFamily]
      if (found) return found

      const className = props.className
      if (typeof className === 'string') {
        let start = 0
        for (let index = 0; index <= className.length; index++) {
          if (index !== className.length && className.charCodeAt(index) > 32) continue
          if (
            index - start > 5 &&
            className.charCodeAt(start) === 102 &&
            className.charCodeAt(start + 1) === 111 &&
            className.charCodeAt(start + 2) === 110 &&
            className.charCodeAt(start + 3) === 116 &&
            className.charCodeAt(start + 4) === 95
          ) {
            const name = className.slice(start + 5, index)
            if (fonts[name]) return fonts[name]
          }
          start = index + 1
        }
      }
      return fonts[conf.defaultFontToken]
    },
    props,
  }

  extrasCache.set(styleState, { props, value: next })
  return next as any
}

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
