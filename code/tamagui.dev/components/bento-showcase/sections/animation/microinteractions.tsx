import { YStack } from 'tamagui'

import * as MicroInter from '@tamagui/bento/component/animation/microinteractions'
import {
  Showcase,
  ShowcaseChildWrapper as Wrapper,
} from '~/components/bento-showcase/_Showcase'

export function microinteractions() {
  return (
    <YStack
      paddingBottom="1-5 xl:0"
      gap="88px"
      paddingTop="1-5 xl:0"
      paddingRight="1-5 xl:0"
      paddingLeft="1-5 xl:0"
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
