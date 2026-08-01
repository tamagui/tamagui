// The font shorthand: value-dependent splitting of the resetting CSS `font`
// shorthand into per-longhand programs, completing the family model. The
// micro-syntax is positional — optional style/weight components, then the
// size (optionally `size/line-height`), then the family tail, which is joined
// verbatim so comma lists and quoted names survive.
//
// Conservative by design: ambiguous or unsupported components (`normal`,
// `small-caps`, stretch keywords, system font keywords, size keywords) error
// so the whole value stays on the legacy path rather than converting into a
// subtly different meaning.

import { splitTopLevelComponents } from './backgroundFamily'
import type { ParsedClause, ParsedValue } from './valueTypes'

interface FontShorthandTargets {
  style: readonly string[]
  weight: readonly string[]
  size: readonly string[]
  lineHeight: readonly string[]
  family: readonly string[]
}

/** authored prop -> the true longhands each component kind lands on */
export const fontShorthandTargets: Readonly<Record<string, FontShorthandTargets>> = {
  font: {
    style: ['fontStyle'],
    weight: ['fontWeight'],
    size: ['fontSize'],
    lineHeight: ['lineHeight'],
    family: ['fontFamily'],
  },
}

const styleKeywords = new Set(['italic', 'oblique'])
const weightKeywords = new Set(['bold', 'bolder', 'lighter'])
// `normal` is ambiguous (style, variant, or weight), and these have no
// cross-platform longhand contribution
const unsupportedKeywords = new Set([
  'normal',
  'small-caps',
  'ultra-condensed',
  'extra-condensed',
  'condensed',
  'semi-condensed',
  'semi-expanded',
  'expanded',
  'extra-expanded',
  'ultra-expanded',
  // system font keywords have no longhand equivalent at all
  'caption',
  'icon',
  'menu',
  'message-box',
  'small-caption',
  'status-bar',
])

const sizePattern = /^-?(\d+\.?\d*|\.\d+)(?:[a-z%]+)?$/i
const weightNumberPattern = /^[1-9]00$/

export interface FontShorthandError {
  code: 'unsupported-font-component'
  component: string
  where: 'base' | number
}

type FontKind = keyof FontShorthandTargets

interface MutableProgram {
  base: string | null
  clauses: ParsedClause[]
  present: boolean
}

export function splitFontValue(value: ParsedValue): {
  entries: Array<{ property: string; value: ParsedValue }>
  errors: FontShorthandError[]
} {
  const targets = fontShorthandTargets.font
  const errors: FontShorthandError[] = []
  const kinds: readonly FontKind[] = ['style', 'weight', 'size', 'lineHeight', 'family']
  const programs: Record<FontKind, MutableProgram> = {
    style: { base: null, clauses: [], present: false },
    weight: { base: null, clauses: [], present: false },
    size: { base: null, clauses: [], present: false },
    lineHeight: { base: null, clauses: [], present: false },
    family: { base: null, clauses: [], present: false },
  }

  for (let clauseIndex = -1; clauseIndex < value.clauses.length; clauseIndex++) {
    const isBase = clauseIndex === -1
    const payload = isBase ? value.base : value.clauses[clauseIndex].payload
    if (payload === null) continue
    const where = isBase ? ('base' as const) : clauseIndex

    const components = splitTopLevelComponents(payload)
    const found: Partial<Record<FontKind, string>> = {}
    let sizeIndex = -1

    for (let index = 0; index < components.length; index++) {
      const component = components[index]
      const lower = component.toLowerCase()
      if (unsupportedKeywords.has(lower)) {
        errors.push({ code: 'unsupported-font-component', component, where })
        continue
      }
      if (styleKeywords.has(lower)) {
        if (found.style !== undefined) {
          errors.push({ code: 'unsupported-font-component', component, where })
          continue
        }
        found.style = component
        continue
      }
      if (weightKeywords.has(lower) || weightNumberPattern.test(component)) {
        if (found.weight !== undefined) {
          errors.push({ code: 'unsupported-font-component', component, where })
          continue
        }
        found.weight = component
        continue
      }
      const slash = component.indexOf('/')
      const sizePart = slash === -1 ? component : component.slice(0, slash)
      if (sizePattern.test(sizePart)) {
        if (found.size !== undefined) {
          errors.push({ code: 'unsupported-font-component', component, where })
          continue
        }
        found.size = sizePart
        if (slash !== -1) found.lineHeight = component.slice(slash + 1)
        sizeIndex = index
        // everything after the size is the family, joined verbatim
        const family = components.slice(index + 1).join(' ')
        if (family) found.family = family
        break
      }
      // a component before the size that nothing classified
      errors.push({ code: 'unsupported-font-component', component, where })
    }

    if (sizeIndex === -1) {
      errors.push({
        code: 'unsupported-font-component',
        component: payload,
        where,
      })
    }

    for (const kind of kinds) {
      const component = found[kind]
      if (component === undefined) continue
      const program = programs[kind]
      program.present = true
      if (isBase) {
        program.base = component
      } else {
        program.clauses.push({
          modifiers: value.clauses[clauseIndex].modifiers,
          payload: component,
        })
      }
    }
  }

  const entries: Array<{ property: string; value: ParsedValue }> = []
  for (const kind of kinds) {
    const program = programs[kind]
    if (!program.present) continue
    const shared: ParsedValue = { base: program.base, clauses: program.clauses }
    for (const longhand of targets[kind]) {
      entries.push({ property: longhand, value: shared })
    }
  }

  return { entries, errors }
}
