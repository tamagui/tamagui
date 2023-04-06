import { Input, Label, Switch, XStack, YStack } from 'tamagui'

export function LabelDemo() {
  return (
    <YStack padding="$3" minWidth={300} space="$4">
      <XStack alignItems="center" space="$4">
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
