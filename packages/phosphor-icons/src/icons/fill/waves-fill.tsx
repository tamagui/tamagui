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
      <_Path d="M33.7,77A8,8,0,0,1,35,65.8,81.8,81.8,0,0,1,64.1,52.2c16.1-4,41.1-5,68.3,13.1,42.4,28.3,77.2,1.6,78.6.4A8.2,8.2,0,0,1,222.3,67,8,8,0,0,1,221,78.2a81.8,81.8,0,0,1-29.1,13.6,81,81,0,0,1-19.7,2.4c-14,0-30.8-3.7-48.6-15.5C81.2,50.4,46.4,77.1,45,78.3A8.2,8.2,0,0,1,33.7,77ZM211,121.7c-1.4,1.2-36.2,27.9-78.6-.4-27.2-18.1-52.2-17.1-68.3-13.1A81.8,81.8,0,0,0,35,121.8,8,8,0,0,0,33.7,133,8.2,8.2,0,0,0,45,134.3c1.4-1.2,36.2-27.9,78.6.4,17.8,11.8,34.6,15.5,48.6,15.5a81,81,0,0,0,19.7-2.4A81.8,81.8,0,0,0,221,134.2a8,8,0,0,0,1.3-11.2A8.2,8.2,0,0,0,211,121.7Zm0,56c-1.4,1.2-36.2,27.9-78.6-.4-27.2-18.1-52.2-17.1-68.3-13.1A81.8,81.8,0,0,0,35,177.8,8,8,0,0,0,33.7,189,8.2,8.2,0,0,0,45,190.3c1.4-1.2,36.2-27.9,78.6.4,17.8,11.8,34.6,15.5,48.6,15.5a82.6,82.6,0,0,0,48.8-16,8,8,0,0,0,1.3-11.2A8.2,8.2,0,0,0,211,177.7Z" />
    </_Svg>
  )
}

Icon.displayName = 'WavesFill'

export const WavesFill = memo<IconProps>(themed(Icon))
