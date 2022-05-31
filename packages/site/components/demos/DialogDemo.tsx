import { X } from '@tamagui/feather-icons'
import { Button, Dialog, Fieldset, Input, Label, Unspaced, YStack } from 'tamagui'

export default function DialogDemo() {
  return (
    <Dialog modal>
      <Dialog.Trigger asChild>
        <Button>Edit Profile</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay key="overlay" o={0.5} />
        <Dialog.Content
          bordered
          elevate
          key="content"
          space
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
          x={0}
          scale={1}
          opacity={1}
          y={0}
        >
          <Dialog.Title>Edit profile</Dialog.Title>
          <Dialog.Description>
            Make changes to your profile here. Click save when you're done.
          </Dialog.Description>
          <Fieldset horizontal>
            <Label w={160} justifyContent="flex-end" htmlFor="name">
              Name
            </Label>
            <Input f={1} id="name" defaultValue="Nate Wienert" />
          </Fieldset>
          <Fieldset horizontal>
            <Label w={160} justifyContent="flex-end" htmlFor="username">
              Username
            </Label>
            <Input f={1} id="username" defaultValue="@natebirdman" />
          </Fieldset>

          <YStack ai="flex-end" mt="$2">
            <Dialog.Close asChild>
              <Button theme="alt1" aria-label="Close">
                Save changes
              </Button>
            </Dialog.Close>
          </YStack>

          <Unspaced>
            <Dialog.Close asChild>
              <Button pos="absolute" t="$4" r="$4" circular icon={X} />
            </Dialog.Close>
          </Unspaced>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}
