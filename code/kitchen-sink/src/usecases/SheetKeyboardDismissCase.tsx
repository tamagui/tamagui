import { useState, useCallback, useEffect, useRef } from 'react'
import {
  Keyboard,
  Platform,
  View,
  Text as RNText,
  TextInput as RNTextInput,
  StyleSheet,
} from 'react-native'
import ActionSheet, {
  type ActionSheetRef,
  ScrollView as ActionScrollView,
} from 'react-native-actions-sheet'
import { Button, Sheet, SizableText, TextArea, XStack, YStack } from 'tamagui'

/**
 * Side-by-side comparison of Tamagui Sheet vs react-native-actions-sheet
 * for keyboard + drag behavior.
 *
 * Tests:
 * 1. Open sheet with TextInput inside
 * 2. Focus input -> keyboard shows -> sheet pushes up
 * 3. Drag sheet down -> keyboard should dismiss smoothly
 * 4. Sheet should follow drag without snapping back
 */
export function SheetKeyboardDismissCase() {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState(0)
  const [caption, setCaption] = useState('')
  const [keyboardVisible, setKeyboardVisible] = useState(false)
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const [events, setEvents] = useState<string[]>([])

  const actionsSheetRef = useRef<ActionSheetRef>(null)
  const [asCaption, setAsCaption] = useState('')

  const addEvent = useCallback((event: string) => {
    setEvents((prev) => [...prev.slice(-8), event])
  }, [])

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'

    const showSub = Keyboard.addListener(showEvent, (e) => {
      setKeyboardVisible(true)
      setKeyboardHeight(e.endCoordinates.height)
      addEvent(`kb-show:${e.endCoordinates.height.toFixed(0)}`)
    })

    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardVisible(false)
      setKeyboardHeight(0)
      addEvent('kb-hide')
    })

    return () => {
      showSub.remove()
      hideSub.remove()
    }
  }, [addEvent])

  return (
    <YStack padding="$4" gap="$4" testID="sheet-kb-dismiss-screen">
      <SizableText fontSize="$5" fontWeight="bold">
        Sheet Keyboard + Drag Test
      </SizableText>

      <SizableText fontSize="$3" color="$gray11">
        Compare keyboard+drag behavior between Tamagui Sheet and actions-sheet
      </SizableText>

      <YStack gap="$2" padding="$3" bg="$blue3" borderRadius="$2">
        <SizableText fontSize="$2" fontWeight="bold">
          Steps to test:
        </SizableText>
        <SizableText fontSize="$2">
          1. Open each sheet{'\n'}
          2. Tap the TextInput to show keyboard{'\n'}
          3. Verify sheet pushes up with keyboard{'\n'}
          4. Drag the sheet handle DOWN{'\n'}
          5. Compare how keyboard dismisses during drag
        </SizableText>
      </YStack>

      <XStack gap="$3">
        <Button
          flex={1}
          testID="sheet-kb-dismiss-trigger"
          theme="green"
          onPress={() => {
            setPosition(0)
            setOpen(true)
          }}
        >
          Tamagui Sheet
        </Button>

        <Button flex={1} theme="blue" onPress={() => actionsSheetRef.current?.show()}>
          Actions Sheet
        </Button>
      </XStack>

      <YStack gap="$2" padding="$3" bg="$backgroundHover" borderRadius="$2">
        <SizableText testID="sheet-kb-dismiss-position">Position: {position}</SizableText>
        <SizableText testID="sheet-kb-dismiss-kb-visible">
          Keyboard: {keyboardVisible ? `visible (${keyboardHeight})` : 'hidden'}
        </SizableText>
        <SizableText testID="sheet-kb-dismiss-events">
          Events: {events.join(', ') || '(none)'}
        </SizableText>
      </YStack>

      {/* Tamagui Sheet */}
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
        moveOnKeyboardChange={false}
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
        <Sheet.Handle testID="sheet-kb-dismiss-handle" />
        <Sheet.Frame testID="sheet-kb-dismiss-frame">
          <YStack padding="$4" gap="$4">
            <SizableText fontSize="$5" fontWeight="bold">
              Tamagui Sheet
            </SizableText>

            <YStack gap="$3">
              <TextArea
                testID="sheet-kb-dismiss-textarea"
                verticalAlign="top"
                maxLength={6000}
                rows={3}
                size="$4"
                placeholder="What's on your mind?"
                value={caption}
                onChangeText={setCaption}
                rounded="$6"
                enterKeyHint="done"
                submitBehavior="blurAndSubmit"
                onFocus={() => addEvent('textarea-focus')}
                onBlur={() => addEvent('textarea-blur')}
              />

              <YStack
                borderWidth={2}
                borderColor="$borderColor"
                borderStyle="dashed"
                rounded="$6"
                padding="$6"
                items="center"
                justify="center"
                gap="$3"
                bg="$background02"
              >
                <SizableText size="$5" fontWeight="600">
                  Add Image
                </SizableText>
                <SizableText size="$3" color="$color10">
                  Tap to select from library
                </SizableText>
              </YStack>
            </YStack>

            <XStack gap="$3" justifyContent="flex-end">
              <Button
                testID="sheet-kb-dismiss-cancel"
                onPress={() => {
                  Keyboard.dismiss()
                  setOpen(false)
                }}
              >
                Cancel
              </Button>
              <Button
                testID="sheet-kb-dismiss-post"
                theme="blue"
                disabled={!caption.trim()}
                onPress={() => {
                  addEvent('post')
                  Keyboard.dismiss()
                  setOpen(false)
                }}
              >
                Post
              </Button>
            </XStack>

            <YStack gap="$2" padding="$3" bg="$backgroundHover" borderRadius="$2">
              <SizableText fontSize="$2">
                KB: {keyboardVisible ? `visible (${keyboardHeight})` : 'hidden'}
              </SizableText>
              <SizableText fontSize="$2">Position: {position}</SizableText>
              <SizableText fontSize="$2" numberOfLines={2}>
                Events: {events.slice(-4).join(', ')}
              </SizableText>
            </YStack>

            {/* spacer so there's room to drag */}
            <YStack height={200} />
          </YStack>
        </Sheet.Frame>
      </Sheet>

      {/* Actions Sheet (Reference) */}
      <ActionSheet
        ref={actionsSheetRef}
        snapPoints={[50, 85]}
        initialSnapIndex={1}
        gestureEnabled
        keyboardHandlerEnabled
        containerStyle={{
          maxHeight: '100%',
          height: '100%',
        }}
      >
        <View style={styles.sheetContent}>
          <RNText style={styles.sheetTitle}>Actions Sheet (Reference)</RNText>
          <RNText style={styles.sheetSubtitle}>
            Compare keyboard+drag behavior with this reference
          </RNText>

          <ActionScrollView
            style={{ width: '100%', flexShrink: 1 }}
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.inputContainer}>
              <RNText style={styles.inputLabel}>What's on your mind?</RNText>
              <RNTextInput
                style={styles.textInput}
                multiline
                numberOfLines={3}
                placeholder="Type something..."
                value={asCaption}
                onChangeText={setAsCaption}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.imagePlaceholder}>
              <RNText style={styles.imagePlaceholderTitle}>Add Image</RNText>
              <RNText style={styles.imagePlaceholderSubtitle}>
                Tap to select from library
              </RNText>
            </View>

            {Array.from({ length: 10 }).map((_, i) => (
              <View key={i} style={styles.item}>
                <RNText style={styles.itemText}>Item {i + 1}</RNText>
              </View>
            ))}
          </ActionScrollView>
        </View>
      </ActionSheet>
    </YStack>
  )
}

const styles = StyleSheet.create({
  sheetContent: {
    flex: 1,
    padding: 16,
    height: '100%',
  },
  sheetTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sheetSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    backgroundColor: '#f8f8f8',
  },
  imagePlaceholder: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    backgroundColor: '#fafafa',
  },
  imagePlaceholderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  imagePlaceholderSubtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  item: {
    padding: 16,
    backgroundColor: '#e8f4e8',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#c0d8c0',
  },
  itemText: {
    fontSize: 16,
    color: '#2d5a2d',
  },
})
