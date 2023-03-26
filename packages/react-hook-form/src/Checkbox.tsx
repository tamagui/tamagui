import { withStaticProperties } from '@tamagui/web'
import { Checkbox } from '@tamagui/checkbox'

import { withController } from './withController'

const { Indicator } = Checkbox

export const CheckboxControlled = withStaticProperties(
  withController(Checkbox, { onChange: 'onCheckedChange' }),
  {
    Indicator,
  }
)
