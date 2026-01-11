import { Adapt, Button, Dialog, Input, Label, Sheet, XStack, YStack } from 'tamagui'

export function DialogScopedCase() {
  const shouldAdapt = window.location.search.includes('adapt=true')

  return (
    <YStack padding="$4" gap="$4">
      <Dialog modal>
        <TestDialogContent name="plain" shouldAdapt={shouldAdapt} />
        <Dialog.Trigger asChild>
          <Button data-testid={`plain-trigger`}>Open Plain</Button>
        </Dialog.Trigger>
      </Dialog>

      <Dialog scope="DialogA" modal>
        <TestDialogContent name="a" shouldAdapt={shouldAdapt} />

        <Dialog scope="DialogB" modal>
          <TestDialogContent name="b" shouldAdapt={shouldAdapt} />

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

const TestDialogContent = ({ name, shouldAdapt }) => {
  return (
    <>
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          transition="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />

        <Dialog.Content
          bordered
          elevate
          key="content"
          transition={[
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
        >
          <YStack data-testid={`${name}-dialog-content`} gap="$4">
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
                <Button variant="outlined" data-testid={`${name}-dialog-close`}>
                  Cancel
                </Button>
              </Dialog.Close>
              <Button data-testid={`dialog-save`}>Save</Button>
            </XStack>
          </YStack>
        </Dialog.Content>
      </Dialog.Portal>

      {shouldAdapt && (
        <Adapt when={true}>
          <Sheet transition="medium" modal dismissOnSnapToBottom>
            <Sheet.Frame data-testid={`${name}-sheet-contents`} padding="$4">
              <Adapt.Contents />
            </Sheet.Frame>
            <Sheet.Overlay
              id={`${name}-sheet-overlay`}
              backgroundColor="$shadowColor"
              transition="lazy"
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
            />
          </Sheet>
        </Adapt>
      )}
    </>
  )
}
