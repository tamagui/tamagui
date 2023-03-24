import { Checkbox as CheckboxDefault, withStaticProperties } from 'tamagui'

import { withController } from './withController'

const { Indicator } = CheckboxDefault

export const CheckboxControlled = withStaticProperties(
  withController(CheckboxDefault, { onChange: 'onCheckedChange' }),
  { Indicator }
)
