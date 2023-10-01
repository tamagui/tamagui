import { createSwitch } from './createSwitch'
import { SwitchFrame, SwitchThumb } from './Switch'

export * from './Switch'
export * from './SwitchContext'
export * from './createSwitch'

export const Switch = createSwitch({
  Frame: SwitchFrame,
  Thumb: SwitchThumb,
})
