import { YStack } from 'tamagui'

import * as Dialogs from '@tamagui/bento/component/elements/dialogs'
import {
  Showcase,
  ShowcaseChildWrapper as Wrapper,
} from '~/components/bento-showcase/_Showcase'

export function dialogs() {
  return (
    <YStack
      paddingBottom="1-5 xl:0"
      gap="88px"
      paddingTop="1-5 xl:0"
      paddingRight="1-5 xl:0"
      paddingLeft="1-5 xl:0"
    >
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
