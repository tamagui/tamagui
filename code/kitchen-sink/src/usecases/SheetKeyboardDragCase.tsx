import { useState, useCallback, useEffect, useRef } from 'react'
import { Keyboard, Platform } from 'react-native'
import ActionSheet, {
  type ActionSheetRef,
  ScrollView as ActionScrollView,
} from 'react-native-actions-sheet'
import { Button, Input, Sheet, Text, XStack, YStack } from 'tamagui'
import { getGestureHandler, isKeyboardControllerEnabled } from '@tamagui/native'

/**
 * Test case for Sheet + Keyboard + Drag interaction
 *
 * SMOOTH KEYBOARD HANDOFF requirements:
 * 1. Open keyboard (tap input) -> sheet moves up smoothly
 * 2. Drag sheet down while keyboard open -> keyboard dismisses FIRST, then sheet drags
 * 3. Dismiss keyboard (tap outside) -> sheet returns to original position
 * 4. Fast keyboard show/hide shouldn't cause jank
 */
export function SheetKeyboardDragCase() {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState(0)
  const actionsSheetRef = useRef<ActionSheetRef>(null)
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const [keyboardVisible, setKeyboardVisible] = useState(false)
  const [events, setEvents] = useState<string[]>([])
  const [inputValue, setInputValue] = useState('')

  const rnghEnabled = getGestureHandler().isEnabled
  const kbcEnabled = isKeyboardControllerEnabled()

  useEffect(() => {
    console.warn('[SheetKeyboardDrag] RNGH enabled:', rnghEnabled)
    console.warn('[SheetKeyboardDrag] Keyboard Controller enabled:', kbcEnabled)
  }, [rnghEnabled, kbcEnabled])

  // track keyboard events for debugging
  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'

    const showListener = Keyboard.addListener(showEvent, (e) => {
      const height = e.endCoordinates.height
      setKeyboardHeight(height)
      setKeyboardVisible(true)
      addEvent(`kb-show:${height.toFixed(0)}`)
    })

    const hideListener = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0)
      setKeyboardVisible(false)
      addEvent('kb-hide')
    })

    return () => {
      showListener.remove()
      hideListener.remove()
    }
  }, [])

  const addEvent = useCallback((event: string) => {
    setEvents((prev) => [...prev.slice(-6), event])
  }, [])

  return (
    <YStack padding="$4" gap="$4" testID="sheet-keyboard-drag-screen">
      <Text testID="sheet-keyboard-drag-title" fontSize="$5" fontWeight="bold">
        Sheet + Keyboard Drag Test
      </Text>

      <XStack gap="$3">
        <Text
          testID="sheet-keyboard-drag-rngh-status"
          fontSize="$2"
          color={rnghEnabled ? '$green10' : '$red10'}
          fontWeight="bold"
        >
          RNGH: {rnghEnabled ? '✓' : '✗'}
        </Text>
        <Text
          testID="sheet-keyboard-drag-kbc-status"
          fontSize="$2"
          color={kbcEnabled ? '$green10' : '$yellow10'}
          fontWeight="bold"
        >
          KBC: {kbcEnabled ? '✓' : '○'}
        </Text>
      </XStack>

      <Text testID="sheet-keyboard-drag-instructions" fontSize="$3" color="$gray11">
        Test keyboard + sheet interaction: tap input to show keyboard, drag sheet while
        keyboard is open.
      </Text>

      <YStack flexDirection="row" gap="$2">
        <Button
          testID="sheet-keyboard-drag-trigger"
          onPress={() => setOpen(true)}
          flex={1}
        >
          Open Sheet
        </Button>
        <Button
          testID="sheet-keyboard-drag-action-trigger"
          onPress={() => actionsSheetRef.current?.show()}
          theme="blue"
        >
          Open ActionSheet
        </Button>
      </YStack>
      <Button
        testID="sheet-keyboard-drag-reset"
        onPress={() => {
          setEvents([])
          setInputValue('')
        }}
        theme="red"
      >
        Reset
      </Button>

      <YStack gap="$2" padding="$3" bg="$backgroundHover" borderRadius="$2">
        <Text testID="sheet-keyboard-drag-position">Sheet position: {position}</Text>
        <Text testID="sheet-keyboard-drag-kb-height">
          Keyboard height: {keyboardHeight}
        </Text>
        <Text testID="sheet-keyboard-drag-kb-visible">
          Keyboard: {keyboardVisible ? 'visible' : 'hidden'}
        </Text>
        <Text testID="sheet-keyboard-drag-events">
          Events: {events.join(', ') || '(none)'}
        </Text>
      </YStack>

      <YStack gap="$1" padding="$2" bg="$blue3" borderRadius="$2">
        <Text fontSize="$2" fontWeight="bold">
          Expected behavior:
        </Text>
        <Text fontSize="$2">
          1. Tap input → keyboard shows → sheet moves up{'\n'}
          2. Drag sheet down → keyboard dismisses FIRST{'\n'}
          3. Tap outside input → keyboard hides → sheet restores
        </Text>
      </YStack>

      <Sheet
        modal
        open={open}
        onOpenChange={setOpen}
        snapPoints={[80, 50]}
        snapPointsMode="percent"
        position={position}
        onPositionChange={(pos) => {
          setPosition(pos)
          addEvent(`snap:${pos}`)
        }}
        dismissOnSnapToBottom
        moveOnKeyboardChange
        zIndex={100000}
        transition="medium"
      >
        <Sheet.Overlay
          testID="sheet-keyboard-drag-overlay"
          transition="lazy"
          bg="$color"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Handle testID="sheet-keyboard-drag-handle" />
        <Sheet.Frame testID="sheet-keyboard-drag-frame">
          <Sheet.ScrollView
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
          >
            <YStack gap="$4" padding="$4">
              <Text
                testID="sheet-keyboard-drag-sheet-title"
                fontSize="$5"
                fontWeight="bold"
              >
                Keyboard Test Sheet
              </Text>

              <YStack gap="$2" padding="$3" bg="$backgroundHover" borderRadius="$2">
                <Text fontSize="$2">Position: {position}</Text>
                <Text fontSize="$2">KB Height: {keyboardHeight}</Text>
                <Text fontSize="$2">KB Visible: {keyboardVisible ? 'yes' : 'no'}</Text>
              </YStack>

              <YStack gap="$2">
                <Text fontSize="$3" fontWeight="bold">
                  Test Input (tap to show keyboard):
                </Text>
                <Input
                  testID="sheet-keyboard-drag-input"
                  placeholder="Type something..."
                  value={inputValue}
                  onChangeText={setInputValue}
                  onFocus={() => addEvent('input-focus')}
                  onBlur={() => addEvent('input-blur')}
                />
              </YStack>

              <YStack gap="$2">
                <Text fontSize="$3" fontWeight="bold">
                  Second Input:
                </Text>
                <Input
                  testID="sheet-keyboard-drag-input-2"
                  placeholder="Another input..."
                  onFocus={() => addEvent('input2-focus')}
                  onBlur={() => addEvent('input2-blur')}
                />
              </YStack>

              <Button
                testID="sheet-keyboard-drag-dismiss-kb"
                onPress={() => {
                  Keyboard.dismiss()
                  addEvent('manual-kb-dismiss')
                }}
              >
                Dismiss Keyboard
              </Button>

              <Button testID="sheet-keyboard-drag-close" onPress={() => setOpen(false)}>
                Close Sheet
              </Button>

              {/* spacer for testing scroll + keyboard */}
              <YStack
                height={300}
                bg="$gray3"
                borderRadius="$2"
                padding="$4"
                justifyContent="center"
                alignItems="center"
              >
                <Text color="$gray11">Spacer area</Text>
                <Text color="$gray11" fontSize="$2">
                  Drag here to test sheet drag
                </Text>
              </YStack>
            </YStack>
          </Sheet.ScrollView>
        </Sheet.Frame>
      </Sheet>

      {/* ActionSheet for comparison */}
      <ActionSheet
        ref={actionsSheetRef}
        snapPoints={[80, 50]}
        initialSnapIndex={0}
        gestureEnabled
        keyboardHandlerEnabled
        containerStyle={{ maxHeight: '100%', height: '100%' }}
      >
        <ActionScrollView
          style={{ width: '100%', flexShrink: 1 }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        >
          <YStack gap="$4" padding="$4">
            <Text fontSize="$5" fontWeight="bold">
              ActionSheet (Reference)
            </Text>
            <Text fontSize="$3" color="$gray11">
              Compare keyboard + drag behavior
            </Text>

            <YStack gap="$2" padding="$3" bg="$backgroundHover" borderRadius="$2">
              <Text fontSize="$2">KB Height: {keyboardHeight}</Text>
              <Text fontSize="$2">KB Visible: {keyboardVisible ? 'yes' : 'no'}</Text>
            </YStack>

            <YStack gap="$2">
              <Text fontSize="$3" fontWeight="bold">
                Test Input (tap to show keyboard):
              </Text>
              <Input
                placeholder="Type something..."
                onFocus={() => addEvent('as-input-focus')}
                onBlur={() => addEvent('as-input-blur')}
              />
            </YStack>

            <YStack gap="$2">
              <Text fontSize="$3" fontWeight="bold">
                Second Input:
              </Text>
              <Input
                placeholder="Another input..."
                onFocus={() => addEvent('as-input2-focus')}
                onBlur={() => addEvent('as-input2-blur')}
              />
            </YStack>

            <Button
              onPress={() => {
                Keyboard.dismiss()
                addEvent('as-manual-kb-dismiss')
              }}
            >
              Dismiss Keyboard
            </Button>

            <Button onPress={() => actionsSheetRef.current?.hide()}>Close Sheet</Button>

            {/* spacer for testing scroll + keyboard */}
            <YStack
              height={300}
              bg="$gray3"
              borderRadius="$2"
              padding="$4"
              justifyContent="center"
              alignItems="center"
            >
              <Text color="$gray11">Spacer area</Text>
              <Text color="$gray11" fontSize="$2">
                Drag here to test sheet drag
              </Text>
            </YStack>
          </YStack>
        </ActionScrollView>
      </ActionSheet>
    </YStack>
  )
}
