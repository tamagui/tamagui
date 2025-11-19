import { YStack } from 'tamagui'

import * as AnAvatars from '@tamagui/bento/component/animation/avatars'
import {
  Showcase,
  ShowcaseChildWrapper as Wrapper,
} from '~/components/bento-showcase/_Showcase'
import {
  type BentoShowcaseContext,
  BentoShowcaseProvider,
} from '~/components/bento-showcase/BentoProvider'

export function avatars({ isProUser, showAppropriateModal }: BentoShowcaseContext) {
  return (
    <BentoShowcaseProvider
      isProUser={isProUser}
      showAppropriateModal={showAppropriateModal}
    >
      <YStack pb="$10" gap="$12" padding="$2" $gtLg={{ padding: '$0' }}>
        <Showcase
          unlock
          fileName={AnAvatars.AvatarsTooltip.fileName}
          title="Hoverable Avatars"
        >
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
    </BentoShowcaseProvider>
  )
}
