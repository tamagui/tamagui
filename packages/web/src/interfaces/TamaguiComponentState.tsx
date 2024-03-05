import type { GroupState } from '../types'

export type TamaguiComponentState = {
  disabled: boolean
  hover: boolean
  press: boolean
  pressIn: boolean
  focus: boolean
  focusVisible: boolean
  unmounted: boolean | 'should-enter'
  animation?: null | {
    style?: any
    avoidClasses?: boolean
  }
  // for groups:
  group?: Record<string, GroupState>
}
