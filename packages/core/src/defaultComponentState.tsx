export type ComponentState = typeof defaultComponentState

export const defaultComponentState = {
  hover: false,
  press: false,
  pressIn: false,
  focus: false,
  // only used by enterStyle
  mounted: false,
  animatedStyle: null as any,
}
