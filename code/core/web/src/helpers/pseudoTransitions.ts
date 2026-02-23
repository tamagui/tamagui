import type { TransitionProp, PseudoTransitions, TamaguiComponentState } from '../types'

/**
 * Pseudo state for tracking enter/exit transitions
 */
export type PseudoState = {
  hover?: boolean
  press?: boolean
  focus?: boolean
  // track group pseudo states: { groupName: { hover: boolean, press: boolean } }
  groups?: Record<string, { hover?: boolean; press?: boolean; focus?: boolean }>
}

/**
 * Resolves the effective transition based on pseudo state changes.
 * When entering a pseudo state (e.g., hover), use that pseudo's transition.
 * When exiting (returning to base), use the base transition.
 *
 * CSS-like semantics:
 * - Enter hover: Uses hover's transition (fast snap)
 * - Exit hover: Uses base transition (slow fade)
 */
export function resolveEffectivePseudoTransition(
  prev: PseudoState | undefined,
  next: TamaguiComponentState,
  pseudoTransitions: PseudoTransitions | undefined | null,
  baseTransition: TransitionProp | undefined | null
): TransitionProp | undefined | null {
  if (!pseudoTransitions) {
    return baseTransition
  }

  // treat undefined prev as all-false so first interaction detects entering
  const prevState = prev || { hover: false, press: false, focus: false, groups: {} }

  // check which pseudo states are being entered (priority: press > hover > focus)
  if (next.press && !prevState.press && pseudoTransitions.pressStyle) {
    return pseudoTransitions.pressStyle
  }
  if (next.hover && !prevState.hover && pseudoTransitions.hoverStyle) {
    return pseudoTransitions.hoverStyle
  }
  if (next.focus && !prevState.focus && pseudoTransitions.focusStyle) {
    return pseudoTransitions.focusStyle
  }

  // check group pseudo transitions (e.g., $group-scenario4-hover)
  for (const key in pseudoTransitions) {
    if (key.startsWith('$group-')) {
      // parse $group-{name}-{pseudo} format
      const match = key.match(/^\$group-(.+)-(hover|press|focus)$/)
      if (!match) continue

      const groupName = match[1]
      const pseudoType = match[2] as 'hover' | 'press' | 'focus'

      // get current and previous group pseudo state
      const nextGroupPseudo = next.group?.[groupName]?.pseudo
      const prevGroupPseudo = prevState.groups?.[groupName]

      // check if entering this group pseudo state
      if (nextGroupPseudo?.[pseudoType] && !prevGroupPseudo?.[pseudoType]) {
        return pseudoTransitions[key as `$group-${string}-${'hover' | 'press' | 'focus'}`]
      }
    }
  }

  // exiting uses base transition
  return baseTransition
}

/**
 * Extracts pseudo state from TamaguiComponentState for storage in prevPseudoState
 */
export function extractPseudoState(state: TamaguiComponentState): PseudoState {
  const groups: PseudoState['groups'] = {}

  if (state.group) {
    for (const groupName in state.group) {
      const pseudo = state.group[groupName]?.pseudo
      if (pseudo) {
        groups[groupName] = {
          hover: pseudo.hover,
          press: pseudo.press,
          focus: pseudo.focus,
        }
      }
    }
  }

  return {
    hover: state.hover,
    press: state.press,
    focus: state.focus,
    groups,
  }
}
