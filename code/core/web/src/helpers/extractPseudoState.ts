import type { TamaguiComponentState } from '../types'

type PseudoState = {
  hover?: boolean
  press?: boolean
  focus?: boolean
  groups?: Record<string, { hover?: boolean; press?: boolean; focus?: boolean }>
}

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
