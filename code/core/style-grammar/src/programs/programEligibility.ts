// One owner for "does a flat clause value on this prop evaluate through the
// program engine". The runtime consults it before contributing, the codemod
// consults it before converting a condition object, and the ESLint rule
// consults it before blessing a clause spelling — so a migration can never
// produce source the runtime will not evaluate (review P0-2).

/**
 * Props with no per-part flat clause spelling BY DESIGN, mapped to the
 * composite property that owns their clause spelling.
 *
 * - RN shadow parts are not CSS longhands: plain values compose into
 *   boxShadow/textShadow (web `styleToCSS`) or pass straight to the RN host,
 *   and the composite property carries any conditional.
 * - Transform parts outside the flat family (skews, 3D rotations,
 *   perspective, matrix) have no per-part spelling; the raw `transform`
 *   property is one ordinary program and owns their clauses (design record,
 *   "The transform family").
 */
export const legacyPartComposite: Readonly<Record<string, string>> = Object.freeze({
  shadowColor: 'boxShadow',
  shadowOffset: 'boxShadow',
  shadowOpacity: 'boxShadow',
  shadowRadius: 'boxShadow',
  textShadowColor: 'textShadow',
  textShadowOffset: 'textShadow',
  textShadowRadius: 'textShadow',
  perspective: 'transform',
  skewX: 'transform',
  skewY: 'transform',
  matrix: 'transform',
  rotateX: 'transform',
  rotateY: 'transform',
  rotateZ: 'transform',
})

export type ProgramEligibility = 'program' | 'legacy-part'

/**
 * 'program': a clause-bearing flat value on this prop evaluates through the
 * program engine. 'legacy-part': plain values keep their legacy pipeline and
 * a clause-bearing value is a diagnostic naming the composite — never a
 * silent forward, never a codemod conversion.
 */
export function programEligibility(prop: string): ProgramEligibility {
  return prop in legacyPartComposite ? 'legacy-part' : 'program'
}
