import { Moon } from '@tamagui/lucide-icons'
import { Button, ListItem, Theme, YStack } from 'tamagui'

export function ButtonIconColor() {
  return (
    <YStack gap="$4" padding="$4">
      {/* button icon should get theme color */}
      <Theme name="red">
        <Button testID="button-themed" icon={Moon} />
      </Theme>

      {/* listitem icon should get theme color */}
      <Theme name="red">
        <ListItem testID="listitem-themed" icon={Moon} />
      </Theme>
    </YStack>
  )
}
