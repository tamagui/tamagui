import { Moon } from '@tamagui/lucide-icons-2'
import { YStack } from 'tamagui'
import { Button } from '../components/Button'

// The copied skin owns independent named text and icon projections.
export function IconFontSizing() {
  return (
    <YStack gap="$4" padding="$4">
      <Button size="small" icon={Moon} testID="btn-2">
        Small
      </Button>
      <Button size="large" icon={Moon} testID="btn-6">
        Large
      </Button>
      {/* direct icon with a token size resolves via the font size scale */}
      <Moon size="$2" testID="icon-2" />
      <Moon size="$8" testID="icon-8" />
    </YStack>
  )
}
