import { Switch as SwitchDefault, withStaticProperties } from 'tamagui'

import { withController } from './withController'

const { Thumb } = SwitchDefault;

export const SwitchControlled = withStaticProperties(
  withController(SwitchDefault, {
    onChange: 'onCheckedChange',
    value: 'checked',
  }),
  { Thumb }
)
