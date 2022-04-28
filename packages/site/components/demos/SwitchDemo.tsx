import { Switch, YStack } from 'tamagui'

export default function SwitchDemo() {
  return (
    <YStack p="$3" space="$2">
      <Switch>
        <Switch.Thumb />
      </Switch>
    </YStack>
  )
}
