import { useState, useSyncExternalStore } from 'react'
import { Keyboard, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native'
import { Button, Image, Input, Sheet, Text, XStack, YStack } from 'tamagui'

const MOCK_URLS = {
  tall: 'https://picsum.photos/400/600',
  short: 'https://picsum.photos/400/150',
}

type ScrollMetrics = {
  scrollY: number
  maxScrollY: number
}

let scrollMetrics: ScrollMetrics = {
  scrollY: 0,
  maxScrollY: 0,
}

let eventMetrics: string[] = []

const scrollMetricListeners = new Set<() => void>()
const eventMetricListeners = new Set<() => void>()

const subscribeScrollMetrics = (listener: () => void) => {
  scrollMetricListeners.add(listener)
  return () => {
    scrollMetricListeners.delete(listener)
  }
}

const subscribeEventMetrics = (listener: () => void) => {
  eventMetricListeners.add(listener)
  return () => {
    eventMetricListeners.delete(listener)
  }
}

const getScrollMetrics = () => scrollMetrics
const getEventMetrics = () => eventMetrics

const emitScrollMetrics = () => {
  scrollMetricListeners.forEach((listener) => listener())
}

const emitEventMetrics = () => {
  eventMetricListeners.forEach((listener) => listener())
}

function resetTestMetrics() {
  scrollMetrics = { scrollY: 0, maxScrollY: 0 }
  eventMetrics = []
  emitScrollMetrics()
  emitEventMetrics()
}

function addEventMetric(event: string) {
  eventMetrics = [...eventMetrics.slice(-6), event]
  emitEventMetrics()
}

function updateScrollMetrics(y: number) {
  const scrollY = Math.max(0, Math.round(y))
  const maxScrollY = Math.max(scrollMetrics.maxScrollY, scrollY)

  if (scrollY === scrollMetrics.scrollY && maxScrollY === scrollMetrics.maxScrollY) {
    return
  }

  scrollMetrics = { scrollY, maxScrollY }
  emitScrollMetrics()
}

function handleScrollMetrics(event: NativeSyntheticEvent<NativeScrollEvent>) {
  updateScrollMetrics(event.nativeEvent.contentOffset.y)
}

function TestMetricsProbe() {
  const { scrollY, maxScrollY } = useSyncExternalStore(
    subscribeScrollMetrics,
    getScrollMetrics,
    getScrollMetrics
  )
  const events = useSyncExternalStore(
    subscribeEventMetrics,
    getEventMetrics,
    getEventMetrics
  )

  return (
    <YStack gap="$2" padding="$3" bg="$backgroundHover" borderRadius="$2">
      <Text testID="sheet-kb-fit-events">Events: {events.join(', ') || '(none)'}</Text>
      <Text testID="sheet-kb-fit-scroll-y">Scroll Y: {scrollY}</Text>
      <Text testID="sheet-kb-fit-max-scroll-y">Max scroll Y: {maxScrollY}</Text>
    </YStack>
  )
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
  const [caption, setCaption] = useState('')
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  return (
    <YStack padding="$4" gap="$4" testID="sheet-kb-fit-screen">
      <Text fontSize="$5" fontWeight="bold">
        Sheet + Keyboard + Fit Content
      </Text>

      <Text fontSize="$3" color="$gray11">
        Load a mock image URL to change content height while keyboard may be open.
      </Text>

      <Button
        testID="sheet-kb-fit-trigger"
        theme="green"
        onPress={() => {
          resetTestMetrics()
          setOpen(true)
        }}
      >
        Open Sheet
      </Button>

      <TestMetricsProbe />

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

        <Sheet.Container testID="sheet-kb-fit-frame">
          <Sheet.Background />

          <Sheet.ScrollView
            testID="sheet-kb-fit-scrollview"
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            scrollEventThrottle={16}
            onScroll={handleScrollMetrics}
          >
            <YStack gap="$4" padding="$4">
              <Text fontSize="$5" fontWeight="bold">
                Create Post
              </Text>

              <Input
                testID="sheet-kb-fit-input"
                placeholder="What's on your mind?"
                value={caption}
                onChangeText={setCaption}
                onFocus={() => addEventMetric('focus')}
                onBlur={() => addEventMetric('blur')}
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
                    addEventMetric('load-tall')
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
                    addEventMetric('load-short')
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
                    addEventMetric('reset')
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
                  addEventMetric('dismiss-kb')
                }}
              >
                Dismiss Keyboard
              </Button>

              <Button
                testID="sheet-kb-fit-post"
                size="$3"
                theme="green"
                onPress={() => addEventMetric('post')}
              >
                Post
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
          </Sheet.ScrollView>
        </Sheet.Container>
      </Sheet>
    </YStack>
  )
}
