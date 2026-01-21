import React from 'react'
import { Button, Paragraph, Progress, Slider, Theme, XStack, YStack } from 'tamagui'
import { Play, RotateCcw } from '@tamagui/lucide-icons'

export function ProgressDemo() {
  const [key, setKey] = React.useState(0)
  const [progress, setProgress] = React.useState(60)
  const [slider, setSlider] = React.useState<number[]>([60])

  return (
    <>
      <YStack height={60} items="center" gap="$4">
        <Paragraph height={30} opacity={0.5}>
          Progress: {progress}
        </Paragraph>

        <Progress key={key} value={progress}>
          <Progress.Indicator backgroundColor="$color" transition="200ms" />
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
          theme="surface2"
          width={130}
          value={slider}
          min={0}
          max={100}
          step={1}
          onValueChange={([val]) => {
            setProgress(val)
            setSlider([val])
          }}
        >
          <Slider.Track borderWidth={1} borderColor="$color5">
            <Slider.TrackActive />
          </Slider.Track>
          <Slider.Thumb theme="accent" circular index={0} />
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
            setSlider([0])
          }}
        />
      </XStack>
    </>
  )
}
