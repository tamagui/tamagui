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
  | { recognized: true; modifier: string }
  | { recognized: true; error: Omit<LegacyConditionError, 'path'> }

function resolveLegacyCondition(
  propName: string,
  registry: ModifierRegistryView
): ConditionResolution {
  const pseudoModifier = pseudoToModifier[propName]
  if (pseudoModifier !== undefined) {
    if (registry.get(pseudoModifier) === 'state') {
      return { recognized: true, modifier: pseudoModifier }
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
      return { recognized: true, modifier }
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
      return { recognized: true, modifier }
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
    if (longest.length === 0) {
      return {
        recognized: true,
        error: {
          code: 'unregistered-legacy-condition',
          message: `legacy group condition "${propName}" has no registered state suffix`,
        },
      }
    }

    const state = longest[0]
    if (state.length === remainder.length) {
      return { recognized: true, modifier: `group-${state}` }
    }
    const name = remainder.slice(0, -(state.length + 1))
    return { recognized: true, modifier: `group-${state}/${name}` }
  }

  if (propName[0] === '$') {
    const modifier = propName.slice(1)
    if (registry.get(modifier) === 'media') {
      return { recognized: true, modifier }
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

function convertStyleValue(
  prop: string,
  value: unknown,
  path: string,
  errors: LegacyConditionError[]
): string | null {
  if (transformPartProperties.has(prop)) {
    errors.push({
      code: 'legacy-transform-part',
      path,
      message: `legacy transform part "${prop}" cannot be converted until the transform family is defined`,
    })
    return null
  }

  if (typeof value === 'string') {
    if (!value.startsWith('$')) {
      if (value.length) return value
      errors.push({
        code: 'unsupported-legacy-value',
        path,
        message: 'an empty string cannot become a condition clause payload',
      })
      return null
    }

    const tokenName = value.slice(1)
    if (tokenName.includes('.')) {
      errors.push({
        code: 'legacy-token-dot-path',
        path,
        message: `legacy token "${value}" uses dot-path naming; rename it to one configured flat token name before conversion`,
      })
      return null
    }
    if (!tokenName) {
      errors.push({
        code: 'unsupported-legacy-value',
        path,
        message: 'a bare "$" is not a token name',
      })
      return null
    }
    return tokenName
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

  const modifiers = [root.modifier]

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
        modifiers.push(condition.modifier)
        visit(childValue, childPath)
        modifiers.pop()
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
