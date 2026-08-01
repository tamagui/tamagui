// Styled Slider = the unstyled @tamagui/ui Slider behavior + the default v2-look
// skin on its Track (track color + radius), TrackActive (fill color + radius),
// and Thumb (border, background, hover/press/focus color styling). The behavior
// frames keep fill/clip/positioning + the thumb size mechanism. Single skin
// definition; the shadcn registry item is generated from this file.
import {
  createRefComponent,
  Slider as UiSlider,
  styled,
  type TamaguiElement,
  withStaticProperties,
} from '@tamagui/ui'
import type * as React from 'react'

export const SliderTrack = styled(UiSlider.Track, {
  name: 'SliderTrack',
  backgroundColor: 'background-press',
  borderRadius: 100_000,
})

export const SliderActive = styled(UiSlider.TrackActive, {
  name: 'SliderTrackActive',
  backgroundColor: 'color',
  borderRadius: 100_000,
})

export const SliderThumb = styled(UiSlider.Thumb, {
  name: 'SliderThumb',
  borderWidth: 2,
  borderColor: 'border-color press:border-color-press hover:border-color-hover',
  backgroundColor: 'background press:background-press hover:background-hover',
  outlineStyle: 'focus-visible:solid',
  outlineWidth: 'focus-visible:2px',
  outlineColor: 'focus-visible:outline-color',
})

// see Dialog.tsx: withStaticProperties assigns in place, so composing onto UiSlider
// would rewrite @tamagui/ui's own Slider.Track/.TrackActive/.Thumb for every consumer
// of the unstyled package.
const SliderRoot = createRefComponent<
  TamaguiElement,
  React.ComponentProps<typeof UiSlider>
>(function Slider(props, ref) {
  return <UiSlider {...props} ref={ref} />
})

export const Slider = withStaticProperties(SliderRoot, {
  Track: SliderTrack,
  TrackActive: SliderActive,
  Thumb: SliderThumb,
})
