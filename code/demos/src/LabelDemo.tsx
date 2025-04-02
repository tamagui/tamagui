import { Input, Label, Switch, XStack, YStack } from 'tamagui'

export function LabelDemo() {
  return (
    <YStack $maxMd={{ width: '100%' }} minWidth={300} gap="$4">
      <XStack alignItems="center" gap="$4">
        <Label width={90} htmlFor="name">
          Name
        </Label>
        <Input flex={1} id="name" defaultValue="Nate Wienert" />
      </XStack>

      <XStack alignItems="center" space="$4">
        <Label width={90} htmlFor="notify">
          Notifications
        </Label>
        <Switch id="notify">
          <Switch.Thumb animation="quick" />
        </Switch>
      </XStack>
    </YStack>
  )
}
