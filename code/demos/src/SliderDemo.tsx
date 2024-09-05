import type { SliderProps } from 'tamagui'
import { Slider, XStack } from 'tamagui'

export function SliderDemo() {
  return (
    <XStack height={200} alignItems="center" gap="$8">
      <SimpleSlider height={200} orientation="vertical" />
      <SimpleSlider width={200} />
    </XStack>
  )
}

function SimpleSlider({ children, ...props }: SliderProps) {
  return (
    <Slider defaultValue={[50]} max={100} step={1} {...props}>
      <Slider.Track>
        <Slider.TrackActive />
      </Slider.Track>
      <Slider.Thumb size="$2" index={0} circular />
      {children}
    </Slider>
  )
}
