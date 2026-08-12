// The shared IR for the universal flat value grammar.
//
// This file is the contract between the value parser, the per-longhand program
// merge engine, the compiler, and every frontend (props, Tailwind classes,
// styled skins). See plans/dom-tailwind-flat-values.md on main — "The universal
// value grammar" and "Programs and merging" — for the full design. The rules
// that matter are restated here so this file can be read standalone.
//
// Grammar:
//
//   value  := base? clause*
//   clause := modifier (":" modifier)* ":" payload
//
// - `base` and each `payload` are plain CSS component-value sequences. They are
//   NOT interpreted here; the parser only splits, it never resolves.
// - Clause detection is purely syntactic: a top-level colon (outside strings
//   and outside any paren nesting, url() included) always starts a clause. A
//   top-level colon is never valid inside a CSS component value, so this is
//   unambiguous with zero configuration.
// - The identifier chain before the colon must be entirely registered
//   modifiers. An unregistered modifier is a hard parse error (`hver:` never
//   silently becomes part of a value).
// - An empty payload is a parse error. A clause with no preceding base is fine
//   (`bg="hover:red"`).
//
// Programs:
//
// - Every authored prop expands (via shorthand + family tables) to one or more
//   CSS longhands. Each longhand accumulates one program in authored order.
//   Contributions merge by base or normalized condition-set slot, so a later
//   clause replaces only that slot and unrelated earlier clauses persist.

export type ModifierKind =
  | 'state'
  | 'theme'
  | 'media'
  | 'platform'
  | 'group'
  /** container queries: `@sm:` nearest container, `@sm/card:` named */
  | 'container'

/**
 * What the parser needs to know about registered modifiers. Implementations
 * project the user config (media keys, root themes, platform names) plus the
 * built-in state vocabulary into this view. Parameterized modifiers
 * (`group-<name>-<state>`) are the implementation's concern — `get` receives
 * the full authored spelling.
 */
export interface ModifierRegistryView {
  get(name: string): ModifierKind | undefined
}

/** one `modifiers ":" payload` clause, modifiers in authored order */
export interface ParsedClause {
  modifiers: readonly string[]
  /** trimmed raw CSS component-value sequence; never empty */
  payload: string
}

export interface ParsedValue {
  /** trimmed unconditional leading value, or null when the string starts with a clause */
  base: string | null
  clauses: readonly ParsedClause[]
}

export type ValueParseErrorCode =
  | 'unregistered-modifier'
  | 'empty-payload'
  | 'empty-modifier'
  | 'unterminated-string'
  | 'unterminated-function'
  /**
   * a top-level `{`, `}`, or `;` — never valid in a CSS component value, and
   * rejecting them here is what makes rule/selector injection through a
   * payload structurally impossible in the web lowering
   */
  | 'invalid-character'

export interface ValueParseError {
  code: ValueParseErrorCode
  /** character offset into the source string where the error was detected */
  index: number
  message: string
  /** the offending modifier spelling, for unregistered-modifier */
  modifier?: string
}

export type ValueParseResult =
  | { ok: true; value: ParsedValue }
  | { ok: false; errors: readonly ValueParseError[] }

/**
 * CSS-wide keywords and universal values that resolve as literal CSS even when
 * ident resolution is config-first. A token may never take one of these names;
 * config creation must reject it. Shared by the parser's ident resolution and
 * config-time validation.
 */
export const reservedCssIdents: ReadonlySet<string> = new Set([
  'inherit',
  'initial',
  'unset',
  'revert',
  'none',
  'auto',
  'transparent',
  'currentColor',
])

/**
 * One longhand's merged program: which CSS longhand, the parsed value that owns
 * it, and which authored prop contributed it (for diagnostics and devtools).
 */
export interface LonghandProgram {
  /** camelCase longhand matching React Native / react style keys */
  property: string
  value: ParsedValue
  /** the authored prop name that won this longhand */
  sourceProp: string
}
