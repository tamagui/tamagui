import { Button, Popover, View } from 'tamagui'

// a popover's first open must animate its enterStyle like every later open
export function PopoverFirstOpenEnterCase() {
  return (
    <View padding="8">
      <Popover>
        <Popover.Trigger asChild>
          <Button testID="first-open-trigger">open</Button>
        </Popover.Trigger>
        <Popover.Content
          testID="first-open-content"
          transition="300ms"
          opacity="enter:0 exit:0"
        >
          <View width={200} height={100} backgroundColor="red" />
        </Popover.Content>
      </Popover>
    </View>
  )
}
