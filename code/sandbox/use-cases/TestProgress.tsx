import React from 'react'
import type { SizeTokens } from 'tamagui'
import { Button, Paragraph, Progress, Slider, XStack, YStack } from 'tamagui'
import { Play, RotateCcw } from '@tamagui/lucide-icons'

export function ProgressDemo() {
  const [key, setKey] = React.useState(0)
  const [size, setSize] = React.useState(4)
  const [progress, setProgress] = React.useState(0)
  const sizeProp = `$${size}` as SizeTokens

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(60), 1000)
    return () => {
      clearTimeout(timer)
    }
  }, [])

  return (
    <>
      <YStack height={60} items="center" gap="$4">
        <Paragraph height={30} opacity={0.5}>
          Size: {size}
        </Paragraph>
        <Progress key={key} size={sizeProp} value={progress} bg="$color5">
          <Progress.Indicator  bg="$background" />
        </Progress>
      </YStack>

      <XStack
        items="center"
        gap="$2"
        position="absolute"
        b="$3"
        l="$4"
        $xxs={{ display: 'none' }}
      >
        <Slider
          size="$2"
          width={130}
          defaultValue={[0]}
          min={0}
          max={100}
          step={1}
          onValueChange={([val]) => {
            setProgress(val)
          }}
        >
          <Slider.Track borderWidth={1} borderColor="$color5">
            <Slider.TrackActive />
          </Slider.Track>
          <Slider.Thumb circular index={0} />
        </Slider>

        <Button
          size="$2"
          icon={Play}
          onPress={() => setProgress((prev) => (prev + 20) % 100)}
        />
        <Button
          size="$2"
          icon={RotateCcw}
          onPress={() => {
            setKey(Math.random())
            setProgress(0)
          }}
        />
      </XStack>
    </>
  )
}
