import type { SliderProps } from 'tamagui'
import { Slider, XStack, YStack, Label } from 'tamagui'

export function SliderDemo() {
  return (
    <YStack gap="$8" style={{ alignItems: 'center' }}>
      <XStack height={200} style={{ alignItems: 'center' }} gap="$8">
        <YStack style={{ alignItems: 'center' }} gap="$4">
          <Label>Vertical (LTR)</Label>
          <SimpleSlider height={200} orientation="vertical" />
        </YStack>

        <YStack style={{ alignItems: 'center' }} gap="$4">
          <Label>Vertical (RTL)</Label>
          <SimpleSlider height={200} orientation="vertical" dir="rtl" />
        </YStack>

        <YStack style={{ alignItems: 'center' }} gap="$4">
          <Label>Horizontal (LTR)</Label>
          <SimpleSlider width={200} />
        </YStack>
      </XStack>

      <YStack style={{ alignItems: 'center' }} gap="$4">
        <Label>Horizontal (RTL)</Label>
        <SimpleSlider width={200} dir="rtl" />
      </YStack>
    </YStack>
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
