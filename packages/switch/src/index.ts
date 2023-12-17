import { createSwitch } from './createSwitch'
import { SwitchFrame, SwitchThumb } from './Switch'
export * from './Switch'
export * from './StyledContext'
export * from './createSwitch'
export { SwitchContext } from '@tamagui/switch-headless'
export const Switch = createSwitch({
  Frame: SwitchFrame,
  Thumb: SwitchThumb,
})
