// Styled Slider = the unstyled @tamagui/ui Slider behavior + the default v2-look
// skin on its Track (track color + radius), TrackActive (fill color + radius),
// and Thumb (border, background, hover/press/focus color styling). The behavior
// frames keep fill/clip/positioning + the thumb size mechanism. Single skin
// definition; the shadcn registry item is generated from this file.
import {
  createRefComponent,
  createStyledHOC,
  type GetProps,
  Slider as UiSlider,
  styled,
  type TamaguiElement,
  Theme,
  type ThemeProps,
  withStaticProperties,
} from '@tamagui/ui'
import type * as React from 'react'

export const SliderTrackFrame = styled(UiSlider.Track, {
  name: 'Slider',
  backgroundColor: 'background',
  borderRadius: 100_000,
})

export const SliderTrack = createStyledHOC(
  SliderTrackFrame,
  function SliderTrack(
    props: GetProps<typeof SliderTrackFrame> & { theme?: ThemeProps['name'] },
    ref
  ) {
    const { theme, ...trackProps } = props
    return (
      <Theme name={theme ?? 'Slider'}>
        <SliderTrackFrame {...trackProps} ref={ref} />
      </Theme>
    )
  },
  { disableTheme: true }
)

export const SliderActiveFrame = styled(UiSlider.TrackActive, {
  name: 'SliderActive',
  backgroundColor: 'background',
  borderRadius: 100_000,
})

export const SliderActive = createStyledHOC(
  SliderActiveFrame,
  function SliderActive(
    props: GetProps<typeof SliderActiveFrame> & { theme?: ThemeProps['name'] },
    ref
  ) {
    const { theme, ...activeProps } = props
    return (
      <Theme name={theme ?? 'SliderActive'}>
        <SliderActiveFrame {...activeProps} ref={ref} />
      </Theme>
    )
  },
  { disableTheme: true }
)

export const SliderThumbFrame = styled(UiSlider.Thumb, {
  name: 'SliderThumb',
  borderWidth: 2,
  borderColor: 'border-color hover:border-color-hover press:border-color-press',
  backgroundColor: 'background hover:background-hover press:background-press',
  outlineStyle: 'focus-visible:solid',
  outlineWidth: 'focus-visible:2px',
  outlineColor: 'focus-visible:outline-color',
})

export const SliderThumb = createStyledHOC(
  SliderThumbFrame,
  function SliderThumb(
    props: GetProps<typeof SliderThumbFrame> & { theme?: ThemeProps['name'] },
    ref
  ) {
    const { theme, ...thumbProps } = props
    return (
      <Theme name={theme ?? 'SliderThumb'}>
        <SliderThumbFrame {...thumbProps} ref={ref} />
      </Theme>
    )
  },
  { disableTheme: true }
)

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
