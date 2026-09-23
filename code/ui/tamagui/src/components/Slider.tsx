// Styled Slider = the unstyled @tamagui/ui Slider behavior + the default v2-look
// skin (track color, fill color, thumb border/background) and the size table.
// The behavior frames keep fill/clip/positioning and the thumb math. Single skin
// definition; the shadcn registry item is generated from this file.
import {
  type ComponentSize,
  createRefComponent,
  createStyledContext,
  getConfig,
  getVariableValue,
  resolveSizing,
  type ResolvedSizing,
  type SizingEnv,
  styled,
  type TamaguiElement,
  withStaticProperties,
} from '@tamagui/core'
import { Slider as UiSlider } from '@tamagui/slider'
import type * as React from 'react'

export type SliderSize = ComponentSize | boolean

// the track is composed below the root, so it never sees the root's orientation
// prop: the root republishes size + orientation here for the track resolver
const SliderSizeContext = createStyledContext<{
  size?: SliderSize
  orientation?: 'horizontal' | 'vertical'
}>({ size: 'md', orientation: 'horizontal' })

const sliderSizing = (
  size: SliderSize | undefined,
  env?: SizingEnv
): ResolvedSizing | undefined => resolveSizing(size, env) ?? resolveSizing(undefined, env)

// the thumb is a line-height tall circle
const getSliderThumbPx = (
  sizing: ResolvedSizing | undefined,
  env?: SizingEnv
): number => {
  if (!sizing) return 20
  const conf = env?.fonts && env?.tokens ? undefined : getConfig()
  const fonts = env?.fonts ?? conf?.fontsParsed
  const font = env?.font ?? fonts?.[conf?.defaultFontToken ?? 'body']
  const lh = Number(getVariableValue(font?.lineHeight?.[sizing.fontSize]))
  return Number.isFinite(lh) ? Math.round(lh) : 20
}

// the track is a thin bar: the control height over six, rounded
const getSliderTrackThickness = (sizing: ResolvedSizing | undefined): number => {
  if (!sizing) return 6
  return Math.round(sizing.height / 6)
}

export const SliderTrackFrame = styled(UiSlider.Track, {
  displayName: 'SliderTrack',
  context: SliderSizeContext,
  backgroundColor: 'background-press',
  borderRadius: 100_000,
}).resolve((props, env) => {
  const size = props.size as SliderSize | undefined
  if (size === false) return
  const sizing = sliderSizing(size, env)
  const thickness = getSliderTrackThickness(sizing)
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

const getSliderThumbSize = styled.dynamic<SliderSize>((val, env) => {
  const sizing = resolveSizing(val, env)
  if (!sizing) return
  const side = getSliderThumbPx(sizing, env)
  return {
    width: side,
    height: side,
    minWidth: side,
    minHeight: side,
  }
})

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
    size: getSliderThumbSize,
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
  const size = props.size as SliderSize | undefined
  const sizing = sliderSizing(size)
  const thumbPx = getSliderThumbPx(sizing)
  return (
    <SliderSizeContext.Provider
      size={size ?? 'md'}
      orientation={props.orientation ?? 'horizontal'}
    >
      <UiSlider
        {...props}
        // the behavior thumb positions itself by px before its first layout
        size={thumbPx}
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
