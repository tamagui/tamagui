import React from 'react'
import { SizeTokens, Slider, SliderProps, Spacer, XStack, YStack } from 'tamagui'

export default function SliderDemo() {
  return (
    <XStack height={200} ai="center" space="$8">
      <SimpleSlider height={200} orientation="vertical" />
      <SimpleSlider step={10} width={200} defaultValue={[25, 75]}>
        <Slider.Thumb hoverable bordered circular elevate index={1} />
      </SimpleSlider>
    </XStack>
  )
}

function SimpleSlider({ children, ...props }: SliderProps) {
  return (
    <Slider defaultValue={[50]} max={100} step={1} {...props}>
      <Slider.Track>
        <Slider.TrackActive />
      </Slider.Track>
      <Slider.Thumb hoverable bordered circular elevate index={0} />
      {children}
    </Slider>
  )
}
