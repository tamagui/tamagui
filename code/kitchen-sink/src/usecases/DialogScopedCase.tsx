import { Button, Dialog, Input, Label, Paragraph, XStack, YStack } from 'tamagui'

export function DialogScopedCase() {
  return (
    <YStack padding="$4" gap="$4">
      <Dialog modal>
        <TestDialogContent name="plain" />
        <Dialog.Trigger asChild>
          <Button data-testid={`plain-trigger`}>Open Plain</Button>
        </Dialog.Trigger>
      </Dialog>

      <Dialog scope="DialogA" modal>
        <TestDialogContent name="a" />

        <Dialog scope="DialogB" modal>
          <TestDialogContent name="b" />

          <Dialog.Trigger asChild scope="DialogA">
            <Button data-testid={`a-trigger`}>Open A</Button>
          </Dialog.Trigger>

          <Dialog.Trigger asChild scope="DialogB">
            <Button data-testid={`b-trigger`}>Open B</Button>
          </Dialog.Trigger>
        </Dialog>
      </Dialog>
    </YStack>
  )
}

const TestDialogContent = ({ name }) => {
  return (
    <Dialog.Portal>
      <Dialog.Overlay
        key="overlay"
        animation="quick"
        opacity={0.5}
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />

      <Dialog.Content
        bordered
        elevate
        key="content"
        animation={[
          'quick',
          {
            opacity: {
              overshootClamping: true,
            },
          },
        ]}
        enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
        exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
        width={400}
        height={300}
        padding="$6"
        gap="$4"
        data-testid={`${name}-dialog-content`}
      >
        <YStack gap="$4">
          <Dialog.Title>Dialog {name}</Dialog.Title>
          <Dialog.Description>
            This is a test dialog for scoped behavior - {name}
          </Dialog.Description>

          <YStack gap="$3">
            <Label htmlFor={`name-${name}`}>Name</Label>
            <Input id={`name-${name}`} placeholder="Enter name" />
          </YStack>

          <XStack gap="$3" justifyContent="flex-end">
            <Dialog.Close asChild>
              <Button variant="outlined" data-testid={`dialog-close`}>
                Cancel
              </Button>
            </Dialog.Close>
            <Button data-testid={`dialog-save`}>Save</Button>
          </XStack>
        </YStack>
      </Dialog.Content>
    </Dialog.Portal>
  )
}
