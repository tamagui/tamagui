import { ChevronDown } from '@tamagui/lucide-icons-2'
import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import {
  measure,
  runOnJS,
  useAnimatedRef,
  useFrameCallback,
  useSharedValue,
} from 'react-native-reanimated'
import { Accordion, Button, Paragraph, Square, View, YStack, isWeb } from 'tamagui'

function useHeightFrameRecorder(animatedRef: any) {
  const [label, setLabel] = useState('idle')
  const recording = useSharedValue(false)
  const startedAt = useSharedValue(0)
  const cycle = useSharedValue(0)
  const samples = useSharedValue<number[]>([])
  const nextCycleRef = useRef(0)

  const finishRecording = useCallback((finishedCycle: number, heights: number[]) => {
    setLabel(`${finishedCycle}:${heights.join(',')}`)
  }, [])

  useFrameCallback(
    useCallback(
      ({ timestamp }) => {
        'worklet'
        if (isWeb || !recording.value) return
        const frame = measure(animatedRef)
        if (!frame) return
        if (startedAt.value === 0) {
          startedAt.value = timestamp
        }
        samples.value = [...samples.value, frame.height]
        if (timestamp - startedAt.value >= 750) {
          recording.value = false
          runOnJS(finishRecording)(cycle.value, samples.value)
        }
      },
      [animatedRef, cycle, finishRecording, recording, samples, startedAt]
    )
  )

  const startRecording = useCallback(() => {
    if (isWeb) return
    const nextCycle = ++nextCycleRef.current
    setLabel(`recording:${nextCycle}`)
    startedAt.value = 0
    samples.value = []
    cycle.value = nextCycle
    recording.value = true
  }, [cycle, recording, samples, startedAt])

  return [label, startRecording] as const
}

// verifies first-paint of a defaultValue-open item shows content at full height
// (no collapse-to-0 flash), which is the client-side equivalent of the SSR case.
// used by both the web Accordion.test and the native Accordion.e2e (Detox), so
// elements carry both `id` (web css selectors) and `testID` (native Detox).
export function AccordionDefaultOpenCase() {
  const [expanded, setExpanded] = useState(false)
  const [initialLayoutPass, setInitialLayoutPass] = useState(0)
  const [probeVisible, setProbeVisible] = useState(true)
  const defaultOpenHeightRef = useAnimatedRef<any>()
  const secondHeightRef = useAnimatedRef<any>()
  const [defaultOpenFrameSamples, recordDefaultOpenFrames] =
    useHeightFrameRecorder(defaultOpenHeightRef)
  const [secondFrameSamples, recordSecondFrames] = useHeightFrameRecorder(secondHeightRef)

  useLayoutEffect(() => {
    if (initialLayoutPass === 1) setInitialLayoutPass(2)
  }, [initialLayoutPass])

  return (
    <YStack testID="accordion-default-root" p="4">
      {/* explicit px: this was $20 pre-v6; the flat-values migration mapped it
          to the v6 "20" token (80px), which wrapped every label ~3x taller and
          pushed grow-content below the window, so Detox refused the tap */}
      <Accordion overflow="hidden" width={224} type="multiple" defaultValue={['a1']}>
        <Accordion.Item value="a1" mb={-1}>
          <Accordion.Trigger
            id="def-trigger"
            testID="def-trigger"
            onPressIn={recordDefaultOpenFrames}
            flexDirection="row"
            justify="space-between"
            borderWidth={1}
            borderColor="border-color"
          >
            {({ open }: { open: boolean }) => (
              <>
                <Paragraph>Open by default</Paragraph>
                <Square transparent transition="quick" rotate={open ? '180deg' : '0deg'}>
                  <ChevronDown size="1" color="color" />
                </Square>
              </>
            )}
          </Accordion.Trigger>
          <Accordion.HeightAnimator
            ref={defaultOpenHeightRef}
            id="def-height"
            testID="def-height"
            transition={isWeb ? '300ms' : '5000ms'}
          >
            <Accordion.Content
              id="def-content"
              testID="def-content"
              borderWidth={1}
              borderTopWidth={0}
              borderColor="border-color"
            >
              <View
                onLayout={() => setInitialLayoutPass((pass) => (pass === 0 ? 1 : pass))}
              >
                <Paragraph testID="def-content-text">
                  This content should be visible immediately on first paint, at its full
                  natural height, with no collapse-to-zero flash.
                </Paragraph>
              </View>
            </Accordion.Content>
          </Accordion.HeightAnimator>
        </Accordion.Item>

        <Accordion.Item value="a2">
          <Accordion.Trigger
            id="def-trigger2"
            testID="def-trigger2"
            onPressIn={recordSecondFrames}
            flexDirection="row"
            justify="space-between"
            borderWidth={1}
            borderColor="border-color"
          >
            {({ open }: { open: boolean }) => (
              <>
                <Paragraph>Closed by default</Paragraph>
                <Square transparent transition="quick" rotate={open ? '180deg' : '0deg'}>
                  <ChevronDown size="1" color="color" />
                </Square>
              </>
            )}
          </Accordion.Trigger>
          <Accordion.HeightAnimator
            ref={secondHeightRef}
            id="def-height2"
            testID="def-height2"
            transition={isWeb ? '300ms' : '5000ms'}
          >
            <Accordion.Content
              id="def-content2"
              testID="def-content2"
              borderWidth={1}
              borderTopWidth={0}
              borderColor="border-color"
            >
              <Paragraph testID="def-content2-text">
                {expanded
                  ? 'Second item content expanded across several lines to verify that an open HeightAnimator follows a changing intrinsic child measurement without losing its numeric animation target.'
                  : 'Second item content.'}
              </Paragraph>
              <Button
                id="grow-content"
                testID="grow-content"
                size="2"
                onPress={() => setExpanded((value) => !value)}
              >
                Resize content
              </Button>
            </Accordion.Content>
          </Accordion.HeightAnimator>
        </Accordion.Item>
      </Accordion>
      <View
        testID="default-close-frame-samples"
        accessibilityLabel={defaultOpenFrameSamples}
        position="absolute"
        pointerEvents="none"
        width={1}
        height={1}
      />
      <View
        testID="second-frame-samples"
        accessibilityLabel={secondFrameSamples}
        position="absolute"
        pointerEvents="none"
        width={1}
        height={1}
      />
      <Paragraph id="after-accordion-marker" testID="after-accordion-marker">
        After accordion
      </Paragraph>
      <View
        id="animated-key-probe"
        testID="animated-key-probe"
        width={20}
        height={probeVisible ? 40 : undefined}
        x={probeVisible ? 40 : undefined}
        bg="background-hover"
        transition="300ms"
      />
      <Button
        id="toggle-key-probe"
        testID="toggle-key-probe"
        onPress={() => setProbeVisible((visible) => !visible)}
      >
        Toggle animated keys
      </Button>
    </YStack>
  )
}
