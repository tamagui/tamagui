import { YStack } from 'tamagui'

import * as Buttons from '@tamagui/bento/component/animation/buttons'
// import { getCode } from '@tamagui/bento/component/elements/avatars'
import {
  Showcase,
  ShowcaseChildWrapper as Wrapper,
} from '~/components/bento-showcase/_Showcase'
import {
  type BentoShowcaseContext,
  BentoShowcaseProvider,
} from '~/components/bento-showcase/BentoProvider'

type Props = ReturnType<typeof buttonsGetComponentCodes> & BentoShowcaseContext

export function buttons({ isProUser, showAppropriateModal }: Props) {
  return (
    <BentoShowcaseProvider
      isProUser={isProUser}
      showAppropriateModal={showAppropriateModal}
    >
      <YStack pb="$10" gap="$12" padding="$2" $gtLg={{ padding: '$0' }}>
        <Showcase
          unlock
          fileName={Buttons.ButtonLoading.fileName}
          title="Loading Animation"
        >
          <Wrapper>
            <Buttons.ButtonLoading />
          </Wrapper>
        </Showcase>
        <Showcase fileName={Buttons.ButtonPulse.fileName} title="Press Animation">
          <Wrapper>
            <Buttons.ButtonPulse />
          </Wrapper>
        </Showcase>
        <Showcase fileName={Buttons.IconCenterButton.fileName} title="Icon Animation">
          <Wrapper>
            <Buttons.IconCenterButton />
          </Wrapper>
        </Showcase>
      </YStack>
    </BentoShowcaseProvider>
  )
}

export function buttonsGetComponentCodes() {
  return {
    codes: {
      ButtonLoading: '',
      ButtonPulse: '',
      FillButton: '',
      IconCenterButton: '',
    } as Omit<Record<keyof typeof Buttons, string>, 'getCode'>,
  }
}
