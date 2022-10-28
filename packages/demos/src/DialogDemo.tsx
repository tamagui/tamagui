import { X } from '@tamagui/lucide-icons'
import React from 'react'
import { Button, Dialog, Fieldset, Input, Label, Unspaced, YStack } from 'tamagui'

import { SelectDemo } from './SelectDemo'

export function DialogDemo() {
  return (
    <Dialog sheetBreakpoint="sm" modal>
      <Dialog.Trigger asChild>
        <Button>Edit Profile</Button>
      </Dialog.Trigger>

      <Dialog.Sheet zIndex={200_000} modal dismissOnSnapToBottom>
        <Dialog.Sheet.Frame padding="$4">
          <Dialog.SheetContents />
        </Dialog.Sheet.Frame>
        <Dialog.Sheet.Overlay />
      </Dialog.Sheet>

      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="quick"
          o={0.5}
          enterStyle={{ o: 0 }}
          exitStyle={{ o: 0 }}
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
          x={0}
          scale={1}
          opacity={1}
          y={0}
        >
          <YStack space>
            <Dialog.Title>Edit profile</Dialog.Title>
            <Dialog.Description>
              Make changes to your profile here. Click save when you're done.
            </Dialog.Description>
            <Fieldset space="$4" horizontal>
              <Label w={160} justifyContent="flex-end" htmlFor="name">
                Name
              </Label>
              <Input f={1} id="name" defaultValue="Nate Wienert" />
            </Fieldset>
            <Fieldset space="$4" horizontal>
              <Label w={160} justifyContent="flex-end" htmlFor="username">
                Food
              </Label>
              <SelectDemo />
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
                <Button pos="absolute" t="$-2" r="$-2" size="$3" circular icon={X} />
              </Dialog.Close>
            </Unspaced>
          </YStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}
