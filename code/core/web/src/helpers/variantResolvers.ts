import { isVariable } from '../createVariable'
import type { GetStyleState, TamaguiInternalConfig, VariantResolverName } from '../types'

type CompiledVariantResolver = {
  key: string
  parts: VariantResolverName[]
}

const variantResolverCache = new WeakMap<object, readonly CompiledVariantResolver[]>()

// a variant key may list several resolvers: `'Size | Space'`. compiled once per
// variant object on first use, never again on the render path
export function getCompiledVariantResolvers(variant: object) {
  let compiled = variantResolverCache.get(variant)
  if (!compiled) {
    const next: CompiledVariantResolver[] = []
    for (const key in variant) {
      const parts = parseVariantResolverKey(key)
      if (parts) next.push({ key, parts })
    }
    compiled = next
    variantResolverCache.set(variant, compiled)
  }
  return compiled
}

function parseVariantResolverKey(key: string): VariantResolverName[] | null {
  if (!key) return null
  return key.split('|').map((part) => part.trim()) as VariantResolverName[]
}

// goes through specificity finding best matching variant function
export function getVariantDefinition(
  variant: any,
  value: any,
  conf: TamaguiInternalConfig,
  { theme }: Partial<GetStyleState>
): any {
  if (!variant) return
  if (value === undefined) return
  if (typeof variant === 'function') {
    return variant
  }
  if (value in variant) {
    return variant[value]
  }
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
      // styles are authored by devs and never validated at runtime: any number
      // or string routes to the token variant, which passes unknown values
      // through. Size keeps its historical variable exclusion so variables
      // route to the Space/Radius/ZIndex fallbacks.
      return (
        value === true ||
        number ||
        string ||
        (resolverName !== 'Size' && isVariable(value))
      )
    // a token or theme color, otherwise any string is taken to be a raw CSS
    // color and left for the browser to resolve. checking that against a CSS
    // color-name table costs 2.3KB gzip to reject values that were never valid
    // anyway. `red/50` opacity modifiers stay limited to token and theme
    // colors, which the branches above already covered.
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
