import { Data } from '@tamagui/bento'
import { H4, H5, Input, ListItem, styled, Text, View, YGroup, YStack } from 'tamagui'
import { LinkListItem } from '../home/screen'
import { useState } from 'react'
import { useMemo } from 'react'
import { SectionList } from 'react-native'
import {
  RectangleHorizontal,
  CheckCircle,
  CheckSquare,
  FormInput,
  Image as ImageIcon,
  Layout,
  Search,
  TextCursorInput,
  ToggleRight,
  CircleUserRound,
  Table,
  BadgeAlert,
  MessageSquareShare,
  PanelTop,
  PanelLeft,
  NotebookTabs,
  Calendar,
  MousePointerClick,
  Banana,
  ShoppingCart,
  ShoppingBag,
  Cog,
  BellDot,
  List as ListIcon,
} from '@tamagui/lucide-icons'

const List = styled(SectionList, {
  flex: 1,
  backgroundColor: '$background',
  contentContainerStyle: {
    paddingBottom: 100,
  },
})

export function BentoScreen() {
  const [search, setSearch] = useState('')

  const filteredDemos = useMemo(() => {
    return Data.listingData.sections
      .filter((section) => section.parts.some((part) => part.name.includes(search)))
      .map((section) => ({
        title: section.sectionName,
        data: section.parts,
      }))
  }, [search])

  return (
    <YGroup flex={1}>
      <View
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
        bg="$background"
        p="$4"
      >
        <Input
          placeholder="Search"
          value={search}
          onChangeText={setSearch}
          clearButtonMode="while-editing"
          inlineImageLeft="search_icon"
          inputMode="search"
          returnKeyType="search"
        />
      </View>
      <List
        stickyHeaderHiddenOnScroll
        sections={filteredDemos}
        // data={filteredDemos}
        stickySectionHeadersEnabled
        renderItem={({ item }: any) => <Item item={item} />}
        renderSectionHeader={({ section: { title } }: any) => (
          <YGroup.Item key={title}>
            <ListItem fontWeight="bold">{title.toUpperCase()}</ListItem>
          </YGroup.Item>
        )}
        keyExtractor={(item, index) => `$section-${index}`}
      />
    </YGroup>
  )
}

const Item = ({ item: { name, route, numberOfComponents } }) => {
  const Icon = BENTO_COMPONENT_ICONS?.[name] ?? TextCursorInput

  return (
    <YGroup.Item key={name}>
      <LinkListItem gap="$4" bg="$color1" href={'/' + route} pressTheme size="$5">
        <View
          p="$2"
          bg="$backgroundPress"
          borderRadius={10000}
          rotate="-12deg"
          overflow="hidden"
        >
          <Icon size="$1" />
        </View>
        <YStack gap="$0" flex={1} justifyContent="space-between">
          <H5 fontWeight="bold">{name}</H5>
          <Text>{numberOfComponents} components</Text>
        </YStack>
      </LinkListItem>
    </YGroup.Item>
  )
}

const BENTO_COMPONENT_ICONS = {
  Inputs: TextCursorInput,
  Checkboxes: CheckSquare,
  Layouts: Layout,
  RadioGroups: CheckCircle,
  Switches: ToggleRight,
  Textareas: FormInput,
  'Image Pickers': ImageIcon,
  List: ListIcon,
  Avatars: CircleUserRound,
  Buttons: RectangleHorizontal,
  DatePickers: Calendar,
  Tables: Table,
  Chips: BadgeAlert,
  Dialogs: MessageSquareShare,
  Navbar: PanelTop,
  Sidebar: PanelLeft,
  Tabbar: NotebookTabs,
  Microinteractions: MousePointerClick,
  Slide: Banana,
  Cart: ShoppingCart,
  'Product Page': ShoppingBag,
  Preferences: Cog,
  'Event Reminders': BellDot,
}
