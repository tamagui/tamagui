import { Button, YStack } from 'tamagui'

import AnimationsDemo from './demos/AnimationsDemo'
import ButtonDemo from './demos/ButtonDemo'

export const Test = () => {
  return (
    <YStack p="$10">
      <Button>hello222</Button>
      <ButtonDemo />
      <AnimationsDemo />
    </YStack>
  )
}
