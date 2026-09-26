import { Check } from '@tamagui/local-icons'
import { YStack } from 'tamagui'

export const CheckCircle = () => (
  <YStack
    bg="background-hover"
    width={25}
    height={25}
    items="center"
    justify="center"
    rounded={100}
    mr="2-5"
  >
    <Check size={12} color="var(--color-hover)" />
  </YStack>
)
