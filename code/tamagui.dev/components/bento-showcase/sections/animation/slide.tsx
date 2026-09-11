import { YStack } from 'tamagui'

import * as Slide from '@tamagui/bento/component/animation/slide'
import {
  Showcase,
  ShowcaseChildWrapper as Wrapper,
} from '~/components/bento-showcase/_Showcase'

export function slide() {
  return (
    <YStack
      paddingBottom="2 gtLg:0"
      gap="12"
      paddingTop="2 gtLg:0"
      paddingRight="2 gtLg:0"
      paddingLeft="2 gtLg:0"
    >
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
