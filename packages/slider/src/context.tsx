import { SizeTokens } from '@tamagui/core'
import { createContextScope } from '@tamagui/create-context'

import { SliderContextValue } from './types'

export const SLIDER_NAME = 'Slider'

export const [createSliderContext, createSliderScope] = createContextScope(SLIDER_NAME)

export const [SliderProvider, useSliderContext] =
  createSliderContext<SliderContextValue>(SLIDER_NAME)

export const [SliderOrientationProvider, useSliderOrientationContext] = createSliderContext<{
  startEdge: 'bottom' | 'left' | 'right'
  endEdge: 'top' | 'right' | 'left'
  sizeProp: 'width' | 'height'
  size: number | SizeTokens
  direction: number
}>(SLIDER_NAME, {
  startEdge: 'left',
  endEdge: 'right',
  sizeProp: 'width',
  size: 0,
  direction: 1,
})
