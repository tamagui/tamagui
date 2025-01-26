import { YStack } from 'tamagui'

import * as Dialogs from '../../components/elements/dialogs'
import {
  Showcase,
  ShowcaseChildWrapper as Wrapper,
} from '../../components/general/_Showcase'

export function dialogs() {
  return (
    <YStack pb="$10" gap="$12" padding="$2" $gtLg={{ padding: '$0' }}>
      <Showcase fileName={Dialogs.SlidingPopoverDemo.fileName} title="Sliding Popover">
        <Wrapper>
          <Dialogs.SlidingPopoverDemo />
        </Wrapper>
      </Showcase>

      <Showcase
        fileName={Dialogs.AlertDemo.fileName}
        title="React Native API Compatible Alert"
      >
        <Wrapper>
          <Dialogs.AlertDemo />
        </Wrapper>
      </Showcase>
      <Showcase fileName={Dialogs.IosStyleAlert.fileName} title="IOS style Alert">
        <Wrapper>
          <Dialogs.IosStyleAlert />
        </Wrapper>
      </Showcase>
      <Showcase
        fileName={Dialogs.AlertWithIcon.fileName}
        title="Alert with icon and tint color"
      >
        <Wrapper>
          <Dialogs.AlertWithIcon />
        </Wrapper>
      </Showcase>
    </YStack>
  )
}
