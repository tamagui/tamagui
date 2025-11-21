import { Check } from '@tamagui/lucide-icons'
import { YStack } from 'tamagui'

export const CheckCircle = () => (
  <YStack
    bg="$backgroundHover"
    width={25}
    height={25}
    items="center"
    justify="center"
    rounded={100}
    mr="$2.5"
  >
    <Check size={12} color="var(--colorHover)" />
  </YStack>
)
