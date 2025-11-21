import '@tamagui/polyfill-dev'

import { createMenu } from './createMenu'
import { MenuPredefined } from './Menu'

export * from './createMenu'
export * from './createNativeMenu'
export type { MenuItemImageProps } from './createNativeMenu/createNativeMenuTypes'
export * from './Menu'

export const { Menu: MenuExample } = createMenu({
  Icon: MenuPredefined.MenuIcon,
  Image: MenuPredefined.MenuImage,
  Indicator: MenuPredefined.MenuIndicator,
  Item: MenuPredefined.MenuItem,
  Separator: MenuPredefined.MenuSeparator,
  SubTitle: MenuPredefined.SubTitle,
  Title: MenuPredefined.Title,
  MenuGroup: MenuPredefined.MenuGroup,
  Label: MenuPredefined.MenuLabel,
})
