import { pseudoToModifier } from './stateModifiers'
import type { ModifierRegistryView, ParsedClause } from './valueTypes'

const unitlessNumberPropertyNames = [
  'animationIterationCount',
  'aspectRatio',
  'borderImageOutset',
  'borderImageSlice',
  'borderImageWidth',
  'boxFlex',
  'boxFlexGroup',
  'boxOrdinalGroup',
  'columnCount',
  'flex',
  'flexGrow',
  'flexOrder',
  'flexPositive',
  'flexShrink',
  'flexNegative',
  'fontWeight',
  'gap',
  'columnGap',
  'rowGap',
  'gridRow',
  'gridRowEnd',
  'gridRowGap',
  'gridRowStart',
  'gridColumn',
  'gridColumnEnd',
  'gridColumnGap',
  'gridColumnStart',
  'lineClamp',
  'opacity',
  'order',
  'orphans',
  'tabSize',
  'widows',
  'zIndex',
  'zoom',
  'fillOpacity',
  'floodOpacity',
  'stopOpacity',
  'strokeDasharray',
  'strokeDashoffset',
  'strokeMiterlimit',
  'strokeOpacity',
  'strokeWidth',
  'scale',
  'scaleX',
  'scaleY',
  'scaleZ',
  'shadowOpacity',
] as const

// mirrored from react-native-web-internals/src/modules/unitlessNumbers/index.tsx;
// this package cannot import across that runtime boundary.
const unitlessNumbers = new Set<string>(unitlessNumberPropertyNames)
for (const prefix of ['ms', 'Moz', 'O', 'Webkit']) {
  for (const property of unitlessNumberPropertyNames) {
    unitlessNumbers.add(prefix + property[0].toUpperCase() + property.slice(1))
  }
}
export const unitlessNumberProperties: ReadonlySet<string> = unitlessNumbers

import { transformFamilyProps } from './transformFamily'

const transformPartProperties: ReadonlySet<string> = new Set([
  'scale',
  'scaleX',
  'scaleY',
  'rotate',
  'rotateX',
  'rotateY',
  'rotateZ',
  'x',
  'y',
  'skewX',
  'skewY',
  'perspective',
])

export interface ConvertLegacyConditionOptions {
  registry: ModifierRegistryView
}

export interface LegacyConditionContribution {
  prop: string
  clause: ParsedClause
}

export interface LegacyConditionError {
  code: string
  path: string
  message: string
}

export interface LegacyConditionResult {
  contributions: LegacyConditionContribution[]
  errors: LegacyConditionError[]
}

type ConditionResolution =
  | { recognized: false }
  // one condition key can carry several modifiers: a legacy group key with a
  // media segment splits into a container query plus (optionally) a group state
  | { recognized: true; modifiers: readonly string[] }
  | { recognized: true; error: Omit<LegacyConditionError, 'path'> }

function resolveLegacyCondition(
  propName: string,
  registry: ModifierRegistryView
): ConditionResolution {
  const pseudoModifier = pseudoToModifier[propName]
  if (pseudoModifier !== undefined) {
    if (registry.get(pseudoModifier) === 'state') {
      return { recognized: true, modifiers: [pseudoModifier] }
    }
    return {
      recognized: true,
      error: {
        code: 'unregistered-legacy-condition',
        message: `legacy condition "${propName}" maps to unregistered state modifier "${pseudoModifier}"`,
      },
    }
  }

  if (propName.startsWith('$theme-')) {
    const modifier = propName.slice('$theme-'.length)
    if (modifier && registry.get(modifier) === 'theme') {
      return { recognized: true, modifiers: [modifier] }
    }
    return {
      recognized: true,
      error: {
        code: 'unregistered-legacy-condition',
        message: `legacy theme condition "${propName}" does not name a registered theme`,
      },
    }
  }

  if (propName.startsWith('$platform-')) {
    const modifier = propName.slice('$platform-'.length)
    if (modifier && registry.get(modifier) === 'platform') {
      return { recognized: true, modifiers: [modifier] }
    }
    return {
      recognized: true,
      error: {
        code: 'unregistered-legacy-condition',
        message: `legacy platform condition "${propName}" does not name a registered platform`,
      },
    }
  }

  if (propName.startsWith('$group-')) {
    const remainder = propName.slice('$group-'.length)
    const candidates: string[] = []
    let start = 0
    while (start < remainder.length) {
      const state = remainder.slice(start)
      if (registry.get(state) === 'state') candidates.push(state)
      const dash = remainder.indexOf('-', start)
      if (dash === -1) break
      start = dash + 1
    }

    let longestLength = 0
    for (const state of candidates) {
      if (state.length > longestLength) longestLength = state.length
    }
    const longest = candidates.filter((state) => state.length === longestLength)
    if (longest.length > 1) {
      return {
        recognized: true,
        error: {
          code: 'ambiguous-legacy-group',
          message: `legacy group condition "${propName}" has more than one equally specific state suffix`,
        },
      }
    }
    const state = longest.length === 1 ? longest[0] : null
    let namePart =
      state === null
        ? remainder
        : state.length === remainder.length
          ? ''
          : remainder.slice(0, -(state.length + 1))

    // v2 groups are containers: a media segment after the name measures the
    // group's size, which the grammar spells as a container query on the named
    // group. longest registered container size wins (`max-md` over `md`),
    // matching the legacy two-part-first parse
    let media: string | null = null
    if (namePart) {
      let scanStart = 0
      while (scanStart < namePart.length) {
        const suffix = namePart.slice(scanStart)
        if (registry.get(`@${suffix}`) === 'container') {
          media = suffix
          break
        }
        const dash = namePart.indexOf('-', scanStart)
        if (dash === -1) break
        scanStart = dash + 1
      }
      if (media !== null) {
        namePart =
          media.length === namePart.length ? '' : namePart.slice(0, -(media.length + 1))
      } else if (state === null) {
        // no state and no measurable size: either an unregistered suffix or a
        // media key with no container form (hoverNone-style interaction keys)
        return {
          recognized: true,
          error: {
            code: 'unregistered-legacy-condition',
            message: `legacy group condition "${propName}" has no registered state or container-size suffix`,
          },
        }
      }
    } else if (state === null) {
      return {
        recognized: true,
        error: {
          code: 'unregistered-legacy-condition',
          message: `legacy group condition "${propName}" has no registered state suffix`,
        },
      }
    }

    const suffix = namePart ? `/${namePart}` : ''
    const modifiers: string[] = []
    if (media !== null) modifiers.push(`@${media}${suffix}`)
    if (state !== null) modifiers.push(`group-${state}${suffix}`)
    return { recognized: true, modifiers }
  }

  if (propName[0] === '$') {
    const modifier = propName.slice(1)
    if (registry.get(modifier) === 'media') {
      return { recognized: true, modifiers: [modifier] }
    }
  }

  return { recognized: false }
}

function isConditionObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false
  }
  const prototype = Object.getPrototypeOf(value)
  return prototype === Object.prototype || prototype === null
}

// CSS shorthands that RESET sibling longhands and have no per-longhand family
// split yet. A program on a resetting shorthand would break the order-free
// cross-program encoding, so these stay on the legacy path. border, the four
// sides, and outline split through the border family; background through the
// background family

function convertStyleValue(
  prop: string,
  value: unknown,
  path: string,
  errors: LegacyConditionError[]
): string | null {
  if (transformPartProperties.has(prop) && !transformFamilyProps.has(prop)) {
    // skews, 3D rotations, perspective, and matrix belong to the raw
    // `transform` property (one ordinary program); a legacy PART prop has no
    // per-part flat spelling
    errors.push({
      code: 'legacy-transform-part',
      path,
      message: `legacy transform part "${prop}" has no flat spelling; author it inside a flat \`transform\` value (only x, y, scale, scaleX, scaleY, and rotate are first-class)`,
    })
    return null
  }

  // the transform family carries units the generic number path does not: x and y
  // are lengths, scale is unitless, rotate is an angle
  if (
    typeof value === 'number' &&
    Number.isFinite(value) &&
    transformFamilyProps.has(prop)
  ) {
    if (prop === 'rotate') return value === 0 ? '0deg' : `${value}deg`
    if (prop === 'x' || prop === 'y') return value === 0 ? '0' : `${value}px`
    return String(value)
  }

  if (typeof value === 'string') {
    if (!value.length) {
      errors.push({
        code: 'unsupported-legacy-value',
        path,
        message: 'an empty string cannot become a condition clause payload',
      })
      return null
    }
    if (value.indexOf('$') === -1) return value

    // legacy strings may embed `$token` spellings anywhere in the value
    // (`0 4px 8px $color5`); the flat grammar drops the `$`, and configured
    // names win over identical literal CSS idents (config-first resolution).
    // quoted or url() content must never be rewritten, and those never held
    // legacy tokens, so the whole value falls back instead
    if (value.includes('"') || value.includes("'") || value.includes('url(')) {
      errors.push({
        code: 'unsupported-legacy-value',
        path,
        message: `"${value}" mixes "$" with quoted or url() content; migrate the token spelling by hand`,
      })
      return null
    }
    if (/\$[\w-]*\./.test(value)) {
      errors.push({
        code: 'legacy-token-dot-path',
        path,
        message: `legacy token in "${value}" uses dot-path naming; rename it to one configured flat token name before conversion`,
      })
      return null
    }
    // token names include numeric spellings ($4, $-2), so any word char or
    // dash can follow the prefix
    if (/\$(?![\w-])/.test(value)) {
      errors.push({
        code: 'unsupported-legacy-value',
        path,
        message: `"$" in "${value}" is not followed by a token name`,
      })
      return null
    }
    return value.replace(/\$([\w-]+)/g, '$1')
  }

  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      errors.push({
        code: 'unsupported-legacy-value',
        path,
        message: `non-finite number ${String(value)} cannot become a CSS payload`,
      })
      return null
    }
    return unitlessNumberProperties.has(prop) ? String(value) : `${value}px`
  }

  errors.push({
    code: 'unsupported-legacy-value',
    path,
    message: `legacy condition value for "${prop}" must be a string or finite number`,
  })
  return null
}

export function convertLegacyConditionProp(
  propName: string,
  value: unknown,
  options: ConvertLegacyConditionOptions
): LegacyConditionResult | null {
  const root = resolveLegacyCondition(propName, options.registry)
  if (!root.recognized) return null

  const result: LegacyConditionResult = { contributions: [], errors: [] }
  if ('error' in root) {
    result.errors.push({ ...root.error, path: propName })
    return result
  }
  if (!isConditionObject(value)) {
    result.errors.push({
      code: 'legacy-condition-object',
      path: propName,
      message: `legacy condition "${propName}" must contain a style object`,
    })
    return result
  }

  const modifiers = root.modifiers.slice()

  const visit = (object: Record<string, unknown>, objectPath: string): void => {
    for (const childProp in object) {
      if (!Object.prototype.hasOwnProperty.call(object, childProp)) continue
      const childValue = object[childProp]
      const childPath = `${objectPath}.${childProp}`
      const condition = resolveLegacyCondition(childProp, options.registry)

      if (condition.recognized) {
        if ('error' in condition) {
          result.errors.push({ ...condition.error, path: childPath })
          continue
        }
        if (!isConditionObject(childValue)) {
          result.errors.push({
            code: 'legacy-condition-object',
            path: childPath,
            message: `legacy condition "${childProp}" must contain a style object`,
          })
          continue
        }
        for (let index = 0; index < condition.modifiers.length; index++) {
          modifiers.push(condition.modifiers[index])
        }
        visit(childValue, childPath)
        modifiers.length -= condition.modifiers.length
        continue
      }

      const payload = convertStyleValue(childProp, childValue, childPath, result.errors)
      if (payload !== null) {
        result.contributions.push({
          prop: childProp,
          clause: { modifiers: modifiers.slice(), payload },
        })
      }
    }
  }

  visit(value, propName)
  return result
}
