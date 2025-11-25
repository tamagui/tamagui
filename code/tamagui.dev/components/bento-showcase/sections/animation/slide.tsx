import { YStack } from 'tamagui'

import * as Slide from '@tamagui/bento/component/animation/slide'
import {
  Showcase,
  ShowcaseChildWrapper as Wrapper,
} from '~/components/bento-showcase/_Showcase'
import {
  type BentoShowcaseContext,
  BentoShowcaseProvider,
} from '~/components/bento-showcase/BentoProvider'

export function slide({ isProUser, showAppropriateModal }: BentoShowcaseContext) {
  return (
    <BentoShowcaseProvider
      isProUser={isProUser}
      showAppropriateModal={showAppropriateModal}
    >
      <YStack pb="$10" gap="$12" p="$2" $gtLg={{ p: '$0' }}>
        <Showcase unlock fileName={Slide.SlideInDemo.fileName} title="Slide In">
          <Wrapper>
            <Slide.SlideInDemo />
          </Wrapper>
        </Showcase>
        <Showcase fileName={Slide.SlideOutDemo.fileName} title="Slide Out">
          <Wrapper>
            <Slide.SlideOutDemo />
          </Wrapper>
        </Showcase>
      </YStack>
    </BentoShowcaseProvider>
  )
}

export function slideGetComponentCodes() {
  return {
    codes: {
      SlideInDemo: '',
      SlideOutDemo: '',
    } as Omit<Record<keyof typeof Slide, string>, 'getCode'>,
  }
}
