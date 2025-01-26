import { YStack } from 'tamagui'

import * as Preferences from '../../components/user/preferences'
// import { getCode } from '../../components/elements/avatars'
import {
  Showcase,
  ShowcaseChildWrapper as Wrapper,
} from '../../components/general/_Showcase'

type Props = ReturnType<typeof preferencesGetComponentCodes>

export function preferences(props: Props) {
  return (
    <YStack pb="$10" gap="$12" padding="$2" $gtLg={{ padding: '$0' }}>
      <Showcase
        fileName={Preferences.LocationNotification.fileName}
        title="Email Preferences"
      >
        <Wrapper p={0}>
          <Preferences.LocationNotification />
        </Wrapper>
      </Showcase>
    </YStack>
  )
}

export function preferencesGetComponentCodes() {
  return {
    codes: {
      LocationNotification: '',
    } as Omit<Record<keyof typeof Preferences, string>, 'getCode'>,
  }
}
