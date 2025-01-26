import { YStack } from 'tamagui'

import * as AnAvatars from '../../components/animation/avatars'
import {
  Showcase,
  ShowcaseChildWrapper as Wrapper,
} from '../../components/general/_Showcase'

export function avatars() {
  return (
    <YStack pb="$10" gap="$12" padding="$2" $gtLg={{ padding: '$0' }}>
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
