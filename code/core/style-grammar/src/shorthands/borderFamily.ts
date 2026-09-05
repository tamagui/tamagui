// The border family: value-dependent splitting of the resetting CSS border
// shorthands into per-longhand programs, the background family's model applied
// to width/style/color. A program must never sit on a resetting shorthand —
// the order-free cross-program encoding depends on every program owning one
// true longhand — so `border="2px solid red hover:blue"` becomes width, style,
// and color programs per side, and a later `borderColor` restates exactly the
// color longhands.

import { classifyComponent, splitTopLevelComponents } from './backgroundFamily'
import type { ParsedClause, ParsedValue } from '../ast/valueTypes'

interface BorderFamilyTargets {
  width: readonly string[]
  style: readonly string[]
  color: readonly string[]
}

const sides = ['Top', 'Right', 'Bottom', 'Left'] as const

/** authored prop -> the true longhands each component kind lands on */
export const borderFamilyTargets: Readonly<Record<string, BorderFamilyTargets>> = {
  border: {
    width: sides.map((side) => `border${side}Width`),
    style: sides.map((side) => `border${side}Style`),
    color: sides.map((side) => `border${side}Color`),
  },
  ...Object.fromEntries(
    sides.map((side) => [
      `border${side}`,
      {
        width: [`border${side}Width`],
        style: [`border${side}Style`],
        color: [`border${side}Color`],
      },
    ])
  ),
  outline: {
    width: ['outlineWidth'],
    style: ['outlineStyle'],
    color: ['outlineColor'],
  },
  // logical shorthands split into CSS logical longhands. web lowers them
  // verbatim; RN has no logical block/inline border properties, so native
  // evaluation diagnoses and drops these longhands (no silent physical
  // approximation — the mapping depends on writing mode)
  borderBlock: {
    width: ['borderBlockStartWidth', 'borderBlockEndWidth'],
    style: ['borderBlockStartStyle', 'borderBlockEndStyle'],
    color: ['borderBlockStartColor', 'borderBlockEndColor'],
  },
  borderInline: {
    width: ['borderInlineStartWidth', 'borderInlineEndWidth'],
    style: ['borderInlineStartStyle', 'borderInlineEndStyle'],
    color: ['borderInlineStartColor', 'borderInlineEndColor'],
  },
}

const lineStyles = new Set([
  'none',
  'hidden',
  'dotted',
  'dashed',
  'solid',
  'double',
  'groove',
  'ridge',
  'inset',
  'outset',
])

const widthKeywords = new Set(['thin', 'medium', 'thick'])

// a length: bare number (RN spelling), number+unit, or a width keyword.
// calc() and var() also measure as widths when nothing else claims them
const lengthPattern = /^-?(\d+\.?\d*|\.\d+)([a-z%]+)?$/i

function classifyBorderComponent(
  component: string,
  property: string,
  colorTokens: ReadonlySet<string>
): 'width' | 'style' | 'color' | null {
  const lower = component.toLowerCase()
  if (lineStyles.has(lower)) return 'style'
  // outline-style additionally allows auto
  if (lower === 'auto' && property === 'outline') return 'style'
  if (widthKeywords.has(lower) || lengthPattern.test(component)) return 'width'
  if (classifyComponent(component, colorTokens) === 'color') return 'color'
  if (/^(calc|var|min|max|clamp)\(/i.test(component)) return 'width'
  return null
}

export interface BorderFamilyError {
  code: 'unsupported-border-component'
  component: string
  where: 'base' | number
}

interface MutableProgram {
  base: string | null
  clauses: ParsedClause[]
  present: boolean
}

export function splitBorderValue(
  property: string,
  value: ParsedValue,
  colorTokens: ReadonlySet<string>
): {
  entries: Array<{ property: string; value: ParsedValue }>
  errors: BorderFamilyError[]
} {
  const targets = borderFamilyTargets[property]
  const errors: BorderFamilyError[] = []
  const kinds = ['width', 'style', 'color'] as const
  const programs: Record<(typeof kinds)[number], MutableProgram> = {
    width: { base: null, clauses: [], present: false },
    style: { base: null, clauses: [], present: false },
    color: { base: null, clauses: [], present: false },
  }

  for (let clauseIndex = -1; clauseIndex < value.clauses.length; clauseIndex++) {
    const isBase = clauseIndex === -1
    const payload = isBase ? value.base : value.clauses[clauseIndex].payload
    if (payload === null) continue
    const where = isBase ? ('base' as const) : clauseIndex

    const found: Partial<Record<(typeof kinds)[number], string>> = {}
    for (const component of splitTopLevelComponents(payload)) {
      const kind = classifyBorderComponent(component, property, colorTokens)
      if (kind === null || found[kind] !== undefined) {
        errors.push({ code: 'unsupported-border-component', component, where })
        continue
      }
      found[kind] = component
    }

    // Carry the shorthand's effective zero width explicitly. Web receives an
    // equivalent reset, and native does not have to rely on style `none` alone
    // to hide an edge whose width was supplied by another contribution.
    if (found.style === 'none' && found.width === undefined) {
      found.width = '0'
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
      // programs are immutable, so every side may alias the same value
      entries.push({ property: longhand, value: shared })
    }
  }

  return { entries, errors }
}
