import { withStaticProperties } from '@tamagui/helpers'
import type { SizeTokens, StaticConfig, TamaguiComponent, TextProps } from '@tamagui/web'
import { View, Text } from '@tamagui/web'
import { ContextProps, ListStyledContext } from './StyledContext'
import { ListItemText as DefaultListText } from './ListItem'

type TextType = (props: TextProps & ContextProps) => any

export function createListItem<
  F extends TamaguiComponent<ContextProps>,
  T extends TextType,
  I extends TamaguiComponent<{ after?: boolean }>,
  C extends typeof View,
>(createProps: {
  Frame: F
  ListText: T
  Title: T
  Subtitle: T
  Icon: I
  TextContent: C
}) {
  const {
    ListText = DefaultListText,
    Title,
    Subtitle,
    Icon,
    TextContent,
    Frame,
  } = createProps

  ListText.staticConfig.context = ListStyledContext
  Title.staticConfig.context = ListStyledContext
  Subtitle.staticConfig.context = ListStyledContext
  Icon.staticConfig.context = ListStyledContext
  TextContent.staticConfig.context = ListStyledContext
  Frame.staticConfig.context = ListStyledContext

  const ListItem = withStaticProperties(Frame, {
    Text: ListText,
    Title,
    Subtitle,
    Icon,
    TextContent,
  })
  return ListItem
}
