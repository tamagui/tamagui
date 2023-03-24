import { Slider as SliderDefault, withStaticProperties } from 'tamagui'

import { withController } from './withController'

const { Track, TrackActive, Thumb } = SliderDefault

export const SliderControlled = withStaticProperties(
  withController(SliderDefault, { onChange: 'onValueChange' }),
  { Track, TrackActive, Thumb }
)
