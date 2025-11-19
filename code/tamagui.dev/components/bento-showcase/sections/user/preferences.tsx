import { YStack } from 'tamagui'

import * as Preferences from '@tamagui/bento/component/user/preferences'
import {
  Showcase,
  ShowcaseChildWrapper as Wrapper,
} from '~/components/bento-showcase/_Showcase'
import { BentoShowcaseProvider } from '~/components/bento-showcase/BentoProvider'

type Props = ReturnType<typeof preferencesGetComponentCodes> & {
  isProUser: boolean
  showAppropriateModal: () => void
}

export function preferences({ isProUser, showAppropriateModal }: Props) {
  return (
    <BentoShowcaseProvider
      isProUser={isProUser}
      showAppropriateModal={showAppropriateModal}
    >
      <YStack pb="$10" gap="$12" padding="$2" $gtLg={{ padding: '$0' }}>
        <Showcase
          unlock={true}
          fileName={Preferences.Meeting.fileName}
          title="Meeting Time"
        >
          <Wrapper p={0}>
            <Preferences.Meeting />
          </Wrapper>
        </Showcase>

        <Showcase
          fileName={Preferences.LocationNotification.fileName}
          title="Email Preferences"
        >
          <Wrapper p={0}>
            <Preferences.LocationNotification />
          </Wrapper>
        </Showcase>

        <Showcase
          fileName={Preferences.StatusTracker.fileName}
          title="Employees Status Tracker"
        >
          <Wrapper p={0}>
            <Preferences.StatusTracker />
          </Wrapper>
        </Showcase>
      </YStack>
    </BentoShowcaseProvider>
  )
}

export function preferencesGetComponentCodes() {
  return {
    codes: {
      LocationNotification: '',
      Meeting: '',
      StatusTracker: '',
    } as Omit<Record<keyof typeof Preferences, string>, 'getCode'>,
  }
}
