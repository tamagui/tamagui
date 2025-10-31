import type { TamaguiComponentState } from './types'

export const defaultComponentState: TamaguiComponentState = {
  hover: false,
  press: false,
  pressIn: false,
  focus: false,
  focusVisible: false,
  focusWithin: false,
  unmounted: true,
  disabled: false,
}

export const defaultComponentStateMounted: TamaguiComponentState = {
  ...defaultComponentState,
  unmounted: false,
}

export const defaultComponentStateShouldEnter: TamaguiComponentState = {
  ...defaultComponentState,
  unmounted: 'should-enter',
}
