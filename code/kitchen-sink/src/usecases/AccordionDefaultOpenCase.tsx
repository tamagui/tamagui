import { ChevronDown } from '@tamagui/lucide-icons-2'
import { useCallback, useLayoutEffect, useState } from 'react'
import {
  measure,
  runOnJS,
  useAnimatedRef,
  useFrameCallback,
  useSharedValue,
} from 'react-native-reanimated'
import { Accordion, Button, Paragraph, Square, View, YStack, isWeb } from 'tamagui'

// verifies first-paint of a defaultValue-open item shows content at full height
// (no collapse-to-0 flash), which is the client-side equivalent of the SSR case.
// used by both the web Accordion.test and the native Accordion.e2e (Detox), so
// elements carry both `id` (web css selectors) and `testID` (native Detox).
export function AccordionDefaultOpenCase() {
  const [expanded, setExpanded] = useState(false)
  const [initialLayoutPass, setInitialLayoutPass] = useState(0)
  const [probeVisible, setProbeVisible] = useState(true)
  const [closeFrameSamples, setCloseFrameSamples] = useState('idle')
  const defaultOpenHeightRef = useAnimatedRef<any>()
  const recordingCloseFrames = useSharedValue(false)
  const closeFrameStartedAt = useSharedValue(0)
  const recordedCloseFrames = useSharedValue<number[]>([])

  const finishRecordingCloseFrames = useCallback((samples: number[]) => {
    setCloseFrameSamples(samples.join(','))
  }, [])
  useFrameCallback(
    useCallback(
      ({ timestamp }) => {
        'worklet'
        if (isWeb || !recordingCloseFrames.value) return
        const frame = measure(defaultOpenHeightRef)
        if (!frame) return
        if (closeFrameStartedAt.value === 0) {
          closeFrameStartedAt.value = timestamp
        }
        recordedCloseFrames.value = [...recordedCloseFrames.value, frame.height]
        if (timestamp - closeFrameStartedAt.value >= 750) {
          recordingCloseFrames.value = false
          runOnJS(finishRecordingCloseFrames)(recordedCloseFrames.value)
        }
      },
      [
        closeFrameStartedAt,
        defaultOpenHeightRef,
        finishRecordingCloseFrames,
        recordedCloseFrames,
        recordingCloseFrames,
      ]
    )
  )

  const recordDefaultOpenClose = useCallback(() => {
    if (isWeb) return
    setCloseFrameSamples('recording')
    closeFrameStartedAt.value = 0
    recordedCloseFrames.value = []
    recordingCloseFrames.value = true
  }, [closeFrameStartedAt, recordedCloseFrames, recordingCloseFrames])

  useLayoutEffect(() => {
    if (initialLayoutPass === 1) setInitialLayoutPass(2)
  }, [initialLayoutPass])

  return (
    <YStack testID="accordion-default-root" p="$4">
      <Accordion overflow="hidden" width="$20" type="multiple" defaultValue={['a1']}>
        <Accordion.Item value="a1" mb={-1}>
          <Accordion.Trigger
            id="def-trigger"
            testID="def-trigger"
            onPressIn={recordDefaultOpenClose}
            flexDirection="row"
            justify="space-between"
            borderWidth={1}
            borderColor="$borderColor"
          >
            {({ open }: { open: boolean }) => (
              <>
                <Paragraph>Open by default</Paragraph>
                <Square transparent transition="quick" rotate={open ? '180deg' : '0deg'}>
                  <ChevronDown size="$1" color="$color" />
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
              borderColor="$borderColor"
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
            flexDirection="row"
            justify="space-between"
            borderWidth={1}
            borderColor="$borderColor"
          >
            {({ open }: { open: boolean }) => (
              <>
                <Paragraph>Closed by default</Paragraph>
                <Square transparent transition="quick" rotate={open ? '180deg' : '0deg'}>
                  <ChevronDown size="$1" color="$color" />
                </Square>
              </>
            )}
          </Accordion.Trigger>
          <Accordion.HeightAnimator
            id="def-height2"
            testID="def-height2"
            transition={isWeb ? '300ms' : '5000ms'}
          >
            <Accordion.Content
              id="def-content2"
              testID="def-content2"
              borderWidth={1}
              borderTopWidth={0}
              borderColor="$borderColor"
            >
              <Paragraph testID="def-content2-text">
                {expanded
                  ? 'Second item content expanded across several lines to verify that an open HeightAnimator follows a changing intrinsic child measurement without losing its numeric animation target.'
                  : 'Second item content.'}
              </Paragraph>
              <Button
                id="grow-content"
                testID="grow-content"
                size="small"
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
        accessibilityLabel={closeFrameSamples}
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
        bg="$backgroundHover"
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
