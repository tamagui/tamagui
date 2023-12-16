import { createSwitch } from './createSwitch'
import { SwitchContext, createSwitch as createHeadlessSwitch } from './headless'
import { SwitchFrame, SwitchThumb } from './Switch'
export * from './Switch'
export * from './SwitchContext'
export * from './createSwitch'

export const Switch = createSwitch({
  Frame: SwitchFrame,
  Thumb: SwitchThumb,
})

export { createHeadlessSwitch, SwitchContext }
