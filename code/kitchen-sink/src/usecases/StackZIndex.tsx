import { Button, Dialog, Popover, YStack } from 'tamagui'

export function StackZIndex() {
  return (
    <>
      <Popover open size="$5" allowFlip>
        <Popover.Trigger asChild>
          <Button>toggle</Button>
        </Popover.Trigger>

        <Popover.Content
          id="bottom-popover"
          borderWidth={1}
          bg="red"
          borderColor="$borderColor"
          enterStyle={{ y: -10, opacity: 0 }}
          exitStyle={{ y: -10, opacity: 0 }}
          elevate
          width={500}
          height={500}
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
        >
          <Popover.Arrow borderWidth={1} borderColor="$borderColor" />

          <YStack gap="$3"></YStack>
        </Popover.Content>
      </Popover>

      <Dialog modal open>
        <Dialog.Portal>
          <Dialog.Content id="middle-dialog" w={500} h={500} bg="yellow">
            <Dialog.Title>hi</Dialog.Title>
            <Dialog.Description>ok</Dialog.Description>

            <Popover open size="$5" allowFlip>
              <Popover.Trigger asChild>
                <Button>toggle</Button>
              </Popover.Trigger>

              <Popover.Content
                id="top-popover"
                borderWidth={1}
                bg="green"
                borderColor="$borderColor"
                enterStyle={{ y: -10, opacity: 0 }}
                exitStyle={{ y: -10, opacity: 0 }}
                elevate
                width={500}
                height={500}
                animation={[
                  'quick',
                  {
                    opacity: {
                      overshootClamping: true,
                    },
                  },
                ]}
              >
                <Popover.Arrow borderWidth={1} borderColor="$borderColor" />

                <YStack gap="$3"></YStack>
              </Popover.Content>
            </Popover>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </>
  )
}
