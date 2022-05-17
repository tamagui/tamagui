import { createContextScope } from '@tamagui/create-context'

import { SliderContextValue } from './types'

export const SLIDER_NAME = 'Slider'

export const [createSliderContext, createSliderScope] = createContextScope(SLIDER_NAME)

export const [SliderProvider, useSliderContext] =
  createSliderContext<SliderContextValue>(SLIDER_NAME)

export const [SliderOrientationProvider, useSliderOrientationContext] = createSliderContext<{
  startEdge: 'bottom' | 'left' | 'right'
  endEdge: 'top' | 'right' | 'left'
  size: 'width' | 'height'
  direction: number
}>(SLIDER_NAME, {
  startEdge: 'left',
  endEdge: 'right',
  size: 'width',
  direction: 1,
})
