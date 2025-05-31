import { useState } from 'react'
import { Adapt, Button, Dialog, ScrollView, Sheet, SizableText, YStack } from '@tamagui/ui'

export default function TestAdaptDialogToSheet() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Dialog modal open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <Button
            size="$6"
            onPress={() => {
              setOpen(true)
            }}
          >
            Open Sheet
          </Button>
        </Dialog.Trigger>

        <Adapt when="maxMd">
          <Sheet
            snapPointsMode="fit"
            modal
            zIndex={100_000}
            animation="quick"
            open={open}
            onOpenChange={setOpen}
            dismissOnSnapToBottom
          >
            <Sheet.Handle
              position="relative"
              margin="auto"
              top={20}
              width={40}
              height={4}
            />
            <Sheet.Overlay opacity={0.5} />
            <Sheet.Frame>
              <YStack>
                <Adapt.Contents />
              </YStack>
            </Sheet.Frame>
          </Sheet>
        </Adapt>

        <Dialog.Portal>
          <Dialog.Overlay
            key="overlay"
            animation="quick"
            opacity={0.9}
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />

          <Dialog.Content
            key="content"
            p={0}
            m="$0"
            width="100%"
            height="100%"
            items="center"
            rounded={0}
            animateOnly={['transform', 'opacity']}
            animation="quick"
            enterStyle={{ x: '100%' }}
            exitStyle={{ x: '100%' }}
          >
            <ScrollView width="100%">
              <YStack items="center" justify="center">
                <YStack gap={12}>
                  <SizableText>
                    This should be in a Sheet on SM screens but its not
                  </SizableText>
                  <Button
                    pointerEvents="auto"
                    onPress={() => {
                      setOpen(false)
                    }}
                  >
                    <Button.Text>Close</Button.Text>
                  </Button>
                </YStack>
              </YStack>
            </ScrollView>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </>
  )
}
