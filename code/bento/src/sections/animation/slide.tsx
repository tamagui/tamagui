import { YStack } from 'tamagui'

import * as Slide from '../../components/animation/slide'
// import { getCode } from '../../components/elements/avatars'
import {
  Showcase,
  ShowcaseChildWrapper as Wrapper,
} from '../../components/general/_Showcase'

type Props = ReturnType<typeof slideGetComponentCodes>
export function slide(props: Props) {
  return (
    <YStack pb="$10" gap="$12" padding="$2" $gtLg={{ padding: '$0' }}>
      <Showcase fileName={Slide.SlideInDemo.fileName} title="Slide In">
        <Wrapper>
          <Slide.SlideInDemo />
        </Wrapper>
      </Showcase>
      <Showcase fileName={Slide.SlideOutDemo.fileName} title="Slide Out">
        <Wrapper>
          <Slide.SlideOutDemo />
        </Wrapper>
      </Showcase>
    </YStack>
  )
}

export function slideGetComponentCodes() {
  return {
    codes: {
      SlideInDemo: '',
      SlideOutDemo: '',
    } as Omit<Record<keyof typeof Slide, string>, 'getCode'>,
  }
}
