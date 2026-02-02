import { useState } from 'react'
import {
  Adapt,
  Button,
  Dialog,
  Input,
  Paragraph,
  Sheet,
  styled,
  XStack,
  YStack,
} from 'tamagui'

const CONTENT_RADIUS = '$6' as const

/**
 * Test case for Dialog with onPress on Overlay - Android crash reproduction
 *
 * BUG: Adding `onPress` to `Dialog.Overlay` crashes on Android only (iOS works fine)
 *
 * Error: "Cannot read property '_internalInstanceHandle' of null"
 * Location: ReactFabricPublicInstance.js:145, createComponent.native.js:109
 *
 * Root cause:
 * - On Android with Fabric, when onPress is added to Dialog.Overlay inside Dialog.Portal
 * - The gesture handler setup tries to access the native view's internal handle
 * - During AnimatePresence mount/unmount, publicInstance._internalInstanceHandle is null
 * - iOS handles this timing differently and doesn't crash
 *
 * To reproduce the crash, add onPress to Dialog.Overlay:
 * ```
 * <Dialog.Overlay onPress={() => onOpenChange(false)} />
 * ```
 */
export function DialogSheetAdaptCase() {
  const [dialogState, setDialogState] = useState<{ open: boolean } | null>(null)

  return (
    <YStack padding="$4" gap="$4" items="center">
      <Button testID="open-dialog" onPress={() => setDialogState({ open: true })}>
        Open Dialog (Adapt to Sheet)
      </Button>

      {/* Always-mounted dialog pattern matching takeout3 */}
      <TakeoutStyleDialog
        open={!!dialogState?.open}
        onOpenChange={(open) => {
          if (!open) {
            setDialogState(null)
          }
        }}
      />
    </YStack>
  )
}

/**
 * This component matches the takeout3 Dialog pattern exactly
 * Key characteristics:
 * - Always mounted at layout level
 * - Controlled via external state (starts closed)
 * - Uses Dialog.Adapt with Sheet for mobile/touch
 * - Sheet uses moveOnKeyboardChange which requires gesture handler
 */
function TakeoutStyleDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog modal open={open} onOpenChange={onOpenChange}>
      {/* Simplified to match DialogDemo exactly */}
      <Adapt platform="touch" when="maxMd">
        <Sheet
          transition="medium"
          zIndex={200000}
          modal
          dismissOnSnapToBottom
          unmountChildrenWhenHidden
        >
          <Sheet.Frame p="$4" gap="$4">
            <Adapt.Contents />
          </Sheet.Frame>
          <Sheet.Overlay
            bg="$background"
            opacity={0.5}
            transition="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Sheet>
      </Adapt>

      <Dialog.Portal z={500_000}>
        <DialogOverlay
          key="overlay"
          bg="$shadow6"
          transition="quick"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
          onPress={() => {
            console.log('Overlay pressed')
          }}
        />

        <Dialog.FocusScope focusOnIdle>
          <DialogContent key="content" rounded={CONTENT_RADIUS} overflow="hidden" p="$3">
            <YStack pointerEvents="box-none" gap="$2">
              <Dialog.Title fontFamily="$mono" size="$5" text="center">
                Dialog with Sheet Adapt
              </Dialog.Title>
              <Dialog.Description size="$4" color="$color10">
                On mobile/touch, this adapts to a Sheet with gesture handling.
              </Dialog.Description>
            </YStack>

            <Input placeholder="Enter your name" />

            <YStack gap="$3">
              <Paragraph>
                This tests the gesture handler integration when Sheet renders inside
                AnimatePresence via Dialog.Adapt.
              </Paragraph>
            </YStack>

            <XStack justify="flex-end" gap="$3">
              <Dialog.Close asChild displayWhenAdapted>
                <Button testID="close-dialog" theme="accent">
                  Close
                </Button>
              </Dialog.Close>
            </XStack>
          </DialogContent>
        </Dialog.FocusScope>
      </Dialog.Portal>
    </Dialog>
  )
}

const DialogOverlay = styled(Dialog.Overlay, {
  transition: '200ms',
  opacity: 1,
  backdropFilter: 'blur(3px)',
  enterStyle: { opacity: 0 },
  exitStyle: { opacity: 0 },
})

const DialogContent = styled(Dialog.Content, {
  unstyled: true,
  z: 1000000,
  transition: '200ms',
  bg: 'transparent',
  borderWidth: 0.5,
  rounded: CONTENT_RADIUS,
  borderColor: '$color3',
  position: 'relative',
  backdropFilter: 'blur(25px)',
  shadowColor: '$shadow3',
  shadowRadius: 20,
  shadowOffset: { height: 20, width: 0 },
  maxH: '90vh',
  width: '60%',
  minW: 200,
  maxW: 500,
  p: '$4',
  opacity: 1,
  y: 0,
  enterStyle: { x: 0, y: -5, opacity: 0, scale: 0.985 },
  exitStyle: { x: 0, y: 5, opacity: 0 },

  focusStyle: {
    outlineWidth: 2,
    outlineColor: '$background02',
    outlineStyle: 'solid',
  },
})
