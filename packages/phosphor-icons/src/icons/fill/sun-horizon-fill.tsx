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
      <_Path d="M77.7,43.6a8.1,8.1,0,0,1,4.4-10.5,7.9,7.9,0,0,1,10.4,4.4l7.7,18.4a8.1,8.1,0,0,1-4.3,10.5,8.5,8.5,0,0,1-3.1.6,8.2,8.2,0,0,1-7.4-4.9ZM21.5,108.5l18.4,7.7a8.5,8.5,0,0,0,3.1.6,8,8,0,0,0,3.1-15.4L27.6,93.7a8.1,8.1,0,0,0-10.5,4.4A7.9,7.9,0,0,0,21.5,108.5ZM213,116.8a8.5,8.5,0,0,0,3.1-.6l18.4-7.7a7.9,7.9,0,0,0,4.4-10.4,8.1,8.1,0,0,0-10.5-4.4l-18.5,7.7a8,8,0,0,0,3.1,15.4ZM160.1,66.4a8.5,8.5,0,0,0,3.1.6,8.2,8.2,0,0,0,7.4-4.9l7.7-18.5a8.1,8.1,0,0,0-4.4-10.5,7.9,7.9,0,0,0-10.4,4.4l-7.7,18.4A8.1,8.1,0,0,0,160.1,66.4ZM240,152H195.5a70.1,70.1,0,0,0,.5-8,68,68,0,0,0-136,0,70.1,70.1,0,0,0,.5,8H16a8,8,0,0,0,0,16H240a8,8,0,0,0,0-16Zm-32,40H48a8,8,0,0,0,0,16H208a8,8,0,0,0,0-16Z" />
    </_Svg>
  )
}

Icon.displayName = 'SunHorizonFill'

export const SunHorizonFill = memo<IconProps>(themed(Icon))
