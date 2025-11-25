import { YStack } from 'tamagui'

import * as Avatars from '@tamagui/bento/component/elements/avatars'
import {
  Showcase,
  ShowcaseChildWrapper as Wrapper,
} from '~/components/bento-showcase/_Showcase'
import {
  BentoShowcaseProvider,
  type BentoShowcaseContext,
} from '~/components/bento-showcase/BentoProvider'

export function avatars({ isProUser, showAppropriateModal }: BentoShowcaseContext) {
  return (
    <BentoShowcaseProvider
      isProUser={isProUser}
      showAppropriateModal={showAppropriateModal}
    >
      <YStack pb="$10" gap="$12" p="$2" $gtLg={{ p: '$0' }}>
        <Showcase
          fileName={Avatars.AvatarsGrouped.fileName}
          title="Grouped Avatars"
          unlock
        >
          <Wrapper>
            <Avatars.AvatarsGrouped />
          </Wrapper>
        </Showcase>
        <Showcase
          fileName={Avatars.CircularAvatarsWithCustomIcons.fileName}
          title="Circular Avatars with custom icons"
        >
          <Wrapper>
            <Avatars.CircularAvatarsWithCustomIcons />
          </Wrapper>
        </Showcase>
        <Showcase fileName={Avatars.RoundedAvatars.fileName} title="Rounded Avatars">
          <Wrapper>
            <Avatars.RoundedAvatars />
          </Wrapper>
        </Showcase>
        <Showcase
          fileName={Avatars.RoundedAvatarsWithCustomIcons.fileName}
          title="Rounded Avatars with Custom Icons"
        >
          <Wrapper>
            <Avatars.RoundedAvatarsWithCustomIcons />
          </Wrapper>
        </Showcase>
      </YStack>
    </BentoShowcaseProvider>
  )
}
