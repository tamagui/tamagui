import { Moon } from '@tamagui/lucide-icons-2'
import { YStack } from 'tamagui'
import { Button } from '../components/Button'

// Button text follows the font scale at the control size, but the icon reads
// the Button skin's own icon table, not the font scale.
export function IconFontSizing() {
  return (
    <YStack gap="4" padding="4">
      <Button size="sm" icon={Moon} testID="btn-2">
        Small
      </Button>
      <Button size="lg" icon={Moon} testID="btn-6">
        Large
      </Button>
      {/* direct icon with a token size resolves via the font size scale */}
      <Moon size="2" testID="icon-2" />
      <Moon size="8" testID="icon-8" />
    </YStack>
  )
}
