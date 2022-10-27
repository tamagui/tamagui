import React from 'react'
import { useEffect, useState } from 'react'
import { Button, Paragraph, Progress, SizeTokens, Slider, XStack, YStack } from 'tamagui'

export function ProgressDemo() {
  const [size, setSize] = useState(4)
  const [progress, setProgress] = useState(20)
  const sizeProp = `$${size}` as SizeTokens

  useEffect(() => {
    const timer = setTimeout(() => setProgress(60), 1000)
    return () => {
      clearTimeout(timer)
    }
  }, [])

  return (
    <>
      <YStack h={60} ai="center" space>
        <Paragraph h={30} o={0.5}>
          Size: {size}
        </Paragraph>
        <Progress size={sizeProp} value={progress}>
          <Progress.Indicator animation="bouncy" />
        </Progress>
      </YStack>

      <XStack ai="center" space pos="absolute" b={10} l={20} $xxs={{ dsp: 'none' }}>
        <Slider
          size="$2"
          w={130}
          defaultValue={[4]}
          min={2}
          max={6}
          step={1}
          onValueChange={([val]) => {
            setSize(val)
          }}
        >
          <Slider.Track>
            <Slider.TrackActive />
          </Slider.Track>
          <Slider.Thumb circular index={0} />
        </Slider>

        <Button size="$2" onPress={() => setProgress((prev) => (prev + 20) % 100)}>
          Load
        </Button>
      </XStack>
    </>
  )
}
