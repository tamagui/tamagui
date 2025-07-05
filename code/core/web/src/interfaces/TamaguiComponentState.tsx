import type { ChildGroupState } from '../types'

export type TamaguiComponentState = {
  unmounted: boolean | 'should-enter'
  disabled?: boolean
  hover?: boolean
  press?: boolean
  pressIn?: boolean
  focus?: boolean
  focusVisible?: boolean
  focusWithin?: boolean
  animation?: null | {
    style?: any
    avoidClasses?: boolean
  }

  // this is used by the component itself to figure out group styles:
  group?: Record<string, ChildGroupState>
  hasDynGroupChildren?: boolean
}
