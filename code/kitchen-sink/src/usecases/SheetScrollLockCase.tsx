import { useState } from 'react'
import { Button, H2, Paragraph, Sheet, YStack } from 'tamagui'

/**
 * Test case for Sheet scroll lock behavior
 * Tests that body doesn't scroll when sheet is open and dragged
 * Also tests Sheet.ScrollView handoff behavior
 */
export function SheetScrollLockCase() {
  return (
    <YStack
      $platform-web={{
        minHeight: '200vh',
      }}
      padding="$4"
      gap="$4"
    >
      <H2>Sheet Scroll Lock Test</H2>
      <Paragraph data-testid="scroll-indicator">
        This page has a lot of content that makes the body scrollable. When the sheet is
        open, the body should NOT scroll.
      </Paragraph>

      {/* some content before buttons to require scrolling */}
      {Array.from({ length: 8 }).map((_, i) => (
        <Paragraph key={`pre-${i}`}>
          Scroll down to find the sheet buttons. Lorem ipsum dolor sit amet, consectetur
          adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna
          aliqua.
        </Paragraph>
      ))}

      <BasicScrollLockSheet />
      <SheetWithScrollView />

      {/* lots of content to make body scrollable */}
      {Array.from({ length: 30 }).map((_, i) => (
        <Paragraph key={i} data-testid={`body-content-${i}`}>
          Body content paragraph {i + 1}. Lorem ipsum dolor sit amet, consectetur
          adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna
          aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
          ut aliquip ex ea commodo consequat.
        </Paragraph>
      ))}
    </YStack>
  )
}

/**
 * Basic sheet to test body scroll lock
 */
function BasicScrollLockSheet() {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState(0)

  return (
    <>
      <Button data-testid="basic-scroll-lock-trigger" onPress={() => setOpen(true)}>
        Open Basic Sheet
      </Button>
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
          data-testid="basic-scroll-lock-overlay"
          transition="lazy"
          bg="$color"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Handle data-testid="basic-scroll-lock-handle" />
        <Sheet.Frame data-testid="basic-scroll-lock-frame" padding="$4" gap="$4">
          <Paragraph data-testid="basic-scroll-lock-snap-indicator">
            Current snap point: {position}
          </Paragraph>
          <Paragraph>
            Drag the handle to test scroll lock. The body behind this sheet should NOT
            scroll while dragging.
          </Paragraph>
          <YStack flex={1} justifyContent="center" alignItems="center">
            <Paragraph opacity={0.5}>Sheet content area</Paragraph>
          </YStack>
          <Button data-testid="basic-scroll-lock-close" onPress={() => setOpen(false)}>
            Close
          </Button>
        </Sheet.Frame>
      </Sheet>
    </>
  )
}

/**
 * Sheet with ScrollView to test handoff behavior
 * The Sheet.ScrollView should allow scrolling inside when at top snap point,
 * but pass control to the sheet drag when pulled down from scroll position 0
 */
function SheetWithScrollView() {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState(0)

  return (
    <>
      <Button data-testid="scrollview-sheet-trigger" onPress={() => setOpen(true)}>
        Open Sheet with ScrollView
      </Button>
      <Sheet
        modal
        open={open}
        onOpenChange={setOpen}
        snapPoints={[85, 50]}
        snapPointsMode="percent"
        position={position}
        onPositionChange={setPosition}
        dismissOnSnapToBottom
        zIndex={100000}
        transition="medium"
      >
        <Sheet.Overlay
          data-testid="scrollview-sheet-overlay"
          transition="lazy"
          bg="$color"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Handle data-testid="scrollview-sheet-handle" />
        <Sheet.Frame data-testid="scrollview-sheet-frame" padding="$4">
          <Paragraph data-testid="scrollview-sheet-snap-indicator">
            Current snap point: {position}
          </Paragraph>
          <Sheet.ScrollView data-testid="scrollview-sheet-scrollview">
            <YStack gap="$4" padding="$2">
              <Paragraph fontWeight="bold">
                This content is inside Sheet.ScrollView.
              </Paragraph>
              <Paragraph>
                When scrolled to top and pulling down, the sheet should drag. When there's
                scroll content above, the content should scroll.
              </Paragraph>
              {Array.from({ length: 20 }).map((_, i) => (
                <Paragraph key={i} data-testid={`scrollview-content-${i}`}>
                  ScrollView paragraph {i + 1}. Lorem ipsum dolor sit amet, consectetur
                  adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
                  magna aliqua.
                </Paragraph>
              ))}
              <Button data-testid="scrollview-sheet-close" onPress={() => setOpen(false)}>
                Close
              </Button>
            </YStack>
          </Sheet.ScrollView>
        </Sheet.Frame>
      </Sheet>
    </>
  )
}
