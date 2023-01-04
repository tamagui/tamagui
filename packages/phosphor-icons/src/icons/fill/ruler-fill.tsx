import PropTypes from 'prop-types'
import React, { memo } from 'react'
import {
  Circle as _Circle,
  Defs as _Defs,
  Ellipse as _Ellipse,
  G as _G,
  Line as _Line,
  LinearGradient as _LinearGradient,
  Path as _Path,
  Polygon as _Polygon,
  Polyline as _Polyline,
  RadialGradient as _RadialGradient,
  Rect as _Rect,
  Stop as _Stop,
  Svg as _Svg,
  Symbol as _Symbol,
  Text as _Text,
  Use as _Use,
} from 'react-native-svg'

import { IconProps } from '../../IconProps'
import { themed } from '../../themed'

const Icon = (props) => {
  const { color = 'black', size = 24, ...otherProps } = props
  return (
    <_Svg
      viewBox="0 0 256 256"
      {...otherProps}
      height={size}
      width={size}
      fill={`${color}`}
    >
      <_Rect width="256" height="256" fill="none" />
      <_Path d="M236.7,88.4a16.6,16.6,0,0,1-5,11.3L99.3,232a15.9,15.9,0,0,1-22.6,0L24,179.3a15.9,15.9,0,0,1,0-22.6l21.9-21.9a4,4,0,0,1,5.6,0l34.8,34.9A8.5,8.5,0,0,0,92,172a8,8,0,0,0,6.1-2.8,8.3,8.3,0,0,0-.6-11.1L62.8,123.5a4,4,0,0,1,0-5.6L81.9,98.8a4,4,0,0,1,5.6,0l34.8,34.9A8.5,8.5,0,0,0,128,136a8,8,0,0,0,6.1-2.8,8.3,8.3,0,0,0-.6-11.1L98.8,87.5a4,4,0,0,1,0-5.6l19.1-19.1a4,4,0,0,1,5.6,0l34.8,34.9A8.5,8.5,0,0,0,164,100a8,8,0,0,0,6.1-2.8,8.3,8.3,0,0,0-.6-11.1L134.8,51.5a4,4,0,0,1,0-5.6L156.7,24a16.1,16.1,0,0,1,22.6,0L232,76.7A16,16,0,0,1,236.7,88.4Z" />
    </_Svg>
  )
}

Icon.displayName = 'RulerFill'

export const RulerFill = memo<IconProps>(themed(Icon))
