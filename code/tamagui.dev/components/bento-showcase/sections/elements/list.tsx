import { YStack } from 'tamagui'

import * as Lists from '@tamagui/bento/component/elements/list'
import {
  Hint,
  Showcase,
  ShowcaseChildWrapper as Wrapper,
} from '~/components/bento-showcase/_Showcase'
import {
  type BentoShowcaseContext,
  BentoShowcaseProvider,
} from '~/components/bento-showcase/BentoProvider'

export function list({ isProUser, showAppropriateModal }: BentoShowcaseContext) {
  return (
    <BentoShowcaseProvider
      isProUser={isProUser}
      showAppropriateModal={showAppropriateModal}
    >
      <YStack pb="$10" gap="$12" padding="$2" $gtLg={{ padding: '$0' }}>
        <Showcase unlock fileName={Lists.HList.fileName} title="Horizontal Covers">
          <Lists.HList />
        </Showcase>

        <Showcase fileName={Lists.Chat.fileName} title={Lists.Chat.fileName}>
          <YStack flex={1} alignItems="center" maxHeight={700}>
            <YStack themeInverse bg="$background" position="absolute" inset={0} />
            <Lists.Chat />
          </YStack>
        </Showcase>

        <Showcase fileName={Lists.ScrollProgress.fileName} title="Scroll Progress">
          <Lists.ScrollProgress />
        </Showcase>

        <Showcase fileName={Lists.WheelList.fileName} title="Wheel List">
          <Lists.WheelList />
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
        <Showcase
          fileName={Lists.FlatGrid.fileName}
          title="Performant Grid with FlatList"
        >
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
    </BentoShowcaseProvider>
  )
}
