import { YStack } from 'tamagui'

import * as Walkthrough from '../../components/panels/walkthrough'
// import { getCode } from '../../components/elements/avatars'
import { Showcase } from '../../components/general/_Showcase'

type Props = ReturnType<typeof walkthroughGetComponentCodes>
export function walkthrough(props: Props) {
  return (
    <YStack py="$8" gap="$10">
      <YStack gap="$12">
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
