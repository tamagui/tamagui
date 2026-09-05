import { YStack } from 'tamagui'

import * as AnAvatars from '@tamagui/bento/component/animation/avatars'
import {
  Showcase,
  ShowcaseChildWrapper as Wrapper,
} from '~/components/bento-showcase/_Showcase'

export function avatars() {
  return (
    <YStack
      paddingBottom="2 gtLg:0"
      gap="12"
      paddingTop="2 gtLg:0"
      paddingRight="2 gtLg:0"
      paddingLeft="2 gtLg:0"
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
