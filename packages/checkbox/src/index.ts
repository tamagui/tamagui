import { CheckboxFrame, CheckboxIndicatorFrame } from './Checkbox'
import { createCheckbox } from './createCheckbox'

export * from './createCheckbox'
export * from './Checkbox'
export * from './CheckboxStyledContext'

export const Checkbox = createCheckbox({
  Frame: CheckboxFrame,
  Indicator: CheckboxIndicatorFrame,
})
