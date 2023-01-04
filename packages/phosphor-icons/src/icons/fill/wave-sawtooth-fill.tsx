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
      <_Path d="M128,200a7.8,7.8,0,0,1-3.9-1,8.1,8.1,0,0,1-4.1-7V78.3L28.2,134.8a8,8,0,0,1-8.4-13.6l104-64A8,8,0,0,1,136,64V177.7l91.8-56.5a8,8,0,0,1,8.4,13.6l-104,64A7.9,7.9,0,0,1,128,200Z" />
    </_Svg>
  )
}

Icon.displayName = 'WaveSawtoothFill'

export const WaveSawtoothFill = memo<IconProps>(themed(Icon))
