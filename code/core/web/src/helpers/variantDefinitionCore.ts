import { isVariable } from '../createVariable'
import type { GetStyleState, TamaguiInternalConfig, VariantResolverName } from '../types'

type CompiledVariantResolver = {
  key: string
  parts: VariantResolverName[]
}

const variantResolverCache = new WeakMap<object, readonly CompiledVariantResolver[]>()

function getCompiledVariantResolvers(variant: object) {
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

export function resolveVariantDefinition(
  variant: any,
  value: any,
  conf: TamaguiInternalConfig,
  theme: Partial<GetStyleState>['theme']
): any {
  if (!variant || value === undefined) return
  if (typeof variant === 'function') return variant
  if (value in variant) return variant[value]

  const string = typeof value === 'string'
  const number = typeof value === 'number'
  const rem =
    string &&
    value.length > 3 &&
    value.endsWith('rem') &&
    Number.isFinite(Number(value.slice(0, -3)))
  for (const { key, parts } of getCompiledVariantResolvers(variant)) {
    for (const part of parts) {
      let matches = false
      switch (part) {
        case 'Size':
        case 'Space':
        case 'Radius':
        case 'ZIndex':
          matches =
            value === true || number || string || (part !== 'Size' && isVariable(value))
          break
        case 'Color':
          matches = string
          break
        case 'Theme':
          matches = Boolean(string && theme && value in theme)
          break
        case 'FontSize':
          matches =
            value === true || !!conf.fontsParsed.body?.size?.[value] || number || rem
          break
        case 'FontStyle':
          matches =
            !!conf.fontsParsed.body?.style?.[value] ||
            value === 'normal' ||
            value === 'italic'
          break
        case 'FontTransform':
          matches =
            !!conf.fontsParsed.body?.transform?.[value] ||
            value === 'none' ||
            value === 'capitalize' ||
            value === 'uppercase' ||
            value === 'lowercase'
          break
        case 'FontLineHeight':
          matches = !!conf.fontsParsed.body?.lineHeight?.[value] || number || rem
          break
        case 'FontLetterSpacing':
          matches = !!conf.fontsParsed.body?.letterSpacing?.[value] || number || rem
          break
        case 'number':
        case 'string':
        case 'boolean':
          matches = typeof value === part
          break
        case 'any':
          matches = true
      }
      if (matches) return variant[key]
    }
  }
}
