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
      <_Path d="M237.7,86.3l-60-60a8.1,8.1,0,0,0-11.4,0L62.4,130.3h0l-26.1,26a44.8,44.8,0,0,0,63.4,63.4l77.9-78h0L212.3,107l22.2-7.4a8.2,8.2,0,0,0,5.3-5.8A8.3,8.3,0,0,0,237.7,86.3Zm-32.2,6.1a9.4,9.4,0,0,0-3.2,1.9l-35.6,35.6c-2.1,1.6-17.9,11.6-43.1-1.1-11-5.5-20.8-7.6-29.2-7.9L172,43.3l45.2,45.2Z" />
    </_Svg>
  )
}

Icon.displayName = 'TestTubeFill'

export const TestTubeFill = memo<IconProps>(themed(Icon))
