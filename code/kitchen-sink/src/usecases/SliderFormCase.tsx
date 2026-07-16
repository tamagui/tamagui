import { Slider, YStack } from 'tamagui'

export function SliderFormCase() {
  return (
    <form data-testid="slider-form">
      <YStack width={240} p="$4">
        <Slider defaultValue={[10, 90]} name="range">
          <Slider.Track>
            <Slider.TrackActive />
          </Slider.Track>
          <Slider.Thumb index={0} />
          <Slider.Thumb index={1} />
        </Slider>
      </YStack>
    </form>
  )
}
