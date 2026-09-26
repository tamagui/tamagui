// The text-decoration family: value-dependent splitting of the resetting CSS
// `text-decoration` shorthand into per-longhand programs, the border family's
// model applied to line/style/color. `text-decoration-line` is the one CSS
// longhand here whose value is itself a keyword LIST (`underline overline`),
// so multiple line keywords accumulate into one payload instead of erroring
// as duplicates.

import { classifyComponent, splitTopLevelComponents } from './backgroundFamily'
import type { ParsedClause, ParsedValue } from '../ast/valueTypes'

interface TextDecorationFamilyTargets {
  line: readonly string[]
  style: readonly string[]
  color: readonly string[]
}

/** authored prop -> the true longhands each component kind lands on */
export const textDecorationFamilyTargets: Readonly<
  Record<string, TextDecorationFamilyTargets>
> = {
  textDecoration: {
    line: ['textDecorationLine'],
    style: ['textDecorationStyle'],
    color: ['textDecorationColor'],
  },
}

const lineKeywords = new Set(['none', 'underline', 'overline', 'line-through'])

const styleKeywords = new Set(['solid', 'double', 'dotted', 'dashed', 'wavy'])

export interface TextDecorationFamilyError {
  code: 'unsupported-text-decoration-component'
  component: string
  where: 'base' | number
}

interface MutableProgram {
  base: string | null
  clauses: ParsedClause[]
  present: boolean
}

export function splitTextDecorationValue(
  value: ParsedValue,
  colorTokens: ReadonlySet<string>
): {
  entries: Array<{ property: string; value: ParsedValue }>
  errors: TextDecorationFamilyError[]
} {
  const targets = textDecorationFamilyTargets.textDecoration
  const errors: TextDecorationFamilyError[] = []
  const kinds = ['line', 'style', 'color'] as const
  const programs: Record<(typeof kinds)[number], MutableProgram> = {
    line: { base: null, clauses: [], present: false },
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
      const lower = component.toLowerCase()
      if (lineKeywords.has(lower)) {
        // the line longhand's value is a keyword list, so repeats accumulate
        found.line = found.line === undefined ? component : `${found.line} ${component}`
        continue
      }
      const kind = styleKeywords.has(lower)
        ? ('style' as const)
        : classifyComponent(component, colorTokens) === 'color'
          ? ('color' as const)
          : null
      if (kind === null || found[kind] !== undefined) {
        // thickness (a length) has no cross-platform longhand, so it errors
        // like any unknown component and the whole value stays legacy
        errors.push({
          code: 'unsupported-text-decoration-component',
          component,
          where,
        })
        continue
      }
      found[kind] = component
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
