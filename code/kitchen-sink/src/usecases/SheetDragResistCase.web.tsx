import { useState, useRef, useCallback } from 'react'
import { Button, Sheet, Text, YStack, Paragraph } from 'tamagui'

/**
 * Web test case for Sheet drag resistance behavior
 *
 * Tests three scenarios:
 * 1. Sheet without ScrollView - drag up should show resistance
 * 2. Sheet with ScrollView but NO scrollable content - drag should move sheet, not scroll
 * 3. Sheet with ScrollView and scrollable content - drag up at top should show resistance
 */
export function SheetDragResistCase() {
  return (
    <YStack padding="$4" gap="$4" data-testid="sheet-drag-resist-screen">
      <Text fontSize="$5" fontWeight="bold">
        Sheet Drag Resistance Tests (Web)
      </Text>
      <NoScrollViewSheet />
      <NonScrollableContentSheet />
      <ScrollableContentSheet />
    </YStack>
  )
}

/**
 * Test 1: Sheet without ScrollView
 * Expected: dragging up at the top snap point should show visual resistance
 */
function NoScrollViewSheet() {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState(0)
  const [maxDragUp, setMaxDragUp] = useState(0)
  const [lastDragY, setLastDragY] = useState(0)
  const startY = useRef(0)

  return (
    <YStack gap="$2">
      <Button data-testid="no-scroll-trigger" onPress={() => setOpen(true)}>
        Test 1: No ScrollView
      </Button>
      <Paragraph data-testid="no-scroll-position">Position: {position}</Paragraph>
      <Paragraph data-testid="no-scroll-max-drag">
        Max drag up: {maxDragUp.toFixed(0)}px
      </Paragraph>
      <Paragraph data-testid="no-scroll-last-drag">
        Last drag Y: {lastDragY.toFixed(0)}px
      </Paragraph>
      <Sheet
        modal
        open={open}
        onOpenChange={setOpen}
        snapPoints={[70, 40]}
        snapPointsMode="percent"
        position={position}
        onPositionChange={setPosition}
        dismissOnSnapToBottom
        zIndex={100000}
        transition="medium"
      >
        <Sheet.Overlay
          data-testid="no-scroll-overlay"
          transition="lazy"
          bg="$color"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Handle data-testid="no-scroll-handle" />
        <Sheet.Frame
          data-testid="no-scroll-frame"
          padding="$4"
          gap="$4"
          onTouchStart={(e: any) => {
            startY.current = e.nativeEvent?.pageY ?? e.touches?.[0]?.pageY ?? 0
          }}
          onTouchMove={(e: any) => {
            const currentY = e.nativeEvent?.pageY ?? e.touches?.[0]?.pageY ?? 0
            const dy = startY.current - currentY
            setLastDragY(currentY)
            if (dy > maxDragUp) {
              setMaxDragUp(dy)
            }
          }}
        >
          <Paragraph data-testid="no-scroll-snap-indicator">
            Current snap point: {position}
          </Paragraph>
          <Paragraph>
            Drag UP on this sheet when at top position (0). The sheet should resist and
            show visual feedback.
          </Paragraph>
          <Paragraph
            data-testid="no-scroll-drag-indicator"
            bg="$blue3"
            padding="$2"
            borderRadius="$2"
          >
            Max upward drag detected: {maxDragUp.toFixed(0)}px
          </Paragraph>
          <YStack flex={1} justifyContent="center" alignItems="center">
            <Paragraph opacity={0.5}>Sheet content (no ScrollView)</Paragraph>
          </YStack>
          <Button
            data-testid="no-scroll-reset"
            onPress={() => {
              setMaxDragUp(0)
              setLastDragY(0)
            }}
            theme="red"
            size="$3"
          >
            Reset Drag Tracking
          </Button>
          <Button data-testid="no-scroll-close" onPress={() => setOpen(false)}>
            Close
          </Button>
        </Sheet.Frame>
      </Sheet>
    </YStack>
  )
}

/**
 * Test 2: Sheet with ScrollView but content fits (not scrollable)
 * Expected: dragging should move the sheet, NOT scroll the non-scrollable content
 */
function NonScrollableContentSheet() {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  const [scrollEventCount, setScrollEventCount] = useState(0)
  const [dragEventCount, setDragEventCount] = useState(0)

  return (
    <YStack gap="$2">
      <Button data-testid="non-scrollable-trigger" onPress={() => setOpen(true)}>
        Test 2: Non-Scrollable ScrollView
      </Button>
      <Paragraph data-testid="non-scrollable-position">Position: {position}</Paragraph>
      <Paragraph data-testid="non-scrollable-scroll-y">
        Scroll Y: {scrollY.toFixed(0)}
      </Paragraph>
      <Paragraph data-testid="non-scrollable-scroll-count">
        Scroll events: {scrollEventCount}
      </Paragraph>
      <Paragraph data-testid="non-scrollable-drag-count">
        Drag events: {dragEventCount}
      </Paragraph>
      <Sheet
        modal
        open={open}
        onOpenChange={setOpen}
        snapPoints={[70, 40]}
        snapPointsMode="percent"
        position={position}
        onPositionChange={(pos) => {
          setPosition(pos)
          setDragEventCount((c) => c + 1)
        }}
        dismissOnSnapToBottom
        zIndex={100000}
        transition="medium"
      >
        <Sheet.Overlay
          data-testid="non-scrollable-overlay"
          transition="lazy"
          bg="$color"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Handle data-testid="non-scrollable-handle" />
        <Sheet.Frame data-testid="non-scrollable-frame">
          <Sheet.ScrollView
            data-testid="non-scrollable-scrollview"
            onScroll={(e: any) => {
              setScrollY(e.nativeEvent.contentOffset.y)
              setScrollEventCount((c) => c + 1)
            }}
            scrollEventThrottle={16}
          >
            <YStack padding="$4" gap="$3">
              <Paragraph data-testid="non-scrollable-snap-indicator">
                Current snap point: {position}
              </Paragraph>
              <Paragraph>
                This content FITS in the sheet (not scrollable). Dragging should move the
                SHEET, not scroll.
              </Paragraph>
              <YStack bg="$yellow3" padding="$3" borderRadius="$2">
                <Text fontWeight="bold">Expected behavior:</Text>
                <Text>• Dragging down: sheet moves to next snap point</Text>
                <Text>• Dragging up: sheet resists at top</Text>
                <Text>• ScrollView should NOT capture gestures</Text>
              </YStack>
              <Paragraph
                data-testid="non-scrollable-status"
                bg="$blue3"
                padding="$2"
                borderRadius="$2"
              >
                Scroll events: {scrollEventCount} | Position changes: {dragEventCount}
              </Paragraph>
              <Button
                data-testid="non-scrollable-reset"
                onPress={() => {
                  setScrollEventCount(0)
                  setDragEventCount(0)
                }}
                theme="red"
                size="$3"
              >
                Reset Counters
              </Button>
              <Button data-testid="non-scrollable-close" onPress={() => setOpen(false)}>
                Close
              </Button>
            </YStack>
          </Sheet.ScrollView>
        </Sheet.Frame>
      </Sheet>
    </YStack>
  )
}

/**
 * Test 3: Sheet with ScrollView and scrollable content
 * Expected: at top of scroll and top snap point, dragging up should show resistance
 */
function ScrollableContentSheet() {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  const [maxDragUp, setMaxDragUp] = useState(0)
  const [isAtScrollTop, setIsAtScrollTop] = useState(true)
  const startY = useRef(0)

  const handleScrollViewTouch = useCallback(
    (pageY: number) => {
      if (!isAtScrollTop) return
      if (position !== 0) return

      const dy = startY.current - pageY
      if (dy > maxDragUp) {
        setMaxDragUp(dy)
      }
    },
    [isAtScrollTop, position, maxDragUp]
  )

  return (
    <YStack gap="$2">
      <Button data-testid="scrollable-trigger" onPress={() => setOpen(true)}>
        Test 3: Scrollable ScrollView
      </Button>
      <Paragraph data-testid="scrollable-position">Position: {position}</Paragraph>
      <Paragraph data-testid="scrollable-scroll-y">
        Scroll Y: {scrollY.toFixed(0)}
      </Paragraph>
      <Paragraph data-testid="scrollable-max-drag">
        Max drag up (at top): {maxDragUp.toFixed(0)}px
      </Paragraph>
      <Paragraph data-testid="scrollable-at-top">
        At scroll top: {isAtScrollTop ? 'YES' : 'NO'}
      </Paragraph>
      <Sheet
        modal
        open={open}
        onOpenChange={setOpen}
        snapPoints={[80, 50]}
        snapPointsMode="percent"
        position={position}
        onPositionChange={setPosition}
        dismissOnSnapToBottom
        zIndex={100000}
        transition="medium"
      >
        <Sheet.Overlay
          data-testid="scrollable-overlay"
          transition="lazy"
          bg="$color"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Handle data-testid="scrollable-handle" />
        <Sheet.Frame data-testid="scrollable-frame">
          <Sheet.ScrollView
            data-testid="scrollable-scrollview"
            onScroll={(e: any) => {
              const y = e.nativeEvent.contentOffset.y
              setScrollY(y)
              setIsAtScrollTop(y <= 0)
            }}
            scrollEventThrottle={16}
            onTouchStart={(e: any) => {
              startY.current = e.nativeEvent?.pageY ?? e.touches?.[0]?.pageY ?? 0
            }}
            onTouchMove={(e: any) => {
              const pageY = e.nativeEvent?.pageY ?? e.touches?.[0]?.pageY ?? 0
              handleScrollViewTouch(pageY)
            }}
          >
            <YStack padding="$4" gap="$3">
              <Paragraph data-testid="scrollable-snap-indicator">
                Position: {position} | Scroll Y: {scrollY.toFixed(0)}
              </Paragraph>
              <Paragraph
                data-testid="scrollable-status"
                bg="$blue3"
                padding="$2"
                borderRadius="$2"
              >
                Max upward drag (at top): {maxDragUp.toFixed(0)}px
              </Paragraph>
              <Button
                data-testid="scrollable-reset"
                onPress={() => setMaxDragUp(0)}
                theme="red"
                size="$3"
              >
                Reset Drag Tracking
              </Button>
              <Paragraph>
                This content IS scrollable. When at the top of scroll and top snap point,
                dragging UP should show resistance.
              </Paragraph>
              <YStack bg="$green3" padding="$3" borderRadius="$2">
                <Text fontWeight="bold">Expected behavior:</Text>
                <Text>• Scroll down in content: normal scroll</Text>
                <Text>• At scroll top, drag up: resistance effect</Text>
                <Text>• Drag down from scroll top: sheet moves</Text>
              </YStack>

              {/* lots of items to make it scrollable */}
              {Array.from({ length: 20 }).map((_, i) => (
                <YStack
                  key={i}
                  data-testid={`scrollable-item-${i}`}
                  padding="$3"
                  bg="$background"
                  borderRadius="$2"
                  borderWidth={1}
                  borderColor="$borderColor"
                >
                  <Text>Scrollable Item {i + 1}</Text>
                </YStack>
              ))}

              <Button data-testid="scrollable-close" onPress={() => setOpen(false)}>
                Close
              </Button>
            </YStack>
          </Sheet.ScrollView>
        </Sheet.Frame>
      </Sheet>
    </YStack>
  )
}
