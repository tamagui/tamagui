import { Adapt, Button, H1, Input, Label, Popover, XStack, YStack } from 'tamagui'

export const Sandbox = () => {
  return (
    <H1
      debug="verbose"
      ta="left"
      size="$10"
      maw={500}
      h={130}
      // FOR CLS IMPORTANT TO SET EXACT HEIGHT IDK WHY LINE HEIGHT SHOULD BE STABLE
      $gtSm={{
        color: 'green',
        size: '$11',
      }}
      $gtMd={{
        color: 'red',
        size: '$12',
      }}
      $gtLg={{
        color: 'yellow',
        size: '$13',
      }}
    >
      hello world
    </H1>
  )

  return (
    <YStack space="$4" flex={1} justifyContent="center" alignItems="center">
      <Popover size="$5" allowFlip>
        <Popover.Trigger asChild>
          <Button>
            <Button.Text>Open Popover</Button.Text>
          </Button>
        </Popover.Trigger>

        <Adapt when="sm" platform="touch">
          <Popover.Sheet modal dismissOnSnapToBottom snapPoints={[40]}>
            <Popover.Sheet.Overlay />
            <Popover.Sheet.Handle />
            <Popover.Sheet.Frame padding="$4">
              <Adapt.Contents />
            </Popover.Sheet.Frame>
            <Popover.Sheet.Overlay />
          </Popover.Sheet>
        </Adapt>

        <Popover.Content
          borderWidth={1}
          borderColor="$borderColor"
          enterStyle={{ x: 0, y: -10, opacity: 0 }}
          exitStyle={{ x: 0, y: -10, opacity: 0 }}
          x={0}
          y={0}
          opacity={1}
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          elevate
        >
          <Popover.Arrow borderWidth={1} borderColor="$borderColor" />

          <YStack space="$3">
            <XStack space="$3">
              <Label size="$3">Name</Label>
              <Input size="$3" />
            </XStack>
            <Popover.Close asChild>
              <Button
                size="$3"
                onPress={() => {
                  /* Custom code goes here, does not interfere with popover closure */
                }}
              >
                Submit
              </Button>
            </Popover.Close>
          </YStack>
        </Popover.Content>
      </Popover>
    </YStack>
  )
}
