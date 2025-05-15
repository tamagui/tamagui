import { createSwitch } from './createSwitch'
import { SwitchFrame, SwitchThumb } from './Switch'

export * from './createSwitch'
export * from './StyledContext'
export * from './Switch'

/**
 * @summary A component that displays a switch that can be used to toggle between two states.
 * @see — Docs https://tamagui.dev/ui/switch
 *
 * @example
 * ```tsx
 * <Switch id={id} size={props.size} defaultChecked={props.defaultChecked}>
 *  <Switch.Thumb animation="quicker" />
 * </Switch>
 * ```
 */
export const Switch = createSwitch({
  Frame: SwitchFrame,
  Thumb: SwitchThumb,
})
