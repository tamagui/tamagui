import { useEffect, useRef, useState } from 'react'
import { Adapt, Button, Dialog, Paragraph, Sheet, XStack, YStack } from 'tamagui'

let contentInstanceId = 0

function AdaptedDialogContent({
  revision,
  setOpen,
  setAdapted,
  setRevision,
}: {
  revision: number
  setOpen: (open: boolean) => void
  setAdapted: (adapted: boolean) => void
  setRevision: (fn: (value: number) => number) => void
}) {
  const instance = useRef(++contentInstanceId).current

  return (
    <YStack testID="dialog-adapt-content" gap="$3">
      <Dialog.Title testID="dialog-adapt-title">Adapt handoff dialog</Dialog.Title>
      <Dialog.Description testID="dialog-adapt-description">
        Dialog content rendered through Adapt.Contents.
      </Dialog.Description>
      <Paragraph testID="dialog-adapt-revision">revision: {revision}</Paragraph>
      <Paragraph testID="dialog-adapt-instance">instance: {instance}</Paragraph>

      <XStack gap="$2" flexWrap="wrap">
        <Button testID="dialog-adapt-update" onPress={() => setRevision((x) => x + 1)}>
          Update
        </Button>
        <Button testID="dialog-adapt-close" onPress={() => setOpen(false)}>
          Close
        </Button>
        <Button
          testID="dialog-adapt-close-during-flip"
          onPress={() => {
            setAdapted(false)
            setTimeout(() => setOpen(false), 80)
          }}
        >
          Close during flip
        </Button>
        <Button
          testID="dialog-adapt-reopen-during-exit"
          onPress={() => {
            setOpen(false)
            setTimeout(() => setOpen(true), 80)
          }}
        >
          Reopen during exit
        </Button>
      </XStack>
    </YStack>
  )
}

export function DialogSheetAdaptHandoffCase() {
  const [open, setOpen] = useState(false)
  const [adapted, setAdapted] = useState(true)
  const [revision, setRevision] = useState(0)

  useEffect(() => {
    ;(globalThis as any).__dialogAdaptHandoff = {
      setOpen,
      setAdapted,
      setRevision,
    }

    return () => {
      delete (globalThis as any).__dialogAdaptHandoff
    }
  }, [])

  return (
    <YStack p="$4" gap="$4" items="center">
      <XStack gap="$2" flexWrap="wrap" justify="center">
        <Button testID="dialog-adapt-open" onPress={() => setOpen(true)}>
          Open
        </Button>
        <Button testID="dialog-adapt-toggle" onPress={() => setAdapted((x) => !x)}>
          Toggle adapt
        </Button>
        <Button
          testID="dialog-adapt-update-external"
          onPress={() => setRevision((x) => x + 1)}
        >
          Update
        </Button>
      </XStack>

      <Paragraph testID="dialog-adapt-state">
        open: {String(open)}; adapted: {String(adapted)}; revision: {revision}
      </Paragraph>

      <Dialog modal open={open} onOpenChange={setOpen}>
        <Adapt when={adapted}>
          <Sheet
            transition="medium"
            zIndex={250_000}
            modal
            snapPointsMode="fit"
            dismissOnSnapToBottom
            unmountChildrenWhenHidden
            onAnimationComplete={(info) => {
              // expose sheet animation completion so tests can wait for the
              // enter spring to settle before interrupting it (deterministic
              // signal instead of timing assumptions)
              const events = ((globalThis as any).__dialogAdaptSheetAnim ||= [])
              events.push({ open: info.open, t: performance.now() })
            }}
          >
            <Sheet.Overlay
              testID="dialog-adapt-sheet-overlay"
              bg="$shadow6"
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
            />
            <Sheet.Container testID="dialog-adapt-sheet-frame" p="$4" gap="$4">
              <Sheet.Background
                borderTopLeftRadius="$6"
                borderTopRightRadius="$6"
                bg="$background"
              />
              <YStack testID="dialog-adapt-target">
                <Adapt.Contents />
              </YStack>
            </Sheet.Container>
          </Sheet>
        </Adapt>

        <Dialog.Portal>
          <Dialog.Overlay
            key="overlay"
            testID="dialog-adapt-dialog-overlay"
            bg="$shadow6"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
          <Dialog.Content
            key="content"
            testID="dialog-adapt-dialog-content"
            width="90%"
            maxWidth={520}
            p="$4"
            gap="$3"
            bordered
            elevate
            enterStyle={{ y: -8, opacity: 0, scale: 0.98 }}
            exitStyle={{ y: 8, opacity: 0, scale: 0.98 }}
          >
            <AdaptedDialogContent
              revision={revision}
              setOpen={setOpen}
              setAdapted={setAdapted}
              setRevision={setRevision}
            />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </YStack>
  )
}
