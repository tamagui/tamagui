import { Select as SelectDefault, withStaticProperties } from 'tamagui'

import { withController } from './withController'

const {
  Trigger,
  Value,
  Content,
  Viewport,
  Group,
  Item,
  ItemText,
  ItemIndicator,
} = SelectDefault
export const SelectControlled = withStaticProperties(
  withController(SelectDefault, { onChange: "onValueChange"}),
  {
    Trigger,
    Value,
    Content,
    Viewport,
    Group,
    Item,
    ItemText,
    ItemIndicator,
  }
)
