import { Check } from '@tamagui/lucide-icons'
import { YStack } from 'tamagui'

export const CheckCircle = () => (
  <YStack bg="$backgroundHover" w={25} h={25} ai="center" jc="center" br={100} mr="$2.5">
    <Check size={12} color="var(--colorHover)" />
  </YStack>
)
