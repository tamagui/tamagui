export type ComponentState = typeof defaultComponentState

export const defaultComponentState = {
  hover: false,
  press: false,
  pressIn: false,
  focus: false,
  // only used by enterStyle
  mounted: false,
  animation: null as null | {
    style?: any
    avoidClasses?: boolean
  },
}
