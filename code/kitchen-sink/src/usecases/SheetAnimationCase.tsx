import { useState, useRef, useCallback } from 'react'
import { Button, Paragraph, Sheet, YStack, XStack } from 'tamagui'

/**
 * Test case for Sheet animation configurations
 * Tests that different animation names and configs produce different animation speeds
 */
export function SheetAnimationCase() {
  return (
    <YStack gap="$4" padding="$4" flex={1}>
      {/* Test 1: animation prop only - "quick" */}
      <SheetTest
        testId="animation-quick"
        animation="quick"
        label='animation="quick"'
      />

      {/* Test 2: animation prop only - "lazy" */}
      <SheetTest
        testId="animation-lazy"
        animation="lazy"
        label='animation="lazy"'
      />

      {/* Test 3: animation prop only - "slow" */}
      <SheetTest
        testId="animation-slow"
        animation="slow"
        label='animation="slow"'
      />

      {/* Test 4: animationConfig prop only */}
      <SheetTest
        testId="animationConfig-only"
        animationConfig={{
          type: 'spring',
          damping: 30,
          stiffness: 400,
        }}
        label="animationConfig only (fast spring)"
      />

      {/* Test 5: animationConfig prop only - slow */}
      <SheetTest
        testId="animationConfig-slow"
        animationConfig={{
          type: 'spring',
          damping: 20,
          stiffness: 30,
        }}
        label="animationConfig only (slow spring)"
      />

      {/* Test 6: animation + animationConfig together */}
      <SheetTest
        testId="animation-plus-config"
        animation="lazy"
        animationConfig={{
          type: 'spring',
          damping: 30,
          stiffness: 500,
        }}
        label='animation="lazy" + animationConfig (override to fast)'
      />
    </YStack>
  )
}

interface SheetTestProps {
  testId: string
  animation?: string
  animationConfig?: {
    type: 'spring' | 'timing' | 'decay'
    damping?: number
    stiffness?: number
    mass?: number
    duration?: number
  }
  label: string
}

function SheetTest({ testId, animation, animationConfig, label }: SheetTestProps) {
  const [open, setOpen] = useState(false)
  const [lastDuration, setLastDuration] = useState<number | null>(null)
  const startTimeRef = useRef<number>(0)

  const handleOpen = useCallback(() => {
    startTimeRef.current = performance.now()
    setOpen(true)
  }, [])

  const handleOpenChange = useCallback((isOpen: boolean) => {
    if (!isOpen && startTimeRef.current > 0) {
      // Sheet is closing, we already measured open duration
    }
    setOpen(isOpen)
  }, [])

  // Track when sheet frame enters viewport (animation complete)
  const handleFrameLayout = useCallback(() => {
    if (open && startTimeRef.current > 0) {
      const duration = performance.now() - startTimeRef.current
      setLastDuration(Math.round(duration))
      startTimeRef.current = 0
    }
  }, [open])

  return (
    <XStack gap="$2" alignItems="center" flexWrap="wrap">
      <Button
        size="$3"
        onPress={handleOpen}
        testID={`${testId}-trigger`}
        data-testid={`${testId}-trigger`}
      >
        {label}
      </Button>
      {lastDuration !== null && (
        <Paragraph
          size="$2"
          testID={`${testId}-duration`}
          data-testid={`${testId}-duration`}
        >
          {lastDuration}ms
        </Paragraph>
      )}

      <Sheet
        open={open}
        onOpenChange={handleOpenChange}
        animation={animation as any}
        animationConfig={animationConfig as any}
        modal
        dismissOnSnapToBottom
        snapPoints={[40]}
      >
        <Sheet.Overlay
          animation={animation as any}
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Frame
          padding="$4"
          bg="$background"
          testID={`${testId}-frame`}
          data-testid={`${testId}-frame`}
          onLayout={handleFrameLayout}
        >
          <YStack gap="$4">
            <Paragraph testID={`${testId}-label`} data-testid={`${testId}-label`}>
              {label}
            </Paragraph>
            <Paragraph size="$2" color="$color10">
              Animation: {animation || 'none'}, Config:{' '}
              {animationConfig ? JSON.stringify(animationConfig) : 'none'}
            </Paragraph>
            <Button
              onPress={() => setOpen(false)}
              testID={`${testId}-close`}
              data-testid={`${testId}-close`}
            >
              Close
            </Button>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </XStack>
  )
}
