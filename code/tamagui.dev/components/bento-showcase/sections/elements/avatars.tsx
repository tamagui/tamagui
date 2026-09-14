import { YStack } from 'tamagui'

import * as Avatars from '@tamagui/bento/component/elements/avatars'
import {
  Showcase,
  ShowcaseChildWrapper as Wrapper,
} from '~/components/bento-showcase/_Showcase'

export function avatars() {
  return (
    <YStack
      paddingBottom="2 gtLg:0"
      gap="12"
      paddingTop="2 gtLg:0"
      paddingRight="2 gtLg:0"
      paddingLeft="2 gtLg:0"
    >
      <Showcase fileName={Avatars.AvatarsGrouped.fileName} title="Grouped Avatars">
        <Wrapper>
          <Avatars.AvatarsGrouped />
        </Wrapper>
      </Showcase>
      <Showcase
        fileName={Avatars.CircularAvatarsWithCustomIcons.fileName}
        title="Circular Avatars with custom icons"
      >
        <Wrapper>
          <Avatars.CircularAvatarsWithCustomIcons />
        </Wrapper>
      </Showcase>
      <Showcase fileName={Avatars.RoundedAvatars.fileName} title="Rounded Avatars">
        <Wrapper>
          <Avatars.RoundedAvatars />
        </Wrapper>
      </Showcase>
      <Showcase
        fileName={Avatars.RoundedAvatarsWithCustomIcons.fileName}
        title="Rounded Avatars with Custom Icons"
      >
        <Wrapper>
          <Avatars.RoundedAvatarsWithCustomIcons />
        </Wrapper>
      </Showcase>
    </YStack>
  )
}
