import { useState, useCallback } from 'react'
import { Keyboard } from 'react-native'
import { Button, Image, Input, Sheet, Text, XStack, YStack } from 'tamagui'

const MOCK_URLS = {
  tall: 'https://picsum.photos/400/600',
  short: 'https://picsum.photos/400/150',
}

/**
 * Test case for Sheet + Keyboard + Dynamic fit content
 *
 * Press a button to load a mock image URL. The image height is
 * taller or shorter than the placeholder, testing whether the
 * sheet adjusts its fit-content height correctly.
 */
export function SheetKeyboardFitContentCase() {
  const [open, setOpen] = useState(false)
  const [events, setEvents] = useState<string[]>([])
  const [caption, setCaption] = useState('')
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const addEvent = useCallback((event: string) => {
    setEvents((prev) => [...prev.slice(-6), event])
  }, [])

  return (
    <YStack padding="$4" gap="$4" testID="sheet-kb-fit-screen">
      <Text fontSize="$5" fontWeight="bold">
        Sheet + Keyboard + Fit Content
      </Text>

      <Text fontSize="$3" color="$gray11">
        Load a mock image URL to change content height while keyboard may be open.
      </Text>

      <Button testID="sheet-kb-fit-trigger" theme="green" onPress={() => setOpen(true)}>
        Open Sheet
      </Button>

      <YStack gap="$2" padding="$3" bg="$backgroundHover" borderRadius="$2">
        <Text>Events: {events.join(', ') || '(none)'}</Text>
      </YStack>

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
        <Sheet.Frame testID="sheet-kb-fit-frame" padding="$4">
          <YStack gap="$4">
            <Text fontSize="$5" fontWeight="bold">
              Create Post
            </Text>

            <Input
              testID="sheet-kb-fit-input"
              placeholder="What's on your mind?"
              value={caption}
              onChangeText={setCaption}
              onFocus={() => addEvent('focus')}
              onBlur={() => addEvent('blur')}
            />

            {/* Image area — always rendered, height changes with URL */}
            {imageUrl ? (
              <Image
                testID="sheet-kb-fit-image"
                source={{ uri: imageUrl }}
                width="100%"
                height={imageUrl === MOCK_URLS.tall ? 300 : 100}
                borderRadius="$4"
                bg="$backgroundHover"
              />
            ) : (
              <YStack
                testID="sheet-kb-fit-placeholder"
                height={150}
                borderWidth={2}
                borderColor="$borderColor"
                borderStyle="dashed"
                borderRadius="$4"
                alignItems="center"
                justifyContent="center"
                bg="$backgroundHover"
              >
                <Text color="$gray11">No image loaded</Text>
              </YStack>
            )}

            <XStack gap="$2">
              <Button
                testID="sheet-kb-fit-load-tall"
                size="$3"
                theme="green"
                flex={1}
                onPress={() => {
                  setImageUrl(MOCK_URLS.tall)
                  addEvent('load-tall')
                }}
              >
                Load Tall (300)
              </Button>
              <Button
                testID="sheet-kb-fit-load-short"
                size="$3"
                theme="blue"
                flex={1}
                onPress={() => {
                  setImageUrl(MOCK_URLS.short)
                  addEvent('load-short')
                }}
              >
                Load Short (100)
              </Button>
              <Button
                testID="sheet-kb-fit-reset"
                size="$3"
                flex={1}
                onPress={() => {
                  setImageUrl(null)
                  addEvent('reset')
                }}
              >
                Reset (150)
              </Button>
            </XStack>

            <Button
              testID="sheet-kb-fit-dismiss-kb"
              size="$3"
              onPress={() => {
                Keyboard.dismiss()
                addEvent('dismiss-kb')
              }}
            >
              Dismiss Keyboard
            </Button>

            <Button
              testID="sheet-kb-fit-close"
              size="$3"
              theme="red"
              onPress={() => setOpen(false)}
            >
              Close
            </Button>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </YStack>
  )
}
