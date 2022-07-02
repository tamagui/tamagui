import { Slider, SliderProps, XStack } from 'tamagui'

export function SliderDemo() {
  return (
    <XStack height={200} ai="center" space="$8">
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
      <Slider.Thumb bordered circular elevate index={0} />
      {children}
    </Slider>
  )
}
