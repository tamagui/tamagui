import { useState } from 'react'
import { Adapt, Button, Dialog, Paragraph, Sheet, View, YStack } from 'tamagui'

/**
 * Test case for Sheet with snapPointsMode="fit" adapted from Dialog
 * This tests the fix for white flash on close (issue #3651)
 */
export function SheetSnapPointsFitCase() {
  return (
    <YStack padding="$4" gap="$4">
      <AdaptedDialogSheet />
      <StandaloneSheetFit />
      <StandaloneSheetPercent />
      <StandaloneSheetConstant />
      <RapidOpenCloseSheet />
      <DynamicContentSheet />
      <ScrollViewInFitSheet />
      <TallScrollViewInFitSheet />
    </YStack>
  )
}

/**
 * Dialog that adapts to Sheet with snapPointsMode="fit"
 * This is the primary test case for the white flash fix
 */
function AdaptedDialogSheet() {
  return (
    <Dialog modal>
      <Dialog.Trigger asChild>
        <Button data-testid="adapted-dialog-trigger">Open Adapted Dialog/Sheet</Button>
      </Dialog.Trigger>

      <Adapt when="sm" platform="web">
        <Sheet
          transition="medium"
          zIndex={200000}
          modal
          dismissOnSnapToBottom
          snapPointsMode="fit"
        >
          <Sheet.Frame
            data-testid="adapted-sheet-frame"
            padding="$4"
            justifyContent="center"
            gap="$2"
          >
            <Sheet.Handle data-testid="adapted-sheet-handle" />
            <Adapt.Contents />
          </Sheet.Frame>
          <Sheet.Overlay
            data-testid="adapted-sheet-overlay"
            transition="lazy"
            bg="$color"
            opacity={0.5}
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Sheet>
      </Adapt>

      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          transition="quick"
          bg="$color"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />

        <Dialog.Content
          bordered
          elevate
          key="content"
          transition="quick"
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          width={400}
          padding="$6"
          gap="$4"
        >
          <YStack data-testid="adapted-dialog-content" gap="$4">
            <Dialog.Title>Adapted Dialog</Dialog.Title>
            <Dialog.Description>
              This dialog adapts to a sheet on small screens with snapPointsMode="fit".
              The sheet should close smoothly without a white flash.
            </Dialog.Description>
            <Paragraph>Some content to give the sheet height when in fit mode.</Paragraph>
            <Dialog.Close asChild>
              <Button data-testid="adapted-dialog-close">Close</Button>
            </Dialog.Close>
          </YStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}

/**
 * Standalone Sheet with snapPointsMode="fit"
 * This should not have any regression from the fix
 */
function StandaloneSheetFit() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button data-testid="standalone-fit-trigger" onPress={() => setOpen(true)}>
        Open Standalone Sheet (fit)
      </Button>
      <Sheet
        modal
        open={open}
        onOpenChange={setOpen}
        snapPointsMode="fit"
        dismissOnSnapToBottom
        zIndex={100000}
        transition="medium"
      >
        <Sheet.Overlay
          data-testid="standalone-fit-overlay"
          transition="lazy"
          bg="$color"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Handle data-testid="standalone-fit-handle" />
        <Sheet.Frame
          data-testid="standalone-fit-frame"
          padding="$4"
          justifyContent="center"
          alignItems="center"
          gap="$5"
        >
          <Paragraph>Standalone sheet with snapPointsMode="fit"</Paragraph>
          <Button data-testid="standalone-fit-close" onPress={() => setOpen(false)}>
            Close
          </Button>
        </Sheet.Frame>
      </Sheet>
    </>
  )
}

/**
 * Standalone Sheet with snapPointsMode="percent"
 * This should not have any regression from the fix
 */
function StandaloneSheetPercent() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button data-testid="standalone-percent-trigger" onPress={() => setOpen(true)}>
        Open Standalone Sheet (percent)
      </Button>
      <Sheet
        modal
        open={open}
        onOpenChange={setOpen}
        snapPoints={[50, 25]}
        snapPointsMode="percent"
        dismissOnSnapToBottom
        zIndex={100000}
        transition="medium"
      >
        <Sheet.Overlay
          data-testid="standalone-percent-overlay"
          transition="lazy"
          bg="$color"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Handle data-testid="standalone-percent-handle" />
        <Sheet.Frame
          data-testid="standalone-percent-frame"
          padding="$4"
          justifyContent="center"
          alignItems="center"
          gap="$5"
        >
          <Paragraph>Standalone sheet with snapPointsMode="percent" (50%, 25%)</Paragraph>
          <Button data-testid="standalone-percent-close" onPress={() => setOpen(false)}>
            Close
          </Button>
        </Sheet.Frame>
      </Sheet>
    </>
  )
}

/**
 * Standalone Sheet with snapPointsMode="constant"
 * This should not have any regression from the fix
 */
function StandaloneSheetConstant() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button data-testid="standalone-constant-trigger" onPress={() => setOpen(true)}>
        Open Standalone Sheet (constant)
      </Button>
      <Sheet
        modal
        open={open}
        onOpenChange={setOpen}
        snapPoints={[300, 200]}
        snapPointsMode="constant"
        dismissOnSnapToBottom
        zIndex={100000}
        transition="medium"
      >
        <Sheet.Overlay
          data-testid="standalone-constant-overlay"
          transition="lazy"
          bg="$color"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Handle data-testid="standalone-constant-handle" />
        <Sheet.Frame
          data-testid="standalone-constant-frame"
          padding="$4"
          justifyContent="center"
          alignItems="center"
          gap="$5"
        >
          <Paragraph>
            Standalone sheet with snapPointsMode="constant" (300px, 200px)
          </Paragraph>
          <Button data-testid="standalone-constant-close" onPress={() => setOpen(false)}>
            Close
          </Button>
        </Sheet.Frame>
      </Sheet>
    </>
  )
}

/**
 * Test rapid open/close interactions
 */
function RapidOpenCloseSheet() {
  const [open, setOpen] = useState(false)
  const [clickCount, setClickCount] = useState(0)

  const handleRapidToggle = () => {
    setClickCount((c) => c + 1)
    setOpen((prev) => !prev)
  }

  return (
    <>
      <Button data-testid="rapid-toggle-trigger" onPress={handleRapidToggle}>
        Rapid Toggle (count: {clickCount})
      </Button>
      <Sheet
        modal
        open={open}
        onOpenChange={setOpen}
        snapPointsMode="fit"
        dismissOnSnapToBottom
        zIndex={100000}
        transition="medium"
      >
        <Sheet.Overlay
          data-testid="rapid-overlay"
          transition="lazy"
          bg="$color"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Handle data-testid="rapid-handle" />
        <Sheet.Frame
          data-testid="rapid-frame"
          padding="$4"
          justifyContent="center"
          alignItems="center"
          gap="$5"
        >
          <Paragraph>Rapid open/close test - count: {clickCount}</Paragraph>
          <Button data-testid="rapid-close" onPress={() => setOpen(false)}>
            Close
          </Button>
        </Sheet.Frame>
      </Sheet>
    </>
  )
}

/**
 * Sheet.ScrollView inside snapPointsMode="fit"
 * regression test for: ScrollView hardcoded flex:1 collapsed inside a hasFit Frame
 * (Frame has flex:0/flex-basis:auto/height:undefined), so both ScrollView and Frame
 * measured to 0 — overlay rendered, sheet did not.
 *
 * with the fix, in fit mode the ScrollView sizes to content and caps at screenSize.
 */
function ScrollViewInFitSheet() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button data-testid="scrollview-fit-trigger" onPress={() => setOpen(true)}>
        Open Sheet (fit + ScrollView, short content)
      </Button>
      <Sheet
        modal
        open={open}
        onOpenChange={setOpen}
        snapPointsMode="fit"
        dismissOnSnapToBottom
        zIndex={100000}
        transition="medium"
      >
        <Sheet.Overlay
          data-testid="scrollview-fit-overlay"
          transition="lazy"
          bg="$color"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Handle data-testid="scrollview-fit-handle" />
        <Sheet.Frame data-testid="scrollview-fit-frame" padding="$4">
          <Sheet.ScrollView data-testid="scrollview-fit-scrollview">
            <YStack gap="$3" padding="$2">
              <Paragraph fontWeight="bold">Fit mode + Sheet.ScrollView (short)</Paragraph>
              <Paragraph>
                The sheet frame must size to content (this YStack), not collapse to 0.
              </Paragraph>
              {Array.from({ length: 4 }).map((_, i) => (
                <Paragraph key={i} data-testid={`scrollview-fit-item-${i}`}>
                  Item {i + 1}
                </Paragraph>
              ))}
              <Button data-testid="scrollview-fit-close" onPress={() => setOpen(false)}>
                Close
              </Button>
            </YStack>
          </Sheet.ScrollView>
        </Sheet.Frame>
      </Sheet>
    </>
  )
}

/**
 * Sheet.ScrollView inside snapPointsMode="fit" with content TALLER than viewport.
 * verifies maxHeight: screenSize cap kicks in and content becomes scrollable.
 */
function TallScrollViewInFitSheet() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button data-testid="scrollview-fit-tall-trigger" onPress={() => setOpen(true)}>
        Open Sheet (fit + ScrollView, tall content)
      </Button>
      <Sheet
        modal
        open={open}
        onOpenChange={setOpen}
        snapPointsMode="fit"
        dismissOnSnapToBottom
        zIndex={100000}
        transition="medium"
      >
        <Sheet.Overlay
          data-testid="scrollview-fit-tall-overlay"
          transition="lazy"
          bg="$color"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Handle data-testid="scrollview-fit-tall-handle" />
        <Sheet.Frame data-testid="scrollview-fit-tall-frame" padding="$4">
          <Sheet.ScrollView data-testid="scrollview-fit-tall-scrollview">
            <YStack gap="$2" padding="$2">
              <Paragraph fontWeight="bold">
                Fit mode + Sheet.ScrollView (tall, scrollable)
              </Paragraph>
              <Paragraph>
                Content here is taller than the screen — scrollview should scroll inside
                the capped sheet height.
              </Paragraph>
              {Array.from({ length: 40 }).map((_, i) => (
                <View
                  key={i}
                  data-testid={`scrollview-fit-tall-item-${i}`}
                  padding="$2"
                  borderRadius="$2"
                  bg="$background"
                >
                  <Paragraph>Row {i + 1} — Lorem ipsum dolor sit amet.</Paragraph>
                </View>
              ))}
              <Button
                data-testid="scrollview-fit-tall-close"
                onPress={() => setOpen(false)}
              >
                Close
              </Button>
            </YStack>
          </Sheet.ScrollView>
        </Sheet.Frame>
      </Sheet>
    </>
  )
}

/**
 * Test dynamic content changes while sheet is open
 */
function DynamicContentSheet() {
  const [open, setOpen] = useState(false)
  const [contentSize, setContentSize] = useState<'small' | 'medium' | 'large'>('small')

  return (
    <>
      <Button data-testid="dynamic-content-trigger" onPress={() => setOpen(true)}>
        Open Dynamic Content Sheet
      </Button>
      <Sheet
        modal
        open={open}
        onOpenChange={setOpen}
        snapPointsMode="fit"
        dismissOnSnapToBottom
        zIndex={100000}
        transition="medium"
      >
        <Sheet.Overlay
          data-testid="dynamic-content-overlay"
          transition="lazy"
          bg="$color"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Handle data-testid="dynamic-content-handle" />
        <Sheet.Frame
          data-testid="dynamic-content-frame"
          padding="$4"
          justifyContent="center"
          alignItems="center"
          gap="$4"
        >
          <Paragraph data-testid="dynamic-content-size">
            Current size: {contentSize}
          </Paragraph>

          {contentSize === 'small' && (
            <Paragraph>Small content - just a little text.</Paragraph>
          )}

          {contentSize === 'medium' && (
            <YStack gap="$2">
              <Paragraph>Medium content with more text.</Paragraph>
              <Paragraph>This adds more height to the sheet.</Paragraph>
              <Paragraph>The sheet should adjust smoothly.</Paragraph>
            </YStack>
          )}

          {contentSize === 'large' && (
            <YStack gap="$2">
              <Paragraph>Large content with lots of text.</Paragraph>
              <Paragraph>This is line 2 of the large content.</Paragraph>
              <Paragraph>This is line 3 of the large content.</Paragraph>
              <Paragraph>This is line 4 of the large content.</Paragraph>
              <Paragraph>This is line 5 of the large content.</Paragraph>
              <Paragraph>The sheet height should be much larger now.</Paragraph>
            </YStack>
          )}

          <YStack gap="$2" flexDirection="row" flexWrap="wrap" justifyContent="center">
            <Button
              data-testid="dynamic-content-small"
              size="$3"
              onPress={() => setContentSize('small')}
              theme={contentSize === 'small' ? 'blue' : undefined}
            >
              Small
            </Button>
            <Button
              data-testid="dynamic-content-medium"
              size="$3"
              onPress={() => setContentSize('medium')}
              theme={contentSize === 'medium' ? 'blue' : undefined}
            >
              Medium
            </Button>
            <Button
              data-testid="dynamic-content-large"
              size="$3"
              onPress={() => setContentSize('large')}
              theme={contentSize === 'large' ? 'blue' : undefined}
            >
              Large
            </Button>
          </YStack>

          <Button data-testid="dynamic-content-close" onPress={() => setOpen(false)}>
            Close
          </Button>
        </Sheet.Frame>
      </Sheet>
    </>
  )
}
