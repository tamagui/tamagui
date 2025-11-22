import { YStack } from 'tamagui'

import * as Buttons from '@tamagui/bento/component/elements/buttons'
import {
  Showcase,
  ShowcaseChildWrapper as Wrapper,
} from '~/components/bento-showcase/_Showcase'
import {
  BentoShowcaseProvider,
  type BentoShowcaseContext,
} from '~/components/bento-showcase/BentoProvider'

export function buttons({ isProUser, showAppropriateModal }: BentoShowcaseContext) {
  return (
    <BentoShowcaseProvider
      isProUser={isProUser}
      showAppropriateModal={showAppropriateModal}
    >
      <YStack pb="$10" gap="$12" p="$2" $gtLg={{ p: '$0' }}>
        <Showcase
          unlock
          fileName={Buttons.ButtonsWithLeftIcons.fileName}
          title="Buttons with Left Icons"
        >
          <Wrapper>
            <Buttons.ButtonsWithLeftIcons />
          </Wrapper>
        </Showcase>
        <Showcase
          fileName={Buttons.ButtonsWithLoaders.fileName}
          title="Buttons with Loaders"
        >
          <Wrapper>
            <Buttons.ButtonsWithLoaders />
          </Wrapper>
        </Showcase>
        <Showcase fileName={Buttons.RoundedButtons.fileName} title="Rounded Buttons">
          <Wrapper>
            <Buttons.RoundedButtons />
          </Wrapper>
        </Showcase>
      </YStack>
    </BentoShowcaseProvider>
  )
}

export function buttonsGetComponentCodes() {
  return {
    codes: {
      ButtonsWithLeftIcons: '',
      ButtonsWithLoaders: '',
      DisabledButtons: '',
      RoundedButtons: '',
    } as Omit<Record<keyof typeof Buttons, string>, 'getCode'>,
  }
}
