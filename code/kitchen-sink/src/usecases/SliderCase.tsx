import React from 'react'
import { Slider, YStack, XStack, Text, View } from 'tamagui'

export function SliderCase() {
  const [value1, setValue1] = React.useState([50])
  const [value2, setValue2] = React.useState([25])
  const [value3, setValue3] = React.useState([30, 70])

  return (
    <YStack padding="$4" gap="$6" flex={1}>
      {/* Basic horizontal slider with drag functionality */}
      <YStack gap="$2">
        <Text>Basic Slider (drag to test)</Text>
        <Slider
          data-testid="basic-slider"
          value={value1}
          onValueChange={setValue1}
          max={100}
          step={1}
          width={300}
        >
          <Slider.Track data-testid="basic-slider-track">
            <Slider.TrackActive data-testid="basic-slider-track-active" />
          </Slider.Track>
          <Slider.Thumb data-testid="basic-slider-thumb" index={0} />
        </Slider>
        <Text data-testid="basic-slider-value">Value: {value1[0]}</Text>
      </YStack>

      {/* Flexible width slider - should flex to fill container */}
      <YStack gap="$2">
        <Text>Flexible Width Slider (should fill container)</Text>
        <XStack gap="$4" width="100%">
          <Text width={60}>Min</Text>
          <Slider
            data-testid="flex-slider"
            value={value2}
            onValueChange={setValue2}
            max={100}
            step={1}
            flex={1}
          >
            <Slider.Track data-testid="flex-slider-track">
              <Slider.TrackActive />
            </Slider.Track>
            <Slider.Thumb data-testid="flex-slider-thumb" index={0} />
          </Slider>
          <Text width={60}>Max</Text>
        </XStack>
        <Text data-testid="flex-slider-value">Value: {value2[0]}</Text>
      </YStack>

      {/* Vertical slider */}
      <XStack gap="$4">
        <YStack gap="$2" height={200}>
          <Text>Vertical Slider</Text>
          <Slider
            data-testid="vertical-slider"
            defaultValue={[50]}
            orientation="vertical"
            height={150}
          >
            <Slider.Track data-testid="vertical-slider-track">
              <Slider.TrackActive />
            </Slider.Track>
            <Slider.Thumb data-testid="vertical-slider-thumb" index={0} />
          </Slider>
        </YStack>

        {/* Range slider with two thumbs */}
        <YStack gap="$2" flex={1}>
          <Text>Range Slider (two thumbs)</Text>
          <Slider
            data-testid="range-slider"
            value={value3}
            onValueChange={setValue3}
            max={100}
            step={1}
          >
            <Slider.Track data-testid="range-slider-track">
              <Slider.TrackActive />
            </Slider.Track>
            <Slider.Thumb data-testid="range-slider-thumb-0" index={0} />
            <Slider.Thumb data-testid="range-slider-thumb-1" index={1} />
          </Slider>
          <Text data-testid="range-slider-value">
            Range: {value3[0]} - {value3[1]}
          </Text>
        </YStack>
      </XStack>

      {/* Fixed width container to test flex behavior */}
      <YStack gap="$2" backgroundColor="$background" padding="$3" borderRadius="$4">
        <Text>Slider in fixed container (300px)</Text>
        <View width={300} backgroundColor="$backgroundHover" padding="$2" borderRadius="$2">
          <Slider
            data-testid="contained-slider"
            defaultValue={[40]}
            max={100}
            step={1}
          >
            <Slider.Track>
              <Slider.TrackActive />
            </Slider.Track>
            <Slider.Thumb index={0} />
          </Slider>
        </View>
      </YStack>
    </YStack>
  )
}
