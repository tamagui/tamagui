import {
  transformFamilyProps,
  unitlessNumberProperties,
} from '@tamagui/style-grammar/tooling'
import type { ModifierRegistryView, ParsedClause } from '@tamagui/style-grammar/tooling'

export const pseudoToModifier: Readonly<Record<string, string>> = Object.freeze({
  hoverStyle: 'hover',
  pressStyle: 'press',
  focusStyle: 'focus',
  focusVisibleStyle: 'focus-visible',
  focusWithinStyle: 'focus-within',
  disabledStyle: 'disabled',
  enterStyle: 'enter',
  exitStyle: 'exit',
})

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
  | { recognized: true; modifiers: readonly string[] }
  | { recognized: true; error: Omit<LegacyConditionError, 'path'> }

function resolveLegacyCondition(
  propName: string,
  registry: ModifierRegistryView
): ConditionResolution {
  const pseudoModifier = pseudoToModifier[propName]
  if (pseudoModifier !== undefined) {
    return registry.get(pseudoModifier) === 'state'
      ? { recognized: true, modifiers: [pseudoModifier] }
      : {
          recognized: true,
          error: {
            code: 'unregistered-legacy-condition',
            message: `legacy condition "${propName}" maps to unregistered state modifier "${pseudoModifier}"`,
          },
        }
  }

  if (propName.startsWith('$theme-')) {
    const modifier = propName.slice('$theme-'.length)
    return modifier && registry.get(modifier) === 'theme'
      ? { recognized: true, modifiers: [modifier] }
      : {
          recognized: true,
          error: {
            code: 'unregistered-legacy-condition',
            message: `legacy theme condition "${propName}" does not name a registered theme`,
          },
        }
  }

  if (propName.startsWith('$platform-')) {
    const modifier = propName.slice('$platform-'.length)
    return modifier && registry.get(modifier) === 'platform'
      ? { recognized: true, modifiers: [modifier] }
      : {
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

    const longestLength = candidates.reduce(
      (length, state) => Math.max(length, state.length),
      0
    )
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
    const kind = registry.get(modifier)
    if (kind === 'media' || kind === 'container') {
      return { recognized: true, modifiers: [modifier] }
    }
  }

  return { recognized: false }
}

function isConditionObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false
  const prototype = Object.getPrototypeOf(value)
  return prototype === Object.prototype || prototype === null
}

function convertStyleValue(
  prop: string,
  value: unknown,
  path: string,
  errors: LegacyConditionError[]
): string | null {
  if (transformPartProperties.has(prop) && !transformFamilyProps.has(prop)) {
    errors.push({
      code: 'legacy-transform-part',
      path,
      message: `legacy transform part "${prop}" has no flat spelling; author it inside a flat \`transform\` value (only x, y, scale, scaleX, scaleY, and rotate are first-class)`,
    })
    return null
  }

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
    // V5 spells a half-step token with a dot ($2.5); V3 spells the same token
    // with a dash (2-5) and resolves it to the identical value, so a NUMERIC
    // dot-path is a pure rename rather than a value change. Measured against
    // both config packs: $0.5/0-5 = 1, $1.5/1-5 = 4, $2.5/2-5 = 10,
    // $3.5/3-5 = 16.
    //
    // Worth converting rather than flagging because it is the single largest
    // flag category on real corpora: 272 of 497 flagged sites in one mid-size
    // app. A non-numeric dot-path is a rename nobody can derive, so it stays
    // flagged below.
    const text = value.replace(/\$(-?\d+)\.(\d+)\b/g, '$$$1-$2')

    if (!text.length) {
      errors.push({
        code: 'unsupported-legacy-value',
        path,
        message: 'an empty string cannot become a condition clause payload',
      })
      return null
    }
    if (text.indexOf('$') === -1) return text
    if (text.includes('"') || text.includes("'") || text.includes('url(')) {
      errors.push({
        code: 'unsupported-legacy-value',
        path,
        message: `"${text}" mixes "$" with quoted or url() content; migrate the token spelling by hand`,
      })
      return null
    }
    if (/\$[\w-]*\./.test(text)) {
      errors.push({
        code: 'legacy-token-dot-path',
        path,
        message: `legacy token in "${text}" uses dot-path naming; rename it to one configured flat token name before conversion`,
      })
      return null
    }
    if (/\$-?\d/.test(text) && !/^\$-?[\w-]+$/.test(text)) {
      errors.push({
        code: 'legacy-numeric-composite-token',
        path,
        message: `numeric token in "${text}" is embedded in a composite value; replace it with its resolved CSS value before conversion`,
      })
      return null
    }
    if (/\$(?![\w-])/.test(text)) {
      errors.push({
        code: 'unsupported-legacy-value',
        path,
        message: `"$" in "${text}" is not followed by a token name`,
      })
      return null
    }
    return text.replace(/\$([\w-]+)/g, '$1')
  }

  if (typeof value === 'number') {
    if (Number.isFinite(value)) {
      return unitlessNumberProperties.has(prop) ? String(value) : `${value}px`
    }
    errors.push({
      code: 'unsupported-legacy-value',
      path,
      message: `non-finite number ${String(value)} cannot become a CSS payload`,
    })
    return null
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
        modifiers.push(...condition.modifiers)
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
