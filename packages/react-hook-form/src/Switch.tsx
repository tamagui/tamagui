import { withStaticProperties } from '@tamagui/web'
import { Switch } from '@tamagui/switch'

import { withController } from './withController'

const { Thumb } = Switch;

export const SwitchControlled = withStaticProperties(
  withController(Switch, {
    onChange: 'onCheckedChange',
    value: 'checked',
  }),
  { Thumb }
)
