import { YStack } from 'tamagui'

import * as MicroInter from '@tamagui/bento/component/animation/microinteractions'
import {
  Showcase,
  ShowcaseChildWrapper as Wrapper,
} from '~/components/bento-showcase/_Showcase'

export function microinteractions() {
  return (
    <YStack
      paddingBottom="2 gtLg:0"
      gap="12"
      paddingTop="2 gtLg:0"
      paddingRight="2 gtLg:0"
      paddingLeft="2 gtLg:0"
    >
      <Showcase fileName={MicroInter.AnimatedNumbers.fileName} title="Number Slider">
        <Wrapper>
          <MicroInter.AnimatedNumbers />
        </Wrapper>
      </Showcase>

      <Showcase
        fileName={MicroInter.PaginationControl.fileName}
        title="Pagination Control"
      >
        <Wrapper>
          <MicroInter.PaginationControl />
        </Wrapper>
      </Showcase>

      <Showcase
        fileName={MicroInter.InteractiveCard.fileName}
        title="Mouse Interactive 3D Cards"
      >
        <Wrapper>
          <MicroInter.InteractiveCard />
        </Wrapper>
      </Showcase>
    </YStack>
  )
}
