// Styled Slider = the unstyled @tamagui/ui Slider behavior + the default v2-look
// skin (track color, fill color, thumb border/background) and the size table.
// The behavior frames keep fill/clip/positioning and the thumb math. Single skin
// definition; the shadcn registry item is generated from this file.
import {
  createRefComponent,
  createStyledContext,
  styled,
  type TamaguiElement,
  withStaticProperties,
} from '@tamagui/core'
import { Slider as UiSlider } from '@tamagui/slider'
import type * as React from 'react'

export type SliderSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | boolean

// the track is composed below the root, so it never sees the root's orientation
// prop: the root republishes size + orientation here for the track resolver
const SliderSizeContext = createStyledContext<{
  size?: SliderSize
  orientation?: 'horizontal' | 'vertical'
}>({ size: 'md', orientation: 'horizontal' })

const resolveSliderSize = (size: unknown): keyof typeof sliderThumbSize =>
  typeof size === 'string' && size in sliderThumbSize
    ? (size as keyof typeof sliderThumbSize)
    : 'md'

// the thumb is a line-height tall circle
const sliderThumbSize = {
  xs: { width: 16, height: 16, minWidth: 16, minHeight: 16 },
  sm: { width: 20, height: 20, minWidth: 20, minHeight: 20 },
  md: { width: 20, height: 20, minWidth: 20, minHeight: 20 },
  lg: { width: 24, height: 24, minWidth: 24, minHeight: 24 },
  xl: { width: 28, height: 28, minWidth: 28, minHeight: 28 },
} as const

// the track is a thin bar: the control height over six, rounded
const sliderTrackSize = {
  xs: 4,
  sm: 5,
  md: 6,
  lg: 7,
  xl: 8,
} as const

export const SliderTrackFrame = styled(UiSlider.Track, {
  displayName: 'SliderTrack',
  context: SliderSizeContext,
  backgroundColor: 'background-press',
  borderRadius: 100_000,
}).resolve((props) => {
  const size = props.size as SliderSize | undefined
  if (size == null || size === false) return
  const thickness = sliderTrackSize[resolveSliderSize(size)]
  if (props.orientation === 'vertical') {
    return {
      width: thickness,
      borderRadius: thickness,
    }
  }
  return {
    height: thickness,
    borderRadius: thickness,
  }
})

export const SliderTrack = SliderTrackFrame

export const SliderActiveFrame = styled(UiSlider.TrackActive, {
  displayName: 'SliderTrackActive',
  backgroundColor: 'color',
  borderRadius: 100_000,
})

export const SliderActive = SliderActiveFrame

export const SliderThumbFrame = styled(UiSlider.Thumb, {
  displayName: 'SliderThumb',
  context: SliderSizeContext,
  borderWidth: 2,
  borderColor: 'border-color hover:border-color-hover press:border-color-press',
  backgroundColor: 'background hover:background-hover press:background-press',
  outlineStyle: 'focus-visible:solid',
  outlineWidth: 'focus-visible:2px',
  outlineColor: 'focus-visible:outline-color',
  variants: {
    size: {
      ...sliderThumbSize,
      true: sliderThumbSize.md,
    },
  } as const,
  defaultVariants: {
    size: 'md',
  },
})

export const SliderThumb = SliderThumbFrame

// see Dialog.tsx: withStaticProperties assigns in place, so composing onto UiSlider
// would rewrite @tamagui/ui's own Slider.Track/.TrackActive/.Thumb for every consumer
// of the unstyled package.
const SliderRoot = createRefComponent<
  TamaguiElement,
  React.ComponentProps<typeof UiSlider>
>(function Slider(props, ref) {
  return (
    <SliderSizeContext.Provider
      size={resolveSliderSize(props.size)}
      orientation={props.orientation ?? 'horizontal'}
    >
      <UiSlider
        {...props}
        // the behavior thumb positions itself by px before its first layout
        size={sliderThumbSize[resolveSliderSize(props.size)].width}
        ref={ref}
      />
    </SliderSizeContext.Provider>
  )
})

export const Slider = withStaticProperties(SliderRoot, {
  Track: SliderTrack,
  TrackActive: SliderActive,
  Thumb: SliderThumb,
})
