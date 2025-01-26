import React from 'react'
import { Components } from '@tamagui/bento'
import { FlatList } from 'react-native'

import { createParam } from 'solito'
import { Separator, YGroup } from 'tamagui'
import { LinkListItem } from '../home/screen'

const { useParam } = createParam<{ id: string }>()
export function BentoPartScreenItem({ navigation }) {
  const [id] = useParam('id')
  const name = id!
    .split('-')
    .map((segment) => {
      return segment[0].toUpperCase() + segment.slice(1)
    })
    .join('')

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: name,
    })
  }, [name, navigation])

  const removeComponentsThatAreNotPublic = (component: any) =>
    ![
      'AvatarWithTitle',
      'CircularAvatars',
      'VerticalCheckboxes',
      'useMouseEnter',
    ].includes(component.name)

  const renderItem = ({ item: Component }) => (
    <YGroup.Item key={Component.name}>
      <LinkListItem bg="$color1" href={'/' + Component.name} pressTheme size="$5">
        {Component.name}
      </LinkListItem>
    </YGroup.Item>
  )

  const data = Object.values(Components[name] ?? []).filter(
    removeComponentsThatAreNotPublic
  )

  return (
    <YGroup bg="$color2" f={1}>
      <FlatList
        data={data}
        renderItem={renderItem}
        ItemSeparatorComponent={Separator}
        contentContainerStyle={{ padding: 16, paddingTop: 24, paddingBottom: 32 }}
      />
    </YGroup>
  )
}
