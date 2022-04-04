import { Button, Spacer, YStack } from 'tamagui'

import AnimationsDemo from './demos/AnimationsDemo'
import ButtonDemo from './demos/ButtonDemo'
import TooltipDemo from './demos/TooltipDemo'
import { MediaPlayer } from './MediaPlayer'

export const Test = () => {
  return (
    <YStack p="$10" space="$10">
      <TooltipDemo />
      <MediaPlayer alt={1} />
      <Button theme="light">hello2</Button>
      <ButtonDemo />
      <AnimationsDemo />
    </YStack>
  )
}
