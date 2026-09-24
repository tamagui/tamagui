import { YStack } from 'tamagui'

import * as Walkthrough from '@tamagui/bento/component/panels/walkthrough'
import { Showcase } from '~/components/bento-showcase/_Showcase'

type Props = ReturnType<typeof walkthroughGetComponentCodes>
export function walkthrough(props: Props) {
  return (
    <YStack py="11" gap="14">
      <YStack gap="88px">
        <Showcase
          fileName={Walkthrough.WalkThroughDemo.fileName}
          title="Jumping Walkthrough"
        >
          <Walkthrough.WalkThroughDemo />
        </Showcase>
        <Showcase
          fileName={Walkthrough.WalkThroughFluidDemo.fileName}
          title="Fluid Walkthrough"
        >
          <Walkthrough.WalkThroughFluidDemo />
        </Showcase>
      </YStack>
    </YStack>
  )
}

export function walkthroughGetComponentCodes() {
  return {
    codes: {
      WalkThroughDemo: '',
      WalkThroughFluidDemo: '',
    } as Omit<Record<keyof typeof Walkthrough, string>, 'getCode'>,
  }
}
