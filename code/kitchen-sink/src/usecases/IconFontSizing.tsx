import { Moon } from '@tamagui/lucide-icons-2'
import { Button, YStack } from 'tamagui'

// icons should size to match the button's font size at each size token.
// the svg width/height should equal the computed font-size of the button text.
export function IconFontSizing() {
  return (
    <YStack gap="$4" padding="$4">
      <Button size="$2" icon={Moon} testID="btn-2">
        Small
      </Button>
      <Button size="$6" icon={Moon} testID="btn-6">
        Large
      </Button>
      {/* direct icon with a token size resolves via the font size scale */}
      <Moon size="$2" testID="icon-2" />
      <Moon size="$8" testID="icon-8" />
    </YStack>
  )
}
