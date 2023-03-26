import { withStaticProperties } from '@tamagui/web'
import { Select } from '@tamagui/select'

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
  ScrollUpButton,
  ScrollDownButton,
  Label,
  Sheet,
  Adapt,
  Icon,
} = Select

export const SelectControlled = withStaticProperties(
  withController(Select, { onChange: "onValueChange"}),
  {
    Trigger,
    Value,
    Content,
    Viewport,
    Group,
    Item,
    Label,
    ItemText,
    ItemIndicator,
    ScrollUpButton,
    ScrollDownButton,
    Sheet,
    Adapt,
    Icon,
  }
)
