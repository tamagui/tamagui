import type { TamaguiComponentState } from './interfaces/TamaguiComponentState'

export const defaultComponentState: TamaguiComponentState = {
  hover: false,
  press: false,
  pressIn: false,
  focus: false,
  focusVisible: false,
  unmounted: true,
  disabled: false,
}

export const defaultComponentStateMounted: TamaguiComponentState = {
  ...defaultComponentState,
  unmounted: false,
}
