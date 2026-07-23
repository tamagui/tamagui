import { useState } from 'react'
import type { Animated } from 'react-native'
import {
  Button,
  Paragraph,
  Sheet,
  View as TamaguiView,
  YStack,
  useAnimationDriver,
  useAnimatedNumberStyle,
} from 'tamagui'

// drag-linked overlay fade built entirely on the public hooks:
// Sheet.useAnimatedPosition() gives the live translateY, useAnimatedNumberStyle
// maps it to an opacity worklet. rendered through the driver's animated View so
// it works on every driver (css re-renders + DOM transition, motion/reanimated
// run on their own value). no framework-owned fade involved.
function DragLinkedBackdrop() {
  const animationDriver = useAnimationDriver()
  const AnimatedView = (animationDriver['NumberView'] ??
    animationDriver.View ??
    TamaguiView) as typeof Animated.View

  const { value, screenSize } = Sheet.useAnimatedPosition()

  const style = useAnimatedNumberStyle(value, (y: number) => {
    'worklet'
    return { opacity: Math.max(0, 0.6 * (1 - y / screenSize)) }
  })

  return (
    <AnimatedView
      // @ts-ignore css/motion drivers attach the transition here
      transition="quick"
      // @ts-ignore
      disableClassName
      testID="drag-fade-backdrop"
      data-testid="drag-fade-backdrop"
      style={[
        {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#000',
        },
        style,
      ]}
    />
  )
}

export function SheetDragFadeCase() {
  const [open, setOpen] = useState(false)

  return (
    <YStack padding="$4" gap="$4">
      <Button testID="drag-fade-open" onPress={() => setOpen(true)}>
        Open drag-fade sheet
      </Button>

      <Sheet
        modal
        open={open}
        onOpenChange={setOpen}
        snapPoints={[80, 40]}
        dismissOnSnapToBottom
        transition="quick"
      >
        <Sheet.Overlay testID="drag-fade-overlay" backgroundColor="transparent">
          <DragLinkedBackdrop />
        </Sheet.Overlay>
        <Sheet.Handle testID="drag-fade-handle" height={16} backgroundColor="$color8" />
        <Sheet.Container testID="drag-fade-frame" padding="$4" gap="$4">
          <Sheet.Background backgroundColor="$background" />
          <Paragraph>Drag the handle to fade the backdrop.</Paragraph>
          <Button testID="drag-fade-close" onPress={() => setOpen(false)}>
            Close
          </Button>
        </Sheet.Container>
      </Sheet>
    </YStack>
  )
}
