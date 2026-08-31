// Value-level payload-shape validation, owned by the resolution layer per the
// design record ("Value-level validation of resolved payloads has exactly one
// owner, the resolution step"). One source of truth for the runtime, the
// compiler, and the ESLint rule — none of them may grow a second opinion
// about what a suspicious payload looks like.
//
// The clause grammar is space-greedy by design: a payload extends until the
// next `modifier:` clause, because many longhands legitimately take
// space-separated component lists (`boxShadow="inset 0 2px red"`). The
// consequence is that a base written AFTER a conditional is absorbed into
// that conditional's payload — `backgroundColor="sm:green red"` parses as one
// clause with payload "green red" and NO base, the browser then drops the
// invalid declaration, and the element renders with nothing at every
// viewport. The absorption stays (changing it would break legitimate
// multi-component payloads); the silence goes: a multi-component payload on a
// longhand that takes exactly one component value is a diagnostic.

import { splitTopLevelComponents } from '../shorthands/backgroundFamily'

/**
 * Longhands whose value is a component LIST, where a multi-component payload
 * is ordinary CSS. Everything else that this validator is asked about is
 * treated as single-component. Family shorthands (`border`, `background`,
 * `textDecoration`, `font`) never reach payload validation — they split into
 * per-longhand programs first.
 */
const listValuedLonghands: ReadonlySet<string> = new Set([
  'boxShadow',
  'textShadow',
  'transform',
  'transition',
  'transitionProperty',
  'animation',
  'animationName',
  'backgroundImage',
  'backgroundPosition',
  'backgroundSize',
  'backgroundRepeat',
  'fontFamily',
  'fontVariant',
  'filter',
  'backdropFilter',
  'willChange',
  'quotes',
  'textDecorationLine',
  'containIntrinsicSize',
  'strokeDasharray',
  'gridTemplateColumns',
  'gridTemplateRows',
  'gridTemplateAreas',
  'gridArea',
  'gridColumn',
  'gridRow',
  'inset',
  'mask',
  'maskImage',
  'maskPosition',
  'maskSize',
])

export interface PayloadShapeDiagnostic {
  code: 'multi-component-single-value'
  property: string
  payload: string
  message: string
}

/**
 * Returns a diagnostic when `payload` holds more than one top-level component
 * for a longhand that takes exactly one. `hasBase` sharpens the message: with
 * no base in the program, the most likely cause is a base written after a
 * conditional and swallowed by its space-greedy payload.
 */
export function validatePayloadShape(
  property: string,
  payload: string,
  hasBase: boolean
): PayloadShapeDiagnostic | null {
  if (listValuedLonghands.has(property)) return null
  const components = splitTopLevelComponents(payload)
  if (components.length <= 1) return null
  return {
    code: 'multi-component-single-value',
    property,
    payload,
    message:
      `"${payload}" holds ${components.length} values but "${property}" takes one.` +
      (hasBase
        ? ''
        : ` A value written after a conditional joins that conditional's payload — write the base value before the first conditional.`),
  }
}
