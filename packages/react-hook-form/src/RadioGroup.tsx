import { RadioGroup as RadioGroupDefault, withStaticProperties } from 'tamagui'

import { withController } from './withController'

const { Item, Indicator } = RadioGroupDefault

export const RadioGroupControlled = withStaticProperties(
  withController(RadioGroupDefault, {
    onChange: 'onValueChange',
  }),
  { Item, Indicator }
)
