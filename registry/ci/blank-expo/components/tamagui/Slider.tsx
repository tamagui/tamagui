// Styled Slider = the unstyled @tamagui/ui Slider behavior + the default v2-look
// skin on its Track (track color + radius), TrackActive (fill color + radius),
// and Thumb (border, background, hover/press/focus color styling). The behavior
// frames keep fill/clip/positioning + the thumb size mechanism. Single skin
// definition; the shadcn registry item is generated from this file.
import { Slider as UiSlider, styled, withStaticProperties } from '@tamagui/ui'

export const SliderTrack = styled(UiSlider.Track, {
  name: 'SliderTrack',
  backgroundColor: '$backgroundPress',
  borderRadius: 100_000,
})

export const SliderActive = styled(UiSlider.TrackActive, {
  name: 'SliderTrackActive',
  backgroundColor: '$color',
  borderRadius: 100_000,
})

export const SliderThumb = styled(UiSlider.Thumb, {
  name: 'SliderThumb',
  borderWidth: 2,
  borderColor: '$borderColor',
  backgroundColor: '$background',
  pressStyle: {
    backgroundColor: '$backgroundPress',
    borderColor: '$borderColorPress',
  },
  hoverStyle: {
    backgroundColor: '$backgroundHover',
    borderColor: '$borderColorHover',
  },
  focusVisibleStyle: {
    outlineStyle: 'solid',
    outlineWidth: 2,
    outlineColor: '$outlineColor',
  },
})

export const Slider = withStaticProperties(UiSlider, {
  Track: SliderTrack,
  TrackActive: SliderActive,
  Thumb: SliderThumb,
})
