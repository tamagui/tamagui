import { createSwitch } from './createSwitch'
import { SwitchFrame, SwitchThumb } from './Switch'

export * from './createSwitch'
export * from './StyledContext'
export * from './Switch'

export const Switch = createSwitch({
  Frame: SwitchFrame,
  Thumb: SwitchThumb,
})
