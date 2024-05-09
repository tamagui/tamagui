import { useEffect, useState } from 'react'
import { Button, View, XStack, YStack } from 'tamagui'
import { useProgress } from '@tamagui/progress-headless'

export function ProgressHeadlessDemo() {
  const [progress, setProgress] = useState(20)
  const [width, setWidth] = useState(0)
  const { frame, indicator } = useProgress({ value: progress, width })

  useEffect(() => {
    const timer = setTimeout(() => setProgress(60), 1000)
    return () => {
      clearTimeout(timer)
    }
  }, [])

  return (
    <>
      <YStack alignItems="center" gap="$4">
        <View
          borderColor="$gray5"
          width="$20"
          height="$4"
          borderRadius={20}
          {...frame}
          onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
        >
          <View
            width="100%"
            height="100%"
            backgroundColor="$color"
            animation="bouncy"
            {...indicator}
          />
        </View>
      </YStack>
      <XStack
        alignItems="center"
        space
        position="absolute"
        bottom="$3"
        left="$4"
        $xxs={{ display: 'none' }}
      >
        <Button size="$2" onPress={() => setProgress((prev) => (prev + 20) % 100)}>
          Load
        </Button>
      </XStack>
    </>
  )
}
