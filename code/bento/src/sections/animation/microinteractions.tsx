import { YStack } from 'tamagui'

import * as MicroInter from '../../components/animation/microinteractions'
import {
  Showcase,
  ShowcaseChildWrapper as Wrapper,
} from '../../components/general/_Showcase'

export function microinteractions() {
  return (
    <YStack pb="$10" gap="$12" padding="$2" $gtLg={{ padding: '$0' }}>
      <Showcase
        fileName={MicroInter.PaginationControl.fileName}
        title="Pagination Control"
      >
        <Wrapper>
          <MicroInter.PaginationControl />
        </Wrapper>
      </Showcase>
      <Showcase fileName={MicroInter.AnimatedNumbers.fileName} title="Number Slider">
        <Wrapper>
          <MicroInter.AnimatedNumbers />
        </Wrapper>
      </Showcase>
      <Showcase
        fileName={MicroInter.InteractiveCardExample.fileName}
        title="Mouse Interactive 3D Cards"
      >
        <Wrapper>
          <MicroInter.InteractiveCardExample />
        </Wrapper>
      </Showcase>
    </YStack>
  )
}
