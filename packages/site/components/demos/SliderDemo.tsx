import { Slider, XStack, YStack } from 'tamagui'

export default function SliderDemo() {
  return (
    <XStack width={300} height={200} ai="center" space="$8">
      <Slider height={200} orientation="vertical" defaultValue={[50]} max={100} step={1}>
        <Slider.Track>
          <Slider.TrackActive />
        </Slider.Track>
        <Slider.Thumb hoverable bordered circular elevate index={0} />
      </Slider>

      <Slider width={200} defaultValue={[50]} max={100} step={1}>
        <Slider.Track>
          <Slider.TrackActive />
        </Slider.Track>
        <Slider.Thumb hoverable bordered circular elevate index={0} />
      </Slider>
    </XStack>
  )
}
