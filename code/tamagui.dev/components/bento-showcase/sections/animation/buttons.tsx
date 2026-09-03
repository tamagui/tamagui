import { YStack } from 'tamagui'

import * as Buttons from '@tamagui/bento/component/animation/buttons'
import {
  Showcase,
  ShowcaseChildWrapper as Wrapper,
} from '~/components/bento-showcase/_Showcase'

type Props = ReturnType<typeof buttonsGetComponentCodes>

export function buttons() {
  return (
    <YStack
      paddingBottom="2 gtLg:0"
      gap="12"
      paddingTop="2 gtLg:0"
      paddingRight="2 gtLg:0"
      paddingLeft="2 gtLg:0"
    >
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
