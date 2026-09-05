import { YStack } from 'tamagui'

import * as Preferences from '@tamagui/bento/component/user/preferences'
import {
  Showcase,
  ShowcaseChildWrapper as Wrapper,
} from '~/components/bento-showcase/_Showcase'

type Props = ReturnType<typeof preferencesGetComponentCodes>

export function preferences() {
  return (
    <YStack
      paddingBottom="2 gtLg:0"
      gap="12"
      paddingTop="2 gtLg:0"
      paddingRight="2 gtLg:0"
      paddingLeft="2 gtLg:0"
    >
      <Showcase fileName={Preferences.Meeting.fileName} title="Meeting Time">
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
