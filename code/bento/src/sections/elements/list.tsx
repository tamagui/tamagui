import { YStack } from 'tamagui'

import * as Lists from '../../components/elements/list'
import {
  Hint,
  Showcase,
  ShowcaseChildWrapper as Wrapper,
} from '../../components/general/_Showcase'

export function list() {
  return (
    <YStack pb="$10" gap="$12" padding="$2" $gtLg={{ padding: '$0' }}>
      <Showcase fileName={Lists.HList.fileName} title="Horizontal Covers">
        <Lists.HList />
      </Showcase>
      <Showcase fileName={Lists.ChatList.fileName} title="Chat List">
        <Lists.ChatList />
        <Hint>Scroll up to see more chats</Hint>
      </Showcase>
      <Showcase fileName={Lists.ItemValueList.fileName} title="Item Value List">
        <Wrapper>
          <Lists.ItemValueList />
        </Wrapper>
      </Showcase>
      <Showcase fileName={Lists.FlatGrid.fileName} title="Performant Grid with FlatList">
        <Lists.FlatGrid />
      </Showcase>
      <Showcase fileName={Lists.List.fileName} title="Phonebook List">
        <Wrapper>
          <Lists.List />
        </Wrapper>
      </Showcase>
      <Showcase fileName={Lists.MasonryListExample.fileName} title="Masonry List">
        <Lists.MasonryListExample />
      </Showcase>
    </YStack>
  )
}
