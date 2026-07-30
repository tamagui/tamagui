import {
  STYLE_FRONTEND_PREPROCESSED,
  type StaticConfig,
  type StyleFrontend,
  type TamaguiInternalConfig,
} from '@tamagui/core/internal-runtime'
import { stylePropsAll } from '@tamagui/helpers'
import { grammarPlatformNames, modifierToPseudo } from '@tamagui/style-grammar'
import {
  isTokenValueProp,
  preprocessTailwindClassName,
  resolveTokenValue,
} from './candidate'

/**
 * The Tailwind frontend descriptor.
 *
 * `preprocessProps` is the single Tailwind pass: it tokenizes `className` once and
 * flattens the resulting `$mods:prop` props into the neutral prop shape core's
 * renderer already consumes. Everything after this point — value programs,
 * per-longhand forward merging, web lowering, native evaluation — is shared.
 *
 * Owned candidates are never string-merged: each contributes at its authored
 * position and the shared resolver's last-contribution-wins rule decides. That is
 * why `tailwind-merge` is not a dependency here.
 */

interface FlatParsedProp {
  mediaKey?: string
  pseudoKey?: string
  platformKey?: string
  themeKey?: string
  // verbatim group modifier (e.g. "group-card-hover") — used as the object-form
  // key, which itself encodes the group name plus optional media/pseudo parts
  groupKey?: string
  prop: string
  value: any
}

function parseFlatModifierProp(
  key: string,
  value: any,
  shorthands: Record<string, string>,
  config: TamaguiInternalConfig
): FlatParsedProp | null {
  // key is like $hover:bg or $sm:hover:bg or $sm:dark:hover:bg
  // also supports embedded value: $hover:bg-blue or $sm:p-10
  const parts = key.slice(1).split(':') // remove $ and split
  if (parts.length < 2) return null

  let propShort = parts.pop()! // last part is the prop (or prop-value)
  let finalValue = value

  // check for embedded value syntax: bg-blue, p-10, backgroundColor-red, etc.
  // forward scan: find first segment that's a valid style prop, rest is value
  // this handles hyphenated values like "some-token" and props like "borderTopLeftRadius"
  if (propShort.includes('-')) {
    const segments = propShort.split('-')
    let foundProp = ''
    let valueStartIdx = -1

    // try progressively longer prefixes until we find a valid prop
    for (let i = 1; i <= segments.length; i++) {
      const candidate = segments.slice(0, i).join('-')
      if (shorthands[candidate] || candidate in stylePropsAll) {
        foundProp = candidate
        valueStartIdx = i
        break // use first (shortest) valid prop match
      }
    }

    if (foundProp && valueStartIdx < segments.length) {
      const embeddedValue = segments.slice(valueStartIdx).join('-')
      // validate non-empty value
      if (!embeddedValue) {
        return null
      }
      propShort = foundProp
      // resolve the embedded value (numeric, token, etc.)
      if (/^\d+(\.\d+)?$/.test(embeddedValue)) {
        const expanded = shorthands[foundProp] || foundProp
        finalValue = isTokenValueProp(expanded)
          ? `$${embeddedValue}`
          : Number(embeddedValue)
      } else {
        // try to resolve as token (handles "blue", "some-token", etc.)
        finalValue = resolveTokenValue(
          embeddedValue,
          config,
          shorthands[foundProp] || foundProp
        )
      }
    }
  }

  const prop = shorthands[propShort] || propShort

  const result: FlatParsedProp = { prop, value: finalValue }

  // parse modifiers (order doesn't matter)
  for (const mod of parts) {
    // check pseudo
    if (mod in modifierToPseudo) {
      result.pseudoKey = modifierToPseudo[mod]
      continue
    }

    // check media (registered in config)
    if (config.media && mod in config.media) {
      result.mediaKey = mod
      continue
    }

    // check theme
    if (config.themes && mod in config.themes) {
      result.themeKey = mod
      continue
    }

    // check platform
    if (grammarPlatformNames.has(mod)) {
      result.platformKey = mod
      continue
    }

    // group: keep the modifier verbatim, it becomes the object-form key
    // ($group-card-hover:opacity → '$group-card-hover': { opacity })
    if (mod === 'group' || mod.startsWith('group-')) {
      result.groupKey = mod
      continue
    }

    // unknown modifier
    return null
  }

  return result
}

function mergeDeep(target: any, source: any): any {
  const result = { ...target }
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = mergeDeep(result[key] || {}, source[key])
    } else {
      result[key] = source[key]
    }
  }
  return result
}

/**
 * Preprocess the flat $-props produced by tailwind className conversion, before the
 * main loop. Transforms syntax like $hover:bg="red" into hoverStyle: { backgroundColor:
 * 'red' } and base flat props like $bg="red" → backgroundColor: "red", so the existing
 * handlers can process them normally.
 */
function preprocessFlatProps(
  props: Record<string, any>,
  shorthands: Record<string, string>,
  config: TamaguiInternalConfig
): Record<string, any> {
  let hasFlat = false

  // quick check if any flat props exist
  for (const key in props) {
    if (key[0] === '$') {
      // flat prop with modifiers: $hover:bg
      if (key.includes(':')) {
        hasFlat = true
        break
      }
      // flat base prop: $bg or $bg-red (not an object value, which is current media syntax)
      const value = props[key]
      if (typeof value !== 'object' || value === null) {
        // check if it's a shorthand or valid style prop
        let propName = key.slice(1) // remove $
        // handle embedded value: $bg-red → prop is 'bg'
        if (propName.includes('-')) {
          const segments = propName.split('-')
          for (let i = 1; i <= segments.length; i++) {
            const candidate = segments.slice(0, i).join('-')
            if (shorthands?.[candidate] || candidate in stylePropsAll) {
              propName = candidate
              break
            }
          }
        }
        if (shorthands?.[propName] || propName in stylePropsAll) {
          hasFlat = true
          break
        }
      }
    }
  }

  if (!hasFlat) return props

  // process flat props
  const result: Record<string, any> = {}

  for (const key in props) {
    const value = props[key]

    if (key[0] === '$') {
      // check for flat modifier syntax: $hover:bg, $sm:hover:bg, etc.
      if (key.includes(':')) {
        const flatParsed = parseFlatModifierProp(key, value, shorthands, config)

        if (flatParsed) {
          const {
            mediaKey,
            pseudoKey,
            platformKey,
            themeKey,
            groupKey,
            prop,
            value: parsedValue,
          } = flatParsed

          // build the style object from innermost to outermost
          // order: prop → pseudo → group → theme → platform → media
          let styleObj: any = { [prop]: parsedValue }

          // wrap with pseudo if present
          if (pseudoKey) {
            styleObj = { [pseudoKey]: styleObj }
          }

          // wrap with group if present — the key is the object-form group key
          if (groupKey) {
            styleObj = { [`$${groupKey}`]: styleObj }
          }

          // wrap with theme if present (inside media)
          if (themeKey) {
            styleObj = { [`$theme-${themeKey}`]: styleObj }
          }

          // wrap with platform if present
          if (platformKey) {
            styleObj = { [`$${platformKey}`]: styleObj }
          }

          // determine outermost key or merge directly
          if (mediaKey) {
            // media is outermost wrapper
            const injectKey = `$${mediaKey}`
            result[injectKey] = result[injectKey]
              ? mergeDeep(result[injectKey], styleObj)
              : styleObj
          } else if (groupKey) {
            // group (with or without inner pseudo): merge the whole structure
            for (const k in styleObj) {
              result[k] = result[k] ? mergeDeep(result[k], styleObj[k]) : styleObj[k]
            }
          } else if (platformKey && !themeKey) {
            // just platform, no media
            const injectKey = `$${platformKey}`
            result[injectKey] = result[injectKey]
              ? mergeDeep(result[injectKey], styleObj[injectKey])
              : styleObj[injectKey]
          } else if (themeKey && !mediaKey && !platformKey) {
            // just theme, no media/platform
            const injectKey = `$theme-${themeKey}`
            result[injectKey] = result[injectKey]
              ? mergeDeep(result[injectKey], styleObj[injectKey])
              : styleObj[injectKey]
          } else if (pseudoKey && !mediaKey && !platformKey && !themeKey) {
            // just pseudo, no other wrappers
            result[pseudoKey] = result[pseudoKey]
              ? mergeDeep(result[pseudoKey], styleObj[pseudoKey])
              : styleObj[pseudoKey]
          } else {
            // complex nesting - merge the whole structure into result
            for (const k in styleObj) {
              result[k] = result[k] ? mergeDeep(result[k], styleObj[k]) : styleObj[k]
            }
          }
          continue
        }
      } else {
        // flat base prop without modifiers: $bg, $p, $bg-red, etc.
        // only if value is not an object (object = current media syntax)
        if (typeof value !== 'object' || value === null) {
          let propName = key.slice(1) // remove $
          let finalValue = value

          // check for embedded value syntax: $bg-red, $p-10, etc.
          if (propName.includes('-')) {
            const segments = propName.split('-')
            for (let i = 1; i <= segments.length; i++) {
              const candidate = segments.slice(0, i).join('-')
              if (shorthands?.[candidate] || candidate in stylePropsAll) {
                const embeddedValue = segments.slice(i).join('-')
                if (embeddedValue) {
                  propName = candidate
                  if (/^\d+(\.\d+)?$/.test(embeddedValue)) {
                    finalValue = Number(embeddedValue)
                  } else {
                    finalValue = resolveTokenValue(embeddedValue, config)
                  }
                }
                break
              }
            }
          }

          const expandedProp = shorthands?.[propName] || propName

          // check if it's a valid style prop
          if (
            shorthands?.[propName] ||
            propName in stylePropsAll ||
            expandedProp in stylePropsAll
          ) {
            result[expandedProp] = finalValue
            continue
          }
        }
      }
    }

    // not a flat prop, pass through
    // merge with existing if both are objects (handles $sm + $sm:bg order independence)
    if (
      result[key] &&
      typeof result[key] === 'object' &&
      typeof value === 'object' &&
      value !== null
    ) {
      result[key] = mergeDeep(result[key], value)
    } else {
      result[key] = value
    }
  }

  return result
}

/**
 * Parse a static class string (a `styled()` base, a string variant value, a string
 * compound-variant style) into ordinary style props.
 */
export function parseStaticStyle(
  input: string,
  config: TamaguiInternalConfig
): Record<string, any> {
  return preprocessFlatProps(
    preprocessTailwindClassName({ className: input }, config),
    config.shorthands as Record<string, string>,
    config
  )
}

const normalizedStaticConfigCache = new WeakMap<
  StaticConfig,
  WeakMap<TamaguiInternalConfig, StaticConfig>
>()
const normalizedStaticConfigs = new WeakSet<StaticConfig>()

function normalizeTailwindStaticConfig(
  staticConfig: StaticConfig,
  config: TamaguiInternalConfig
): StaticConfig {
  if (normalizedStaticConfigs.has(staticConfig)) {
    return staticConfig
  }
  let configCache = normalizedStaticConfigCache.get(staticConfig)
  const cached = configCache?.get(config)
  if (cached) return cached

  let variants = staticConfig.variants
  if (variants) {
    variants = Object.fromEntries(
      Object.entries(variants).map(([variantName, definition]) => [
        variantName,
        typeof definition === 'object' && definition
          ? Object.fromEntries(
              Object.entries(definition).map(([matcher, value]) => [
                matcher,
                typeof value === 'string' ? parseStaticStyle(value, config) : value,
              ])
            )
          : definition,
      ])
    )
  }

  const compoundVariants = staticConfig.compoundVariants?.map((compoundVariant) => ({
    ...compoundVariant,
    style:
      typeof compoundVariant.style === 'string'
        ? parseStaticStyle(compoundVariant.style, config)
        : compoundVariant.style,
  }))

  const normalized: StaticConfig = {
    ...staticConfig,
    baseStyle: staticConfig.baseClassName
      ? parseStaticStyle(staticConfig.baseClassName as string, config)
      : staticConfig.baseStyle,
    variants,
    compoundVariants,
  }
  normalizedStaticConfigs.add(normalized)
  configCache ||= new WeakMap()
  configCache.set(config, normalized)
  normalizedStaticConfigCache.set(staticConfig, configCache)
  const normalizedConfigCache = new WeakMap<TamaguiInternalConfig, StaticConfig>()
  normalizedConfigCache.set(config, normalized)
  normalizedStaticConfigCache.set(normalized, normalizedConfigCache)
  return normalized
}

export const tailwindStyleFrontend: StyleFrontend = {
  preprocessProps(props, config) {
    const withTailwind =
      typeof props.className === 'string'
        ? preprocessTailwindClassName(props, config)
        : props
    const flattened = preprocessFlatProps(
      withTailwind,
      config.shorthands as Record<string, string>,
      config
    )
    // only a fresh object gets the marker; marking the caller's props would leak the
    // symbol onto props the frontend never actually rewrote
    if (flattened !== props) {
      ;(flattened as any)[STYLE_FRONTEND_PREPROCESSED] = true
    }
    return flattened
  },

  normalizeStaticConfig: normalizeTailwindStaticConfig,
}
