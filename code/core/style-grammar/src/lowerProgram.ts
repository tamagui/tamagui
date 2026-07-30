// Web lowering: one program becomes one contiguous block of CSS rules.
//
// See plans/dom-tailwind-flat-values.md — "The program block encoding". The
// invariants this file exists to hold:
//
// - every rule has specificity exactly (0,1,0), the subject class alone, because
//   every condition is wrapped in `:where()` and media conditions add nothing;
// - `rules` is authored clause order with the base first, and that order IS the
//   semantics: equal specificity reduces the cascade to source order inside the
//   block, so the last matching clause wins, exactly as native evaluates it;
// - the block is inserted contiguously, so cross-program order never matters and
//   append-at-end is always safe.
//
// Payloads are emitted verbatim. Token resolution, opacity composition, and
// value validation all happen upstream: this layer receives CSS-ready payloads,
// and the same resolved program is what the class name hashes, so a program has
// exactly one identity.

import { parseGroupModifier } from './modifierRegistry'
import { programClassName } from './programHash'
import { stateToSelector } from './states'
import type { LonghandProgram, ModifierRegistryView } from './valueTypes'

export interface ConditionSelector {
  /** compound selector piece appended to the element the condition applies to */
  fragment: string
  /**
   * the condition can also sit on an ancestor, so the rule emits both an
   * ancestor form and a same-element form (themes, and the enter state's
   * unmounted class)
   */
  dual?: boolean
}

/**
 * Interaction-state selector spellings, mirroring
 * `code/core/web/src/helpers/pseudoDescriptors.ts` and the two special cases in
 * `getCSSStylesAtomic.createAtomicRules`: `disabled` is an attribute rather than
 * `:disabled`, and enter is the dual `.t_unmounted` selector. Mirrored as data
 * instead of imported because this package must not depend on @tamagui/web.
 *
 * `exit` is deliberately absent: core has no CSS selector for it (the animation
 * driver owns exit), so an `exit:` clause cannot lower to CSS and says so.
 */
export const defaultStateSelectors: Readonly<Record<string, ConditionSelector>> =
  Object.freeze({
    hover: { fragment: ':hover' },
    // pressStyle's CSS pseudo name is `active`
    press: { fragment: ':active' },
    // the registered alias of press
    active: { fragment: ':active' },
    focus: { fragment: ':focus' },
    'focus-visible': { fragment: ':focus-visible' },
    'focus-within': { fragment: ':focus-within' },
    disabled: { fragment: '[aria-disabled]' },
    enter: { fragment: '.t_unmounted', dual: true },
    // component-tier states, from the shared state vocabulary's web selectors
    ...(Object.fromEntries(
      Object.entries(stateToSelector).map(([state, selector]) => [state, { fragment: selector }])
    ) as Record<string, ConditionSelector>),
  })

// core writes the unnamed group's class as `t_group_true`, from the boolean
// `group` prop (see getSplitStyles' group class name construction)
const unnamedGroup = 'true'

export interface LowerProgramOptions {
  /** classifies each modifier; the same registry the value was parsed against */
  registry: ModifierRegistryView
  /** opaque stamp for the resolved config that produced these payloads */
  configRevision: string
  /** media key -> the `@media` condition text, eg `(max-width: 800px)` */
  mediaQueries?: Readonly<Record<string, string>>
  /** modifier -> selector, defaults to `defaultStateSelectors` */
  stateSelectors?: Readonly<Record<string, ConditionSelector>>
  /** theme class prefix; `t_` gives `.t_dark` */
  themeClassPrefix?: string
  /** group class prefix; `t_group_` gives `.t_group_card` */
  groupClassPrefix?: string
}

export interface LoweredProgram {
  className: string
  /** base rule first, then one rule per emitted clause in authored order */
  rules: string[]
}

type Slot =
  /** must match an ancestor of the subject */
  | { placement: 'ancestor'; fragment: string }
  /** must match the subject itself */
  | { placement: 'same'; fragment: string }
  /** may match either, so the rule emits both forms */
  | { placement: 'dual'; fragment: string }

function hyphenate(property: string): string {
  let out = ''
  for (let index = 0; index < property.length; index++) {
    const code = property.charCodeAt(index)
    out +=
      code >= 65 && code <= 90 ? `-${property[index].toLowerCase()}` : property[index]
  }
  return out
}

export function lowerProgram(
  program: LonghandProgram,
  options: LowerProgramOptions
): LoweredProgram {
  const {
    registry,
    configRevision,
    mediaQueries,
    stateSelectors = defaultStateSelectors,
    themeClassPrefix = 't_',
    groupClassPrefix = 't_group_',
  } = options

  const className = programClassName(program.property, program.value, configRevision)
  const declaration = hyphenate(program.property)
  const rules: string[] = []

  if (program.value.base !== null) {
    rules.push(`.${className} { ${declaration}: ${program.value.base} }`)
  }

  for (const clause of program.value.clauses) {
    const slots: Slot[] = []
    const medias: string[] = []
    let skip = false

    for (const modifier of clause.modifiers) {
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
        medias.push(query)
        continue
      }

      if (kind === 'state') {
        const selector = stateSelectors[modifier]
        if (!selector) {
          throw new Error(
            `cannot lower "${modifier}:" — the state has no web selector, so it cannot become CSS`
          )
        }
        slots.push({
          placement: selector.dual ? 'dual' : 'same',
          fragment: selector.fragment,
        })
        continue
      }

      if (kind === 'theme') {
        // a theme class sits on an ancestor or on the subject itself
        slots.push({ placement: 'dual', fragment: `.${themeClassPrefix}${modifier}` })
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
        slots.push({
          placement: 'ancestor',
          fragment: `.${groupClassPrefix}${group.group ?? unnamedGroup}${state.fragment}`,
        })
        continue
      }

      throw new Error(
        `cannot lower "${modifier}:" — it is not a registered modifier, so the value was never validated`
      )
    }

    if (skip) continue

    rules.push(
      wrapMedia(
        `${buildSelectors(className, slots)} { ${declaration}: ${clause.payload} }`,
        medias
      )
    )
  }

  return { className, rules }
}

/**
 * One selector per dual-placement combination, comma joined. Dual conditions
 * take their ancestor form first, so a theme reads
 * `:where(.t_dark) .cls, .cls:where(.t_dark)`. Every fragment is wrapped in
 * `:where()`, so specificity stays exactly the subject class.
 */
function buildSelectors(className: string, slots: readonly Slot[]): string {
  let dualCount = 0
  for (const slot of slots) if (slot.placement === 'dual') dualCount++

  const selectors: string[] = []
  for (let variant = 0; variant < 1 << dualCount; variant++) {
    let ancestors = ''
    let subject = `.${className}`
    let dualIndex = 0
    for (const slot of slots) {
      let placement = slot.placement
      if (placement === 'dual') {
        // bit clear picks the ancestor form, so variant 0 is all-ancestor
        placement = (variant >> dualIndex++) & 1 ? 'same' : 'ancestor'
      }
      if (placement === 'ancestor') ancestors += `:where(${slot.fragment}) `
      else subject += `:where(${slot.fragment})`
    }
    selectors.push(ancestors + subject)
  }
  return selectors.join(', ')
}

/** media conditions wrap outermost, first authored outermost; specificity unmoved */
function wrapMedia(rule: string, medias: readonly string[]): string {
  let out = rule
  for (let index = medias.length - 1; index >= 0; index--) {
    out = `@media ${medias[index]} { ${out} }`
  }
  return out
}
