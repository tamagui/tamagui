import { Button, Dialog, Popover, YStack } from 'tamagui'

export function StackZIndex() {
  return (
    <>
      {/* hardcoded */}
      <Popover open size="$5" allowFlip>
        <Popover.Trigger asChild>
          <Button>toggle</Button>
        </Popover.Trigger>

        <Popover.Content zIndex={200_000} id="hardcoded-popover" bg="pink">
          <Popover.Arrow borderWidth={1} borderColor="$borderColor" />

          <YStack gap="$3"></YStack>
        </Popover.Content>
      </Popover>

      <Dialog modal open>
        <Dialog.Portal zIndex={300_000}>
          <Dialog.Content id="hardcoded-dialog" w={200} h={200} bg="black">
            <Dialog.Title>hi</Dialog.Title>
            <Dialog.Description>ok</Dialog.Description>

            <Popover open size="$5" allowFlip>
              <Popover.Trigger asChild>
                <Button>toggle</Button>
              </Popover.Trigger>

              <Popover.Content
                id="above-hardcoded-dialog"
                bg="orange"
                width={100}
                height={100}
              >
                <Popover.Arrow borderWidth={1} borderColor="$borderColor" />
              </Popover.Content>
            </Popover>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>

      {/* stacked */}
      <Popover open size="$5" allowFlip>
        <Popover.Trigger asChild>
          <Button>toggle</Button>
        </Popover.Trigger>

        <Popover.Content
          id="bottom-popover"
          borderWidth={1}
          bg="red"
          width={500}
          height={500}
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

              <Popover.Content id="top-popover" bg="green" width={500} height={500}>
                <Popover.Arrow borderWidth={1} borderColor="$borderColor" />
              </Popover.Content>
            </Popover>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </>
  )
}
