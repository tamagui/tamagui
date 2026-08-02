import { Moon } from '@tamagui/lucide-icons-2'
import { YStack } from 'tamagui'
import { Button } from '../components/Button'

// The skin resolves size tokens through the token scales: text + icon follow
// the font scale at the same token as the frame.
export function IconFontSizing() {
  return (
    <YStack gap="4" padding="4">
      <Button size="3" icon={Moon} testID="btn-2">
        Small
      </Button>
      <Button size="5" icon={Moon} testID="btn-6">
        Large
      </Button>
      {/* direct icon with a token size resolves via the font size scale */}
      <Moon size="2" testID="icon-2" />
      <Moon size="8" testID="icon-8" />
    </YStack>
  )
}
