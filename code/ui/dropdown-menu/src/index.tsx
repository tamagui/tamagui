import '@tamagui/polyfill-dev'

import { MenuPredefinied } from '@tamagui/menu'

import { createDropdownMenu } from './DropdownMenu'

export const DropdownMenu = createDropdownMenu({
  Icon: MenuPredefinied.MenuIcon,
  Image: MenuPredefinied.MenuImage,
  Indicator: MenuPredefinied.MenuIndicator,
  Item: MenuPredefinied.MenuItem,
  Label: MenuPredefinied.MenuLabel,
  MenuGroup: MenuPredefinied.MenuGroup,
  Separator: MenuPredefinied.MenuSeparator,
  SubTitle: MenuPredefinied.SubTitle,
  Title: MenuPredefinied.Title,
})
