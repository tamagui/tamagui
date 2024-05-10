import { useEffect, useState } from 'react'
import { Button, Text, View, XStack, YStack } from 'tamagui'
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
          width="$20"
          height="$4"
          borderRadius={20}
          borderWidth={2}
          justifyContent="center"
          overflow="hidden"
          {...frame}
          onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
        >
          <View
            width={35}
            height={35}
            borderRadius={10}
            borderWidth={2}
            backgroundColor="$color"
            animation="bouncy"
            position="absolute"
            right={0}
            x={indicator.x}
            rotate={`${indicator.x}deg`}
          />
          <View
            width="100%"
            height="100%"
            backgroundColor="$color"
            animation="bouncy"
            x={indicator.x - 35}
          />
          <Text
            themeInverse
            animation="bouncy"
            position="absolute"
            right={0}
            x={indicator.x - 8}
          >
            {progress}
          </Text>
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
