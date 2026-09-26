import { YStack } from 'tamagui'

import * as AnAvatars from '@tamagui/bento/component/animation/avatars'
import {
  Showcase,
  ShowcaseChildWrapper as Wrapper,
} from '~/components/bento-showcase/_Showcase'

export function avatars() {
  return (
    <YStack
      paddingBottom="1-5 xl:0"
      gap="88px"
      paddingTop="1-5 xl:0"
      paddingRight="1-5 xl:0"
      paddingLeft="1-5 xl:0"
    >
      <Showcase fileName={AnAvatars.AvatarsTooltip.fileName} title="Hoverable Avatars">
        <Wrapper>
          <AnAvatars.AvatarsTooltip />
        </Wrapper>
      </Showcase>
      <Showcase
        fileName={AnAvatars.AvatarsTooltipFancy.fileName}
        title="Fancy Hoverable Avatars"
      >
        <Wrapper>
          <AnAvatars.AvatarsTooltipFancy />
        </Wrapper>
      </Showcase>
    </YStack>
  )
}
