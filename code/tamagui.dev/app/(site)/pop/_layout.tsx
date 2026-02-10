import { Slot } from 'one'
import { YStack } from 'tamagui'
import { ThemeNameEffect } from '~/features/site/theme/ThemeNameEffect'

// minimal layout for popup windows - no header, footer, or nav
export default function PopLayout() {
  return (
    <YStack minHeight="100vh" bg="$background">
      <ThemeNameEffect colorKey="$color1" />
      <Slot />
    </YStack>
  )
}
