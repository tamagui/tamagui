import { Data } from '@tamagui/bento'
import {
  Input,
  ListItem,
  ScrollView,
  Separator,
  styled,
  View,
  YGroup,
  YStack,
} from 'tamagui'
import { LinkListItem } from '../home/screen'
import { useState } from 'react'
import { useMemo } from 'react'
import { SectionList } from 'react-native'
import { Search } from '@tamagui/lucide-icons'

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
        renderItem={({ item: { route, name } }: any) => (
          <YGroup.Item key={route}>
            <LinkListItem bg="$color1" href={route} pressTheme size="$4">
              {name}
            </LinkListItem>
          </YGroup.Item>
        )}
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
