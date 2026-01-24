import { useState, useRef, useCallback } from 'react'
import { View, Text as RNText, StyleSheet } from 'react-native'
import ActionSheet, { type ActionSheetRef, ScrollView as ActionScrollView } from 'react-native-actions-sheet'
import { Button, Sheet, Text, YStack, Paragraph } from 'tamagui'

/**
 * Test case for Sheet drag resistance behavior
 *
 * Tests three scenarios:
 * 1. Sheet without ScrollView - drag up should show resistance
 * 2. Sheet with ScrollView but NO scrollable content - drag should move sheet, not scroll
 * 3. Sheet with ScrollView and scrollable content - drag up at top should show resistance
 */
export function SheetDragResistCase() {
  return (
    <YStack padding="$4" gap="$4" testID="sheet-drag-resist-screen">
      <Text fontSize="$5" fontWeight="bold">
        Sheet Drag Resistance Tests
      </Text>
      <NoScrollViewSheet />
      <NonScrollableContentSheet />
      <ScrollableContentSheet />
      <ActionsSheetComparison />
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
      <Button testID="no-scroll-trigger" onPress={() => setOpen(true)}>
        Test 1: No ScrollView
      </Button>
      <Paragraph testID="no-scroll-position">Position: {position}</Paragraph>
      <Paragraph testID="no-scroll-max-drag">Max drag up: {maxDragUp.toFixed(0)}px</Paragraph>
      <Paragraph testID="no-scroll-last-drag">Last drag Y: {lastDragY.toFixed(0)}px</Paragraph>
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
          testID="no-scroll-overlay"
          transition="lazy"
          bg="$color"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Handle testID="no-scroll-handle" />
        <Sheet.Frame
          testID="no-scroll-frame"
          padding="$4"
          gap="$4"
          onTouchStart={(e) => {
            startY.current = e.nativeEvent.pageY
          }}
          onTouchMove={(e) => {
            const currentY = e.nativeEvent.pageY
            const dy = startY.current - currentY
            setLastDragY(currentY)
            if (dy > maxDragUp) {
              setMaxDragUp(dy)
            }
          }}
        >
          <Paragraph testID="no-scroll-snap-indicator">
            Current snap point: {position}
          </Paragraph>
          <Paragraph>
            Drag UP on this sheet when at top position (0).
            The sheet should resist and show visual feedback.
          </Paragraph>
          <Paragraph testID="no-scroll-drag-indicator" bg="$blue3" padding="$2" borderRadius="$2">
            Max upward drag detected: {maxDragUp.toFixed(0)}px
          </Paragraph>
          <YStack flex={1} justifyContent="center" alignItems="center">
            <Paragraph opacity={0.5}>Sheet content (no ScrollView)</Paragraph>
          </YStack>
          <Button
            testID="no-scroll-reset"
            onPress={() => {
              setMaxDragUp(0)
              setLastDragY(0)
            }}
            theme="red"
            size="$3"
          >
            Reset Drag Tracking
          </Button>
          <Button testID="no-scroll-close" onPress={() => setOpen(false)}>
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
      <Button testID="non-scrollable-trigger" onPress={() => setOpen(true)}>
        Test 2: Non-Scrollable ScrollView
      </Button>
      <Paragraph testID="non-scrollable-position">Position: {position}</Paragraph>
      <Paragraph testID="non-scrollable-scroll-y">Scroll Y: {scrollY.toFixed(0)}</Paragraph>
      <Paragraph testID="non-scrollable-scroll-count">Scroll events: {scrollEventCount}</Paragraph>
      <Paragraph testID="non-scrollable-drag-count">Drag events: {dragEventCount}</Paragraph>
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
          testID="non-scrollable-overlay"
          transition="lazy"
          bg="$color"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Handle testID="non-scrollable-handle" />
        <Sheet.Frame testID="non-scrollable-frame">
          <Sheet.ScrollView
            testID="non-scrollable-scrollview"
            onScroll={(e) => {
              setScrollY(e.nativeEvent.contentOffset.y)
              setScrollEventCount((c) => c + 1)
            }}
            scrollEventThrottle={16}
          >
            <YStack padding="$4" gap="$3">
              <Paragraph testID="non-scrollable-snap-indicator">
                Current snap point: {position}
              </Paragraph>
              <Paragraph>
                This content FITS in the sheet (not scrollable).
                Dragging should move the SHEET, not scroll.
              </Paragraph>
              <YStack bg="$yellow3" padding="$3" borderRadius="$2">
                <Text fontWeight="bold">Expected behavior:</Text>
                <Text>• Dragging down: sheet moves to next snap point</Text>
                <Text>• Dragging up: sheet resists at top</Text>
                <Text>• ScrollView should NOT capture gestures</Text>
              </YStack>
              <Paragraph testID="non-scrollable-status" bg="$blue3" padding="$2" borderRadius="$2">
                Scroll events: {scrollEventCount} | Position changes: {dragEventCount}
              </Paragraph>
              <Button
                testID="non-scrollable-reset"
                onPress={() => {
                  setScrollEventCount(0)
                  setDragEventCount(0)
                }}
                theme="red"
                size="$3"
              >
                Reset Counters
              </Button>
              <Button testID="non-scrollable-close" onPress={() => setOpen(false)}>
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

  const handleScrollViewTouch = useCallback((pageY: number) => {
    if (!isAtScrollTop) return
    if (position !== 0) return

    const dy = startY.current - pageY
    if (dy > maxDragUp) {
      setMaxDragUp(dy)
    }
  }, [isAtScrollTop, position, maxDragUp])

  return (
    <YStack gap="$2">
      <Button testID="scrollable-trigger" onPress={() => setOpen(true)}>
        Test 3: Scrollable ScrollView
      </Button>
      <Paragraph testID="scrollable-position">Position: {position}</Paragraph>
      <Paragraph testID="scrollable-scroll-y">Scroll Y: {scrollY.toFixed(0)}</Paragraph>
      <Paragraph testID="scrollable-max-drag">Max drag up (at top): {maxDragUp.toFixed(0)}px</Paragraph>
      <Paragraph testID="scrollable-at-top">At scroll top: {isAtScrollTop ? 'YES' : 'NO'}</Paragraph>
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
          testID="scrollable-overlay"
          transition="lazy"
          bg="$color"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Handle testID="scrollable-handle" />
        <Sheet.Frame testID="scrollable-frame">
          <Sheet.ScrollView
            testID="scrollable-scrollview"
            onScroll={(e) => {
              const y = e.nativeEvent.contentOffset.y
              setScrollY(y)
              setIsAtScrollTop(y <= 0)
            }}
            scrollEventThrottle={16}
            onTouchStart={(e) => {
              startY.current = e.nativeEvent.pageY
            }}
            onTouchMove={(e) => {
              handleScrollViewTouch(e.nativeEvent.pageY)
            }}
          >
            <YStack padding="$4" gap="$3">
              <Paragraph testID="scrollable-snap-indicator">
                Position: {position} | Scroll Y: {scrollY.toFixed(0)}
              </Paragraph>
              <Paragraph testID="scrollable-status" bg="$blue3" padding="$2" borderRadius="$2">
                Max upward drag (at top): {maxDragUp.toFixed(0)}px
              </Paragraph>
              <Button
                testID="scrollable-reset"
                onPress={() => setMaxDragUp(0)}
                theme="red"
                size="$3"
              >
                Reset Drag Tracking
              </Button>
              <Paragraph>
                This content IS scrollable. When at the top of scroll
                and top snap point, dragging UP should show resistance.
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
                  testID={`scrollable-item-${i}`}
                  padding="$3"
                  bg="$background"
                  borderRadius="$2"
                  borderWidth={1}
                  borderColor="$borderColor"
                >
                  <Text>Scrollable Item {i + 1}</Text>
                </YStack>
              ))}

              <Button testID="scrollable-close" onPress={() => setOpen(false)}>
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
 * Comparison: react-native-actions-sheet with non-scrollable content
 * Used to verify Detox can trigger RNGH gestures properly
 */
function ActionsSheetComparison() {
  const actionsSheetRef = useRef<ActionSheetRef>(null)
  const [snapIndex, setSnapIndex] = useState(0)

  return (
    <YStack gap="$2">
      <Button testID="actions-sheet-trigger" onPress={() => actionsSheetRef.current?.show()}>
        Actions Sheet (Comparison)
      </Button>
      <Paragraph testID="actions-sheet-snap">Actions Sheet snap: {snapIndex}</Paragraph>

      <ActionSheet
        ref={actionsSheetRef}
        snapPoints={[70, 40]}
        initialSnapIndex={0}
        gestureEnabled
        onSnapIndexChange={setSnapIndex}
        containerStyle={{ maxHeight: '100%' }}
        testIDs={{
          root: 'actions-sheet-root',
          backdrop: 'actions-sheet-backdrop',
          handle: 'actions-sheet-handle',
          sheet: 'actions-sheet-frame',
        }}
      >
        <View style={styles.actionsContent} testID="actions-sheet-content">
          <RNText style={styles.title} testID="actions-sheet-snap-indicator">
            Snap index: {snapIndex}
          </RNText>
          <RNText style={styles.description}>
            This content FITS (not scrollable). Swiping down should move the sheet.
          </RNText>
          <View style={styles.infoBox}>
            <RNText style={styles.infoText}>Expected: swipe down moves to snap 1</RNText>
          </View>
        </View>
      </ActionSheet>
    </YStack>
  )
}

const styles = StyleSheet.create({
  actionsContent: {
    padding: 20,
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  infoBox: {
    backgroundColor: '#e8f4e8',
    padding: 12,
    borderRadius: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#2d5a2d',
  },
})
