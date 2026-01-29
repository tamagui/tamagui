import { useState } from 'react'
import { Button, Paragraph, Sheet, YStack } from 'tamagui'

/**
 * Test case for Sheet drag/swipe interactions
 * Tests dragging between snap points and dismissing via drag
 */
export function SheetDragCase() {
  return (
    <YStack padding="$4" gap="$4">
      <DraggableSheetPercent />
      <DraggableSheetConstant />
      <DismissOnDragSheet />
    </YStack>
  )
}

/**
 * Sheet with percent snap points - draggable between 80% and 40%
 */
function DraggableSheetPercent() {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState(0)

  return (
    <>
      <Button data-testid="drag-percent-trigger" onPress={() => setOpen(true)}>
        Open Draggable Sheet (percent: 80%, 40%)
      </Button>
      <Paragraph data-testid="drag-percent-position">Position: {position}</Paragraph>
      <Sheet
        modal
        open={open}
        onOpenChange={setOpen}
        snapPoints={[80, 40]}
        snapPointsMode="percent"
        position={position}
        onPositionChange={setPosition}
        dismissOnSnapToBottom
        zIndex={100000}
        transition="medium"
      >
        <Sheet.Overlay
          data-testid="drag-percent-overlay"
          transition="lazy"
          bg="$color"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Handle data-testid="drag-percent-handle" />
        <Sheet.Frame
          data-testid="drag-percent-frame"
          padding="$4"
          gap="$4"
        >
          <Paragraph data-testid="drag-percent-snap-indicator">
            Current snap point index: {position}
          </Paragraph>
          <Paragraph>
            Drag the handle to move between snap points (80% and 40% of viewport)
          </Paragraph>
          <Paragraph>
            Drag past 40% to dismiss the sheet
          </Paragraph>
          <YStack flex={1} justifyContent="center" alignItems="center">
            <Paragraph opacity={0.5}>Sheet content area</Paragraph>
          </YStack>
          <Button data-testid="drag-percent-close" onPress={() => setOpen(false)}>
            Close
          </Button>
        </Sheet.Frame>
      </Sheet>
    </>
  )
}

/**
 * Sheet with constant pixel snap points - 500px and 250px
 */
function DraggableSheetConstant() {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState(0)

  return (
    <>
      <Button data-testid="drag-constant-trigger" onPress={() => setOpen(true)}>
        Open Draggable Sheet (constant: 500px, 250px)
      </Button>
      <Paragraph data-testid="drag-constant-position">Position: {position}</Paragraph>
      <Sheet
        modal
        open={open}
        onOpenChange={setOpen}
        snapPoints={[500, 250]}
        snapPointsMode="constant"
        position={position}
        onPositionChange={setPosition}
        dismissOnSnapToBottom
        zIndex={100000}
        transition="medium"
      >
        <Sheet.Overlay
          data-testid="drag-constant-overlay"
          transition="lazy"
          bg="$color"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Handle data-testid="drag-constant-handle" />
        <Sheet.Frame
          data-testid="drag-constant-frame"
          padding="$4"
          gap="$4"
        >
          <Paragraph data-testid="drag-constant-snap-indicator">
            Current snap point index: {position}
          </Paragraph>
          <Paragraph>
            Drag the handle to move between snap points (500px and 250px)
          </Paragraph>
          <YStack flex={1} justifyContent="center" alignItems="center">
            <Paragraph opacity={0.5}>Sheet content area</Paragraph>
          </YStack>
          <Button data-testid="drag-constant-close" onPress={() => setOpen(false)}>
            Close
          </Button>
        </Sheet.Frame>
      </Sheet>
    </>
  )
}

/**
 * Sheet that can be dismissed by dragging down
 * Uses dismissOnSnapToBottom with a single snap point
 */
function DismissOnDragSheet() {
  const [open, setOpen] = useState(false)
  const [dismissCount, setDismissCount] = useState(0)

  return (
    <>
      <Button data-testid="dismiss-drag-trigger" onPress={() => setOpen(true)}>
        Open Dismissable Sheet (drag to dismiss)
      </Button>
      <Paragraph data-testid="dismiss-drag-count">Dismiss count: {dismissCount}</Paragraph>
      <Sheet
        modal
        open={open}
        onOpenChange={(isOpen: boolean) => {
          setOpen(isOpen)
          if (!isOpen) {
            setDismissCount((c) => c + 1)
          }
        }}
        snapPoints={[50]}
        snapPointsMode="percent"
        dismissOnSnapToBottom
        zIndex={100000}
        transition="medium"
      >
        <Sheet.Overlay
          data-testid="dismiss-drag-overlay"
          transition="lazy"
          bg="$color"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Handle data-testid="dismiss-drag-handle" />
        <Sheet.Frame
          data-testid="dismiss-drag-frame"
          padding="$4"
          justifyContent="center"
          alignItems="center"
          gap="$4"
        >
          <Paragraph>Drag down on the handle to dismiss this sheet</Paragraph>
          <Paragraph opacity={0.5}>
            The sheet will close when dragged past the bottom threshold
          </Paragraph>
          <Button data-testid="dismiss-drag-close" onPress={() => setOpen(false)}>
            Close via button
          </Button>
        </Sheet.Frame>
      </Sheet>
    </>
  )
}
