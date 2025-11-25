import { Check } from '@tamagui/lucide-icons'
import { styled, YStack } from 'tamagui'

const RedCheck = styled(Check, {
  color: 'red',
})

const GreenCheck = styled(Check, {
  color: 'green',
})

export const StyledIconColor = () => (
  <YStack gap="$4" padding="$4">
    <Check color="blue" testID="direct-blue" />
    <RedCheck testID="styled-red" />
    <GreenCheck testID="styled-green" />
    <RedCheck color="purple" testID="override-purple" />
  </YStack>
)
