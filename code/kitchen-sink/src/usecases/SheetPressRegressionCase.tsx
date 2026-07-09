import { useState } from 'react'
import { getGestureHandler } from '@tamagui/native'
import { getGestureHandlerConfig } from '@tamagui/native/setup-gesture-handler'
import { Button, Input, Sheet, Text, View, XStack, YStack } from 'tamagui'

/**
 * regression repro for 2ce98f604a (rngh press tap maxDistance).
 *
 * mirrors the 3pc create-thread sheet: a snapPointsMode="fit" modal sheet with
 * a Sheet.ScrollView body and a footer rendered inside the Frame but outside
 * the ScrollView. after the canary bump, real-handler pressables in the sheet
 * stopped firing onPress on Android once the touch travelled even slightly -
 * the tap's maxDistance(10) measured view-relative coords, so a sheet sliding
 * on keyboard open/close registered as finger movement and ate the press.
 *
 * every pressable here has a real onPress, so on Android new arch each gets
 * gh.createPressGesture() wrapped in a GestureDetector - the regressed path.
 */
export function SheetPressRegressionCase() {
  const [open, setOpen] = useState(false)
  const [caption, setCaption] = useState('')
  const pressRnghEnabled = getGestureHandler().isEnabled
  const sheetRnghEnabled = getGestureHandlerConfig().sheet !== false

  const [postCount, setPostCount] = useState(0)
  const [cancelCount, setCancelCount] = useState(0)
  const [scrollBtnCount, setScrollBtnCount] = useState(0)
  const [nestedViewCount, setNestedViewCount] = useState(0)
  const [mediaCardCount, setMediaCardCount] = useState(0)

  const reset = () => {
    setPostCount(0)
    setCancelCount(0)
    setScrollBtnCount(0)
    setNestedViewCount(0)
    setMediaCardCount(0)
  }

  return (
    <YStack padding="$4" gap="$3" testID="sheet-press-screen">
      <Text fontSize="$5" fontWeight="bold">
        Sheet Press Regression
      </Text>
      <XStack gap="$3">
        <Text testID="sheet-press-press-rngh-status">
          pressRNGH: {pressRnghEnabled ? 'on' : 'off'}
        </Text>
        <Text testID="sheet-press-sheet-rngh-status">
          sheetRNGH: {sheetRnghEnabled ? 'on' : 'off'}
        </Text>
      </XStack>

      <Button
        testID="sheet-press-trigger"
        theme="green"
        onPress={() => {
          reset()
          setOpen(true)
        }}
      >
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
          testID="sheet-press-overlay"
          transition="lazy"
          bg="$color"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />

        <Sheet.Container testID="sheet-press-frame">
          <Sheet.Background bg="$background" />

          <Sheet.ScrollView
            testID="sheet-press-scrollview"
            maxHeight={520}
            keyboardShouldPersistTaps="handled"
          >
            <YStack gap="$3" padding="$4">
              <Text fontSize="$5" fontWeight="bold">
                New Thread
              </Text>

              <Input
                testID="sheet-press-input"
                placeholder="What's on your mind?"
                value={caption}
                onChangeText={setCaption}
              />

              {/* plain Tamagui button with a real onPress inside the scrollview */}
              <Button
                testID="sheet-press-scroll-button"
                theme="blue"
                onPress={() => setScrollBtnCount((c) => c + 1)}
              >
                Scroll Button
              </Button>

              {/* poll "add option" pattern: a View with onPress + pressStyle */}
              <View
                testID="sheet-press-nested-view"
                alignSelf="flex-start"
                flexDirection="row"
                alignItems="center"
                gap="$2"
                paddingVertical="$2"
                paddingHorizontal="$3"
                borderRadius="$3"
                borderWidth={1}
                borderColor="$borderColor"
                pressStyle={{ opacity: 0.6, backgroundColor: '$color5' }}
                hitSlop={10}
                onPress={() => setNestedViewCount((c) => c + 1)}
              >
                <Text color="$blue10" fontWeight="600">
                  + Add option (count: {nestedViewCount})
                </Text>
              </View>

              {/* ThreadMediaPicker pattern: a pressable card */}
              <View
                testID="sheet-press-media-card"
                padding="$4"
                borderRadius="$4"
                borderWidth={2}
                borderColor="$borderColor"
                borderStyle="dashed"
                pressStyle={{ backgroundColor: '$color5' }}
                onPress={() => setMediaCardCount((c) => c + 1)}
              >
                <Text>Add Image (count: {mediaCardCount})</Text>
              </View>

              <Button
                testID="sheet-press-close"
                theme="gray"
                onPress={() => setOpen(false)}
              >
                Close
              </Button>
            </YStack>
          </Sheet.ScrollView>

          {/* footer: inside the Frame, outside the ScrollView - like 3pc */}
          <YStack
            borderTopWidth={1}
            borderColor="$borderColor"
            bg="$color1"
            padding="$3"
            paddingBottom="$8"
          >
            <XStack justifyContent="flex-end" gap="$3">
              <Button
                testID="sheet-press-footer-cancel"
                variant="outlined"
                onPress={() => setCancelCount((c) => c + 1)}
              >
                Cancel
              </Button>
              <Button
                testID="sheet-press-footer-post"
                theme="green"
                onPress={() => setPostCount((c) => c + 1)}
              >
                Post
              </Button>
            </XStack>
          </YStack>
        </Sheet.Container>
      </Sheet>

      {/* counters mirrored outside the sheet so they're readable after close */}
      <YStack gap="$1" padding="$3" bg="$color2" borderRadius="$2">
        <Text testID="sheet-press-post-count">post: {postCount}</Text>
        <Text testID="sheet-press-cancel-count">cancel: {cancelCount}</Text>
        <Text testID="sheet-press-scroll-button-count">
          scrollButton: {scrollBtnCount}
        </Text>
        <Text testID="sheet-press-nested-view-count">nestedView: {nestedViewCount}</Text>
        <Text testID="sheet-press-media-card-count">mediaCard: {mediaCardCount}</Text>
      </YStack>
    </YStack>
  )
}
