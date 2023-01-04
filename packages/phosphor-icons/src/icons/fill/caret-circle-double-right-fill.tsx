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
      <_Path d="M201.5,54.5a104,104,0,1,0,0,147A103.9,103.9,0,0,0,201.5,54.5Zm-75.8,79.2-32,32a8.2,8.2,0,0,1-11.4,0,8.1,8.1,0,0,1,0-11.4L108.7,128,82.3,101.7A8.1,8.1,0,0,1,93.7,90.3l32,32A8.1,8.1,0,0,1,125.7,133.7Zm56,0-32,32a8.2,8.2,0,0,1-11.4,0,8.1,8.1,0,0,1,0-11.4L164.7,128l-26.4-26.3a8.1,8.1,0,0,1,11.4-11.4l32,32A8.1,8.1,0,0,1,181.7,133.7Z" />
    </_Svg>
  )
}

Icon.displayName = 'CaretCircleDoubleRightFill'

export const CaretCircleDoubleRightFill = memo<IconProps>(themed(Icon))
