import '@tamagui/polyfill-dev'

import { createMenu } from './createMenu'
import { MenuPredefinied } from './Menu'

export * from './Menu'
export * from './createNativeMenu'
export * from './createMenu'
export type { MenuItemImageProps } from './createNativeMenu/createNativeMenuTypes'

export const { Menu } = createMenu({
  Icon: MenuPredefinied.MenuIcon,
  // TODO: fix this typescript error with Image
  // @ts-ignore
  Image: MenuPredefinied.MenuImage,
  Indicator: MenuPredefinied.MenuIndicator,
  Item: MenuPredefinied.MenuItem,
  Separator: MenuPredefinied.MenuSeparator,
  SubTitle: MenuPredefinied.SubTitle,
  Title: MenuPredefinied.Title,
  MenuGroup: MenuPredefinied.MenuGroup,
  Label: MenuPredefinied.MenuLabel,
})
