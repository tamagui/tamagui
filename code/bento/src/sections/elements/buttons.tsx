import { YStack } from 'tamagui'

import * as Buttons from '../../components/elements/buttons'
// import { getCode } from '../../components/elements/avatars'
import {
  Showcase,
  ShowcaseChildWrapper as Wrapper,
} from '../../components/general/_Showcase'

type Props = ReturnType<typeof buttonsGetComponentCodes>
export function buttons(props: Props) {
  return (
    <YStack pb="$10" gap="$12" padding="$2" $gtLg={{ padding: '$0' }}>
      <Showcase
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
