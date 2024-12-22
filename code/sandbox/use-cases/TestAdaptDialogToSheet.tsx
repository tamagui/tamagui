import {
  Adapt,
  Button,
  Dialog,
  ScrollView,
  Separator,
  Sheet,
  SizableText,
  YStack,
} from 'tamagui'
import { useState } from 'react'

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

        <Adapt when="sm">
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
              backgroundColor="$colorSubtle"
            />
            <Sheet.Overlay opacity={0.5} />
            <Sheet.Frame p="$1" pb={24} jc="flex-start" ai="center">
              <Separator w={40} mt="$5" mb="$2" bw="$0.5" br={9} />

              <YStack px="$4" pb="$4" w="100%">
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
            bg="$gray1"
            key="content"
            p={0}
            m="$0"
            w="100%"
            h="100%"
            alignItems="center"
            br={0}
            animateOnly={['transform', 'opacity']}
            animation="quick"
            enterStyle={{ x: '100%' }}
            exitStyle={{ x: '100%' }}
          >
            <ScrollView w="100%">
              <YStack alignItems="center" justifyContent="center">
                <YStack gap={12}>
                  <SizableText>
                    This should be in a Sheet on SM screens but its not
                  </SizableText>
                  <Button
                    pe="auto"
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
