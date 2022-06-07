import React from 'react'
import { SizeTokens, Slider, XStack } from 'tamagui'

export default function SliderDemo() {
  return (
    <XStack height={200} ai="center" space="$8">
      <VerticalSlider size="$4" />

      <Slider width={200} defaultValue={[50]} max={100} step={1}>
        <Slider.Track>
          <Slider.TrackActive />
        </Slider.Track>
        <Slider.Thumb hoverable bordered circular elevate index={0} />
      </Slider>
    </XStack>
  )
}

function VerticalSlider(props: { size: SizeTokens }) {
  return (
    <Slider
      size={props.size}
      height={200}
      orientation="vertical"
      defaultValue={[50]}
      max={100}
      step={1}
    >
      <Slider.Track>
        <Slider.TrackActive />
      </Slider.Track>
      <Slider.Thumb hoverable bordered circular elevate index={0} />
    </Slider>
  )
}
