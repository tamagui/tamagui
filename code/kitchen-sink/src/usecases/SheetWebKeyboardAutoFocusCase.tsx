import { useEffect, useRef, useState } from 'react'
import type { TextInput } from 'react-native'
import { useWindowDimensions } from 'react-native'
import { Button, Input, Sheet, Text, TextArea, XStack, YStack } from 'tamagui'

/**
 * Fixture for the mobile-web Sheet + soft-keyboard AUTOFOCUS bug.
 *
 * Mirrors SheetWebKeyboardCase (a fit-mode modal sheet with moveOnKeyboardChange
 * whose ScrollView is capped off window dimensions), but the title input
 * AUTOFOCUSES as the sheet animates in — exactly like the 3pc create-thread
 * sheet. The soft keyboard therefore rises SIMULTANEOUSLY with the open
 * animation, so the sheet never gets a keyboard-free layout pass to capture its
 * pre-keyboard frame baseline (handleAnimationViewLayout skips while the kb is
 * up). Without the fix the anchor freeze never engages: the frame collapses /
 * stays occluded and the "Post Thread" button hides under the keyboard.
 *
 * Used by SheetWebKeyboardAutoFocus.test.tsx. `?open=1` starts open.
 */
export function SheetWebKeyboardAutoFocusCase() {
  const params =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams()
  const [open, setOpen] = useState(params.get('open') === '1')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const dimensions = useWindowDimensions()
  const maxHeight = Math.round(dimensions.height * 0.7)
  const titleRef = useRef<TextInput>(null)

  // autofocus the first input as the sheet opens — the keyboard rises with the
  // open animation. mirrors the 3pc create-thread sheet's autoFocus.
  useEffect(() => {
    if (!open) return
    const id = setTimeout(() => titleRef.current?.focus?.(), 0)
    return () => clearTimeout(id)
  }, [open])

  return (
    <YStack padding="$4" gap="$4" testID="sheet-web-kb-af-screen">
      <Text fontSize="$5" fontWeight="bold">
        Sheet + Web Keyboard (autofocus on open)
      </Text>

      <Button testID="sheet-web-kb-af-open" theme="blue" onPress={() => setOpen(true)}>
        Open Sheet
      </Button>

      <Sheet
        modal
        open={open}
        onOpenChange={setOpen}
        snapPointsMode="fit"
        dismissOnSnapToBottom
        moveOnKeyboardChange
        zIndex={100000}
        transition="medium"
      >
        <Sheet.Overlay
          transition="lazy"
          bg="$color"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Frame testID="sheet-web-kb-af-frame" rounded="$6">
          <Sheet.ScrollView
            testID="sheet-web-kb-af-scrollview"
            maxHeight={maxHeight}
            keyboardShouldPersistTaps="handled"
          >
            <YStack gap="$4" padding="$4">
              <Text fontSize="$6" fontWeight="bold">
                New Thread
              </Text>

              <Input
                ref={titleRef}
                testID="sheet-web-kb-af-title"
                placeholder="Title (autofocused on open)"
                value={title}
                onChangeText={setTitle}
              />

              <TextArea
                testID="sheet-web-kb-af-body"
                placeholder="Body"
                value={body}
                onChangeText={setBody}
                minHeight={120}
              />

              {/* spacer content to make the sheet tall */}
              <YStack
                height={220}
                bg="$backgroundHover"
                rounded="$4"
                items="center"
                justify="center"
              >
                <Text color="$gray11">filler content</Text>
              </YStack>

              <XStack gap="$3" justify="flex-end">
                <Button testID="sheet-web-kb-af-cancel" onPress={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button testID="sheet-web-kb-af-post" theme="green">
                  Post Thread
                </Button>
              </XStack>
            </YStack>
          </Sheet.ScrollView>
        </Sheet.Frame>
      </Sheet>
    </YStack>
  )
}
