import { useEffect, useRef, useState } from 'react'
import type { TextInput } from 'react-native'
import { useWindowDimensions } from 'react-native'
import { Button, Input, Sheet, Text, TextArea, XStack, YStack } from 'tamagui'
import { reportSheetLayout, startSheetTracker } from './sheetFrameTracker'

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
 * Used by SheetWebKeyboardAutoFocus.test.tsx. `?open=1` starts open; `?track=1`
 * enables the disk-persisted frame+gesture telemetry (see sheetFrameTracker.ts).
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
  const bodyRef = useRef<TextInput>(null)
  const track = params.get('track') === '1'
  // which field autofocuses on open. default 'title' (top of the sheet, already
  // above the keyboard). 'body' autofocuses a field that STARTS BEHIND the
  // keyboard, which is the real-world case (3pc's autofocused field isn't at the
  // very top) and the one that exercises the auto-scroll-into-view on open.
  const focusTarget = params.get('focus') === 'body' ? 'body' : 'title'
  // optional focus-bait input on the underlying page (?bait=1). lets a driver
  // raise the soft keyboard BEFORE opening the sheet, so the sheet's very first
  // layout happens with the keyboard already up — the deterministic encoding of
  // the autofocus seed race on a real device/sim (where synthetic open taps
  // otherwise always land in the keyboard-rises-after-layout good path).
  const bait = params.get('bait') === '1'

  useEffect(() => {
    if (track) startSheetTracker()
  }, [track])

  // autofocus an input as the sheet opens — the keyboard rises with the open
  // animation. mirrors the 3pc create-thread sheet's autoFocus. focus
  // synchronously (no setTimeout) so focusin fires during the open render,
  // before the frame's first keyboard-free layout can land.
  useEffect(() => {
    if (!open) return
    const ref = focusTarget === 'body' ? bodyRef : titleRef
    ref.current?.focus?.()
  }, [open, focusTarget])

  return (
    <YStack padding="$4" gap="$4" testID="sheet-web-kb-af-screen">
      <Text fontSize="$5" fontWeight="bold">
        Sheet + Web Keyboard (autofocus on open)
      </Text>

      {bait ? (
        <Input
          testID="sheet-web-kb-af-bait"
          placeholder="focus me first (raises keyboard)"
        />
      ) : null}

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
        <Sheet.Container
          testID="sheet-web-kb-af-frame"
          rounded="$6"
          onLayout={track ? (e) => reportSheetLayout('frame', e) : undefined}
        >
          <Sheet.Background />
          <Sheet.ScrollView
            testID="sheet-web-kb-af-scrollview"
            maxHeight={maxHeight}
            keyboardShouldPersistTaps="handled"
            onLayout={track ? (e) => reportSheetLayout('scroll', e) : undefined}
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
                ref={bodyRef}
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
        </Sheet.Container>
      </Sheet>
    </YStack>
  )
}
