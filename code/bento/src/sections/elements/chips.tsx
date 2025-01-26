import { YStack } from 'tamagui'

import * as Chips from '../../components/elements/chips'
import {
  Showcase,
  WithSize,
  ShowcaseChildWrapper as Wrapper,
} from '../../components/general/_Showcase'

export function chips() {
  return (
    <YStack pb="$10" gap="$12" padding="$2" $gtLg={{ padding: '$0' }}>
      {/* <Showcase fileName={Chips.Chips.fileName} title="Simple Chips">
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
      </Showcase> */}
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
