import { H1, YStack } from 'tamagui'

import * as Events from '../../components/user/events'
import {
  Showcase,
  ShowcaseChildWrapper as Wrapper,
} from '../../components/general/_Showcase'

export function events() {
  return (
    <>
      <YStack pb="$10" gap="$12" padding="$2" $gtLg={{ padding: '$0' }}>
        <Showcase fileName={Events.Example.fileName} title="Meeting Time">
          <Wrapper p={0}>
            <Events.Example />
          </Wrapper>
        </Showcase>
        <Showcase
          fileName={Events.StatusTracker.fileName}
          title="Employees Status Tracker"
        >
          <Wrapper p={0}>
            <Events.StatusTracker />
          </Wrapper>
        </Showcase>
      </YStack>
    </>
  )
}
