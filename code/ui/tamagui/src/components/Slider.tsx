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

export const SliderTrackFrame = styled(UiSlider.Track, {
  displayName: 'SliderTrack',
  className: 'is_SliderTrack',
  backgroundColor: 'background-press',
  borderRadius: 100_000,
})

export const SliderTrack = SliderTrackFrame

export const SliderActiveFrame = styled(UiSlider.TrackActive, {
  displayName: 'SliderTrackActive',
  className: 'is_SliderTrackActive',
  backgroundColor: 'color',
  borderRadius: 100_000,
})

export const SliderActive = SliderActiveFrame

export const SliderThumbFrame = styled(UiSlider.Thumb, {
  displayName: 'SliderThumb',
  borderWidth: 2,
  borderColor: 'border-color hover:border-color-hover press:border-color-press',
  backgroundColor: 'background hover:background-hover press:background-press',
  outlineStyle: 'focus-visible:solid',
  outlineWidth: 'focus-visible:2px',
  outlineColor: 'focus-visible:outline-color',
})

export const SliderThumb = SliderThumbFrame

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
