import { Slot } from 'one'
import { YStack } from 'tamagui'

// minimal layout for popup windows - no header, footer, or nav
export default function PopLayout() {
  return (
    <YStack minHeight="100vh" bg="background">
      <Slot />
    </YStack>
  )
}
