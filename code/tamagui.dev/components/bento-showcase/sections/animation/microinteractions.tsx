import { YStack } from 'tamagui'

import * as MicroInter from '@tamagui/bento/component/animation/microinteractions'
import {
  Showcase,
  ShowcaseChildWrapper as Wrapper,
} from '~/components/bento-showcase/_Showcase'
import {
  type BentoShowcaseContext,
  BentoShowcaseProvider,
} from '~/components/bento-showcase/BentoProvider'

export function microinteractions({
  isProUser,
  showAppropriateModal,
}: BentoShowcaseContext) {
  return (
    <BentoShowcaseProvider
      isProUser={isProUser}
      showAppropriateModal={showAppropriateModal}
    >
      <YStack pb="$10" gap="$12" padding="$2" $gtLg={{ padding: '$0' }}>
        <Showcase
          unlock
          fileName={MicroInter.AnimatedNumbers.fileName}
          title="Number Slider"
        >
          <Wrapper>
            <MicroInter.AnimatedNumbers />
          </Wrapper>
        </Showcase>

        <Showcase
          fileName={MicroInter.PaginationControl.fileName}
          title="Pagination Control"
        >
          <Wrapper>
            <MicroInter.PaginationControl />
          </Wrapper>
        </Showcase>

        <Showcase
          fileName={MicroInter.InteractiveCard.fileName}
          title="Mouse Interactive 3D Cards"
        >
          <Wrapper>
            <MicroInter.InteractiveCard />
          </Wrapper>
        </Showcase>
      </YStack>
    </BentoShowcaseProvider>
  )
}
