import { Button, YStack } from 'tamagui'

import AnimationsDemo from './demos/AnimationsDemo'
import ButtonDemo from './demos/ButtonDemo'

export const Test = () => {
  return (
    <YStack p="$10">
      <Button theme="light">hello2</Button>
      <ButtonDemo />
      <AnimationsDemo />
    </YStack>
  )
}
