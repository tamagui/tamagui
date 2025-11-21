import '@tamagui/polyfill-dev'

import { MenuPredefined } from '@tamagui/create-menu'

import { createDropdownMenu } from './DropdownMenu'

export const DropdownMenu = createDropdownMenu({
  Icon: MenuPredefined.MenuIcon,
  Image: MenuPredefined.MenuImage,
  Indicator: MenuPredefined.MenuIndicator,
  Item: MenuPredefined.MenuItem,
  Label: MenuPredefined.MenuLabel,
  MenuGroup: MenuPredefined.MenuGroup,
  Separator: MenuPredefined.MenuSeparator,
  SubTitle: MenuPredefined.SubTitle,
  Title: MenuPredefined.Title,
})
