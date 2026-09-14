import { createStyledContext, type SizeTokens } from '@tamagui/core'

import type { Direction, SliderContextValue } from './types'

export const SLIDER_NAME = 'Slider'

const sliderContextKeys = ['size', 'min', 'max', 'orientation'] as const

export const SliderContext = createStyledContext<
  SliderContextValue,
  (typeof sliderContextKeys)[number]
>(
  {
    size: true,
    min: 0,
    max: 100,
    orientation: 'horizontal',
  } as SliderContextValue,
  {
    keys: sliderContextKeys,
  }
)

export const { Provider: SliderProvider, useStyledContext: useSliderContext } =
  SliderContext

export const {
  Provider: SliderOrientationProvider,
  useStyledContext: useSliderOrientationContext,
} = createStyledContext<{
  startEdge: 'bottom' | 'left' | 'right'
  endEdge: 'top' | 'right' | 'left'
  sizeProp: 'width' | 'height'
  size: number | SizeTokens
  direction: number
}>({
  startEdge: 'left',
  endEdge: 'right',
  sizeProp: 'width',
  size: 0,
  direction: 1,
})

export const PAGE_KEYS = ['PageUp', 'PageDown']
export const ARROW_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
export const BACK_KEYS: Record<Direction, string[]> = {
  ltr: ['ArrowDown', 'Home', 'ArrowLeft', 'PageDown'],
  rtl: ['ArrowDown', 'Home', 'ArrowRight', 'PageDown'],
}
