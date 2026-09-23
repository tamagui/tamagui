import { YStack } from 'tamagui'

import * as Chips from '@tamagui/bento/component/elements/chips'
import {
  Showcase,
  WithSize,
  ShowcaseChildWrapper as Wrapper,
} from '~/components/bento-showcase/_Showcase'

export function chips() {
  return (
    <YStack
      paddingBottom="1-5 xl:0"
      gap="88px"
      paddingTop="1-5 xl:0"
      paddingRight="1-5 xl:0"
      paddingLeft="1-5 xl:0"
    >
      <Showcase fileName={Chips.Chips.fileName} title="Simple Chips">
        <Wrapper>
          <WithSize>
            <Chips.Chips />
          </WithSize>
        </Wrapper>
      </Showcase>
      <Showcase
        fileName={Chips.ChipsNoTextColor.fileName}
        title="Chips White Text and Pressable"
      >
        <Wrapper>
          <WithSize>
            <Chips.ChipsNoTextColor />
          </WithSize>
        </Wrapper>
      </Showcase>
      <Showcase fileName={Chips.ChipsRounded.fileName} title="Rounded Chips">
        <Wrapper>
          <WithSize>
            <Chips.ChipsRounded />
          </WithSize>
        </Wrapper>
      </Showcase>
      <Showcase
        fileName={Chips.ChipsWithCloseIcon.fileName}
        title="Chips with Close Icon"
      >
        <Wrapper>
          <WithSize>
            <Chips.ChipsWithCloseIcon />
          </WithSize>
        </Wrapper>
      </Showcase>
      <Showcase fileName={Chips.ChipsWithIcon.fileName} title="Chips with Icon">
        <Wrapper>
          <WithSize>
            <Chips.ChipsWithIcon />
          </WithSize>
        </Wrapper>
      </Showcase>
    </YStack>
  )
}
