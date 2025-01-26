import { YStack } from 'tamagui'

import * as Buttons from '../../components/animation/buttons'
// import { getCode } from '../../components/elements/avatars'
import {
  Showcase,
  ShowcaseChildWrapper as Wrapper,
} from '../../components/general/_Showcase'

type Props = ReturnType<typeof buttonsGetComponentCodes>
export function buttons(props: Props) {
  return (
    <YStack pb="$10" gap="$12" padding="$2" $gtLg={{ padding: '$0' }}>
      <Showcase fileName={Buttons.ButtonLoading.fileName} title="Loading Animation">
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
