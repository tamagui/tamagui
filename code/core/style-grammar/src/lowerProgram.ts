// Web lowering: one program becomes one contiguous block of CSS rules.
//
// See plans/dom-tailwind-flat-values.md — "The program block encoding". The
// invariants this file exists to hold:
//
// - every condition anchors on the subject class, Tailwind-group style, so a
//   clause is exactly ONE selector: conditions chain as `:where()` on the
//   subject in authored modifier order. Ancestor-scoped conditions become a
//   descendant test inside their own `:where()` (`.t_dark *`), which makes each
//   one independent, so nesting order between them never matters and no
//   ancestor-permutation selectors exist;
// - rule order is ascending clause precedence; selector specificity encodes
//   depth, while platform clauses receive a floor above the maximum
//   non-platform depth. Self states contribute naturally; media/container
//   wrappers and :where()-scoped theme/group ancestors contribute zero;
// - the block is inserted contiguously, so cross-program order never matters and
//   append-at-end is always safe.
//
// Payloads are emitted verbatim. Token resolution, opacity composition, and
// value validation all happen upstream: this layer receives CSS-ready payloads,
// and the same resolved program is what the class name hashes, so a program has
// exactly one identity. Rule injection through a payload is structurally
// impossible because the parser rejects a top-level `{`, `}`, or `;`.

import { parseGroupModifier } from './clauseIdentity'
import { parseContainerModifier } from './modifierRegistry'
import {
  canonicalClauseModifier,
  clauseConditionSetKey,
  clauseSubjectClassRepetitions,
  createClausePrecedenceOrder,
  getClausePrecedenceKey,
  type ClausePrecedenceOrder,
} from './clausePrecedence'
import { transformAxisCompositions } from './transformFamily'
import { programClassName } from './programHash'
import type { LonghandProgram, ModifierRegistryView } from './valueTypes'

/**
 * Where a condition's selector fragment is matched, relative to the subject: on
 * the subject itself, strictly above it, or either.
 */
export type ConditionScope = 'self' | 'within' | 'is-or-within'

export interface ConditionSelector {
  /** compound selector piece, eg `:hover`, `.t_dark`, `[aria-disabled]` */
  fragment: string
  /** defaults to `self` */
  scope?: ConditionScope
  /**
   * capability guard the rule must nest in, eg `(hover: hover)` so touch
   * devices never sticky-trigger hover styles
   */
  media?: string
}

/**
 * Interaction-state selector spellings: `disabled` is an attribute rather than
 * `:disabled`, and enter matches the unmounted class on the subject or above it.
 * Mirrored as data instead of imported because this package must not depend on
 * @tamagui/web.
 *
 * Lifecycle clauses use classes supplied by createComponent. `is-or-within`
 * lets a presence boundary carry the lifecycle state for descendants too.
 */
export const defaultStateSelectors: Readonly<Record<string, ConditionSelector>> =
  Object.freeze({
    hover: { fragment: ':hover', media: '(hover: hover)' },
    // the press modifier's CSS pseudo name is `active`
    press: { fragment: ':active' },
    // the registered alias of press
    active: { fragment: ':active' },
    focus: { fragment: ':focus' },
    'focus-visible': { fragment: ':focus-visible' },
    'focus-within': { fragment: ':focus-within' },
    disabled: { fragment: '[aria-disabled]' },
    enter: { fragment: '.t_unmounted', scope: 'is-or-within' },
    exit: { fragment: '.t_exiting', scope: 'is-or-within' },
  })

// core writes the unnamed group's class as `t_group_true`, from the boolean
// `group` prop (see getSplitStyles' group class name construction)
const unnamedGroup = 'true'

// a capability guard (hover: hover) wraps once even when the subject and a
// group both carry the hover state in one clause
function pushCapabilityGuard(wrappers: string[], media: string): void {
  const guard = `@media ${media}`
  for (let index = 0; index < wrappers.length; index++) {
    if (wrappers[index] === guard) return
  }
  wrappers.push(guard)
}

export interface LowerProgramOptions {
  /** classifies each modifier; the same registry the value was parsed against */
  registry: ModifierRegistryView
  /** opaque stamp for the resolved config that produced these payloads */
  configRevision: string
  /** media key -> the `@media` condition text, eg `(max-width: 860px)` */
  mediaQueries?: Readonly<Record<string, string>>
  /**
   * media key -> the `@container` condition text, eg `(min-width: 24rem)`. Sizes
   * are the same keys as `mediaQueries`, but the query text differs: container
   * queries measure the container, not the viewport, so the caller derives both
   * from config.
   */
  containerQueries?: Readonly<Record<string, string>>
  /** modifier -> selector, defaults to `defaultStateSelectors` */
  stateSelectors?: Readonly<Record<string, ConditionSelector>>
  /** precomputed media declaration order; derived from mediaQueries by default */
  precedenceOrder?: ClausePrecedenceOrder
  /** theme class prefix; `t_` gives `.t_dark` */
  themeClassPrefix?: string
  /** group class prefix; `t_group_` gives `.t_group_card` */
  groupClassPrefix?: string
}

export interface LoweredProgram {
  className: string
  /** base rule first, then one rule per emitted clause in precedence order */
  rules: string[]
  /**
   * Present when the program writes a per-axis custom property (`x`, `y`,
   * `scaleX`, `scaleY`). The composing rule turns the axis variables into the
   * real CSS property and is identical for every element using that axis group,
   * so it carries its own class name and hash: the caller adds this class too and
   * insertion dedups it to one rule per sheet. Its specificity is the same
   * (0,1,0) as every other rule here.
   */
  composition?: {
    /** the CSS property being composed, and the classNames key to store it under */
    property: string
    className: string
    rules: string[]
  }
}

function hyphenate(property: string): string {
  let out = ''
  for (let index = 0; index < property.length; index++) {
    const code = property.charCodeAt(index)
    out +=
      code >= 65 && code <= 90 ? `-${property[index].toLowerCase()}` : property[index]
  }
  return out
}

function conditionSelector(
  fragment: string,
  scope: ConditionScope,
  zeroSpecificity: boolean
): string {
  const pseudo = zeroSpecificity ? 'where' : 'is'
  if (scope === 'within') return `:${pseudo}(${fragment} *)`
  if (scope === 'is-or-within') {
    return `:${pseudo}(${fragment}, ${fragment} *)`
  }
  return zeroSpecificity ? `:where(${fragment})` : fragment
}

type PointerEventsMode = 'auto' | 'none' | 'box-none' | 'box-only'

function isPointerEventsMode(value: string): value is PointerEventsMode {
  return (
    value === 'auto' || value === 'none' || value === 'box-none' || value === 'box-only'
  )
}

function pointerEventsCSS(mode: PointerEventsMode): {
  subject: 'auto' | 'none'
  children: 'auto' | 'none'
} {
  return {
    subject: mode === 'none' || mode === 'box-none' ? 'none' : 'auto',
    children: mode === 'none' || mode === 'box-only' ? 'none' : 'auto',
  }
}

export function lowerProgram(
  program: LonghandProgram,
  options: LowerProgramOptions
): LoweredProgram {
  const {
    registry,
    configRevision,
    mediaQueries,
    containerQueries,
    stateSelectors = defaultStateSelectors,
    precedenceOrder = createClausePrecedenceOrder(mediaQueries),
    themeClassPrefix = 't_',
    groupClassPrefix = 't_group_',
  } = options

  const className = programClassName(program.property, program.value, configRevision)
  const declaration = hyphenate(program.property)
  const rules: string[] = []

  // React Native's box-only/box-none values need a subject rule and a direct-child
  // rule. If either appears in a program, every clause emits both halves so moving
  // between (for example) box-none and none cannot leave the base child rule active.
  const pointerEventsProgram =
    program.property === 'pointerEvents' &&
    [program.value.base, ...program.value.clauses.map((clause) => clause.payload)].some(
      (value) => value === 'box-none' || value === 'box-only'
    )

  const pushRule = (selector: string, wrappers: readonly string[], value: string) => {
    if (pointerEventsProgram && isPointerEventsMode(value)) {
      const pointerEvents = pointerEventsCSS(value)
      rules.push(
        wrapAtRules(`${selector}{${declaration}:${pointerEvents.subject}}`, wrappers)
      )
      rules.push(
        wrapAtRules(`${selector}>*{${declaration}:${pointerEvents.children}}`, wrappers)
      )
      return
    }
    rules.push(wrapAtRules(`${selector}{${declaration}:${value}}`, wrappers))
  }

  if (program.value.base !== null) {
    pushRule(`.${className}`, [], program.value.base)
  }

  const clauseSlots = new Map<
    string,
    { clause: (typeof program.value.clauses)[number]; index: number }
  >()
  for (let index = 0; index < program.value.clauses.length; index++) {
    const clause = program.value.clauses[index]
    clauseSlots.set(clauseConditionSetKey(clause.modifiers), { clause, index })
  }
  const clauses = [...clauseSlots.values()]
    .map((entry) => ({
      ...entry,
      precedence: getClausePrecedenceKey(
        entry.clause.modifiers,
        registry,
        precedenceOrder
      ),
    }))
    .sort((left, right) => left.precedence - right.precedence || left.index - right.index)

  for (const { clause, precedence } of clauses) {
    let selectorSuffix = ''
    let selfStateSpecificity = 0
    // at-rule preludes wrapping this clause, outermost first in authored order
    const wrappers: string[] = []
    let skip = false
    const seenModifiers = new Set<string>()

    for (const authoredModifier of clause.modifiers) {
      const modifier = canonicalClauseModifier(authoredModifier)
      if (seenModifiers.has(modifier)) continue
      seenModifiers.add(modifier)
      const kind = registry.get(modifier)

      if (kind === 'platform') {
        // a web clause applies here exactly as if unconditional at its position;
        // every other platform's clause belongs to native and is not web CSS
        if (modifier !== 'web') skip = true
        continue
      }

      if (kind === 'media') {
        const query = mediaQueries?.[modifier]
        if (!query) {
          throw new Error(
            `cannot lower "${modifier}:" — no media query was provided for media key "${modifier}"`
          )
        }
        wrappers.push(`@media ${query}`)
        continue
      }

      if (kind === 'container') {
        const container = parseContainerModifier(modifier)!
        const query = containerQueries?.[container.size]
        if (!query) {
          throw new Error(
            `cannot lower "${modifier}:" — no container query was provided for size "${container.size}"`
          )
        }
        wrappers.push(
          container.container === null
            ? `@container ${query}`
            : `@container ${container.container} ${query}`
        )
        continue
      }

      if (kind === 'state') {
        const state = stateSelectors[modifier]
        if (!state) {
          throw new Error(
            `cannot lower "${modifier}:" — the state has no web selector, so it cannot become CSS`
          )
        }
        selectorSuffix += conditionSelector(state.fragment, state.scope ?? 'self', false)
        selfStateSpecificity++
        if (state.media) pushCapabilityGuard(wrappers, state.media)
        continue
      }

      if (kind === 'theme') {
        // the theme class is on the subject or anywhere above it
        selectorSuffix += conditionSelector(
          `.${themeClassPrefix}${modifier}`,
          'is-or-within',
          true
        )
        continue
      }

      if (kind === 'group') {
        const group = parseGroupModifier(modifier)!
        const state = stateSelectors[group.state]
        if (!state) {
          throw new Error(
            `cannot lower "${modifier}:" — the group state "${group.state}" has no web selector`
          )
        }
        // a group is always a parent, never the subject itself
        selectorSuffix += conditionSelector(
          `.${groupClassPrefix}${group.group ?? unnamedGroup}${state.fragment}`,
          'within',
          true
        )
        if (state.media) pushCapabilityGuard(wrappers, state.media)
        continue
      }

      throw new Error(
        `cannot lower "${modifier}:" — it is not a registered modifier, so the value was never validated`
      )
    }

    if (skip) continue

    const selector =
      `.${className}`.repeat(
        clauseSubjectClassRepetitions(precedence, selfStateSpecificity)
      ) + selectorSuffix
    pushRule(selector, wrappers, clause.payload)
  }

  const composition = transformAxisCompositions[program.property]
  if (!composition) return { className, rules }

  // one shared rule per axis group: same text, same hash, inserted once
  const compositionClassName = programClassName(
    composition.property,
    { base: composition.value, clauses: [] },
    configRevision
  )
  const localDefaults = Object.entries(composition.defaults)
    .map(([property, value]) => `${property}:${value}`)
    .join(';')
  return {
    className,
    rules,
    composition: {
      property: composition.property,
      className: compositionClassName,
      rules: [
        `:where(.${compositionClassName}){${localDefaults}}`,
        `.${compositionClassName}{${composition.property}:${composition.value}}`,
      ],
    },
  }
}

/**
 * Media and container conditions wrap outermost, first authored outermost, and
 * both share one list so a chain mixing them keeps authored order. Nesting is
 * AND for arbitrary query texts, where joining with ` and ` would break on query
 * lists and on `screen and (…)` forms. Specificity is unmoved either way.
 */
function wrapAtRules(rule: string, wrappers: readonly string[]): string {
  let out = rule
  for (let index = wrappers.length - 1; index >= 0; index--) {
    out = `${wrappers[index]} {${out}}`
  }
  return out
}
