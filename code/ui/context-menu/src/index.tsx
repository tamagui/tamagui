import '@tamagui/polyfill-dev'

import { MenuPredefinied } from '@tamagui/menu'

import { createContextMenu } from './ContextMenu'
export * from './ContextMenu'

export const ContextMenu = createContextMenu({
  Icon: MenuPredefinied.MenuIcon,
  Image: MenuPredefinied.MenuImage,
  Indicator: MenuPredefinied.MenuIndicator,
  Item: MenuPredefinied.MenuItem,
  Label: MenuPredefinied.MenuLabel,
  MenuGroup: MenuPredefinied.MenuGroup,
  Separator: MenuPredefinied.MenuSeparator,
  SubTitle: MenuPredefinied.SubTitle,
  Title: MenuPredefinied.Title,
} as const)
