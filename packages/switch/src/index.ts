import { SwitchContext } from '@tamagui/switch-headless'

import { createSwitch } from './createSwitch'
import { SwitchFrame, SwitchThumb } from './Switch'

export * from './createSwitch'
export * from './StyledContext'
export * from './Switch'
export { SwitchContext }

export const Switch = createSwitch({
  Frame: SwitchFrame,
  Thumb: SwitchThumb,
})
