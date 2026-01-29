import { useState, useCallback, useRef, useEffect } from 'react'
import { ScrollView as RNScrollView } from 'react-native'
import { Button, Sheet, Text, YStack } from 'tamagui'
import { getGestureHandler } from '@tamagui/native'

/**
 * Test case for Sheet + ScrollView drag interaction
 *
 * SMOOTH HANDOFF requirements:
 * 1. Drag sheet down, then up until it hits top snap point -> should THEN start scrolling content
 * 2. Scroll content, then drag down until scrollY=0 -> should SWITCH BACK to dragging sheet
 * 3. No "stuck" states - always be able to scroll or drag as appropriate
 */
export function SheetScrollableDrag() {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  const [dragEvents, setDragEvents] = useState<string[]>([])
  const [scrollEventCount, setScrollEventCount] = useState(0)
  const [minScrollY, setMinScrollY] = useState(0)
  const [maxScrollY, setMaxScrollY] = useState(0)
  const [itemCount, setItemCount] = useState(20)
  const lastScrollY = useRef(0)

  const rnghEnabled = getGestureHandler().isEnabled

  useEffect(() => {
    console.log('[SheetScrollableDrag] RNGH enabled:', rnghEnabled)
  }, [rnghEnabled])

  const addEvent = useCallback((event: string) => {
    setDragEvents((prev) => [...prev.slice(-4), event])
  }, [])

  return (
    <YStack padding="$4" gap="$4" testID="sheet-scrollable-drag-screen">
      <Text testID="sheet-scrollable-drag-title" fontSize="$5" fontWeight="bold">
        Sheet + ScrollView Drag Test (v4)
      </Text>

      <Text
        testID="sheet-scrollable-drag-rngh-status"
        fontSize="$3"
        color={rnghEnabled ? '$green10' : '$red10'}
        fontWeight="bold"
      >
        RNGH: {rnghEnabled ? '✓ enabled' : '✗ disabled'}
      </Text>

      {/* Debug: test if plain RN ScrollView fires onScroll */}
      <RNScrollView
        style={{ height: 60, backgroundColor: '#eef' }}
        onScroll={(e) => {
          console.log('[TEST RNScrollView] onScroll:', e.nativeEvent.contentOffset.y)
        }}
        scrollEventThrottle={16}
      >
        <Text style={{ padding: 8 }}>Scroll me to test (outside sheet) - 1</Text>
        <Text style={{ padding: 8 }}>Scroll me to test (outside sheet) - 2</Text>
        <Text style={{ padding: 8 }}>Scroll me to test (outside sheet) - 3</Text>
        <Text style={{ padding: 8 }}>Scroll me to test (outside sheet) - 4</Text>
      </RNScrollView>

      <Text testID="sheet-scrollable-drag-instructions" fontSize="$3" color="$gray11">
        Test smooth handoff: drag down then up to scroll, scroll up then drag down to drag sheet.
      </Text>

      <YStack flexDirection="row" gap="$2">
        <Button testID="sheet-scrollable-drag-trigger" onPress={() => setOpen(true)} flex={1}>
          Open Sheet
        </Button>
        <Button
          testID="sheet-scrollable-drag-reset"
          onPress={() => {
            setScrollEventCount(0)
            setMinScrollY(0)
            setMaxScrollY(0)
            setDragEvents([])
            setItemCount(10)
            lastScrollY.current = 0
          }}
          theme="red"
        >
          Reset
        </Button>
      </YStack>

      <YStack gap="$2" padding="$3" bg="$backgroundHover" borderRadius="$2">
        <Text testID="sheet-scrollable-drag-position">Sheet position: {position}</Text>
        <Text testID="sheet-scrollable-drag-scroll-y">ScrollView Y: {scrollY.toFixed(0)}</Text>
        <Text testID="sheet-scrollable-drag-scroll-count">Scroll events: {scrollEventCount}</Text>
        <Text testID="sheet-scrollable-drag-min-scroll-y">Min scroll Y: {minScrollY.toFixed(0)}</Text>
        <Text testID="sheet-scrollable-drag-max-scroll-y">Max scroll Y: {maxScrollY.toFixed(0)}</Text>
        <Text testID="sheet-scrollable-drag-events">
          Events: {dragEvents.join(', ') || '(none)'}
        </Text>
      </YStack>

      <YStack gap="$1" padding="$2" bg="$green3" borderRadius="$2">
        <Text fontSize="$2" fontWeight="bold">
          Smooth handoff test:
        </Text>
        <Text fontSize="$2">
          1. Drag sheet down → then up → hits top → starts scrolling{'\n'}
          2. Scroll down → drag up → hits scrollY=0 → starts dragging sheet
        </Text>
      </YStack>

      <Sheet
        modal
        open={open}
        onOpenChange={setOpen}
        snapPoints={[85, 50]}
        snapPointsMode="percent"
        position={position}
        onPositionChange={(pos) => {
          setPosition(pos)
          addEvent(`snap:${pos}`)
        }}
        dismissOnSnapToBottom
        zIndex={100000}
        transition="medium"
      >
        <Sheet.Overlay
          testID="sheet-scrollable-drag-overlay"
          transition="lazy"
          bg="$color"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Handle testID="sheet-scrollable-drag-handle" />
        <Sheet.Frame testID="sheet-scrollable-drag-frame">
          <Sheet.ScrollView
            testID="sheet-scrollable-drag-scrollview"
            onScroll={(e) => {
              const y = e.nativeEvent.contentOffset.y
              setScrollY(y)
              setScrollEventCount((c) => c + 1)
              if (y < minScrollY) {
                setMinScrollY(y)
              }
              if (y > maxScrollY) {
                setMaxScrollY(y)
              }
              if (Math.abs(y - lastScrollY.current) > 5) {
                addEvent(`scroll:${y.toFixed(0)}`)
                lastScrollY.current = y
              }
            }}
            onScrollBeginDrag={() => {
              addEvent('dragStart')
            }}
            onScrollEndDrag={() => {
              addEvent('dragEnd')
            }}
            scrollEventThrottle={16}
          >
            <YStack gap="$3" padding="$4">
              <Text testID="sheet-scrollable-drag-snap-label" fontSize="$3" color="$gray11">
                Snap: {position} | Scroll Y: {scrollY.toFixed(0)} | Items: {itemCount}
              </Text>

              <Text testID="sheet-scrollable-drag-content-top" fontWeight="bold" fontSize="$4">
                ↕ Drag here to test handoff ↕
              </Text>

              <Button
                testID="sheet-scrollable-drag-add-items"
                onPress={() => setItemCount((c) => c + 5)}
                size="$3"
              >
                Add 5 Items ({itemCount} total)
              </Button>

              <Text testID="sheet-scrollable-drag-scroll-indicator" padding="$2" bg="$blue3" borderRadius="$2">
                Scroll Y: {scrollY.toFixed(0)}
              </Text>

              {Array.from({ length: itemCount }).map((_, i) => (
                <YStack
                  key={i}
                  testID={`sheet-scrollable-drag-item-${i}`}
                  padding="$3"
                  bg="$background"
                  borderRadius="$2"
                  borderWidth={1}
                  borderColor="$borderColor"
                >
                  <Text>Item {i + 1}</Text>
                </YStack>
              ))}

              <Button
                testID="sheet-scrollable-drag-close"
                onPress={() => setOpen(false)}
                marginTop="$4"
              >
                Close Sheet
              </Button>
            </YStack>
          </Sheet.ScrollView>
        </Sheet.Frame>
      </Sheet>
    </YStack>
  )
}
