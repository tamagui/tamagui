import '@tamagui/polyfill-dev'

import { Image, Text, ThemeableStack } from 'tamagui'

import { createMenu } from './createMenu'
import { MenuGroup, MenuLabel, MenuSeparator } from './Menu'

export * from './Menu'
export * from './createNativeMenu'
export * from './createMenu'
export type { MenuItemImageProps } from './createNativeMenu/createNativeMenuTypes'

export const { Menu } = createMenu({
  Icon: ThemeableStack,
  Image,
  Indicator: ThemeableStack,
  Item: ThemeableStack,
  Separator: MenuSeparator,
  SubTitle: Text,
  Title: Text,
  MenuGroup,
  Label: MenuLabel,
})
