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
      <_Path d="M54.5,54.5a104,104,0,1,0,147,0A103.9,103.9,0,0,0,54.5,54.5Zm99.8,83.8a8.1,8.1,0,0,1,11.4,0,8.2,8.2,0,0,1,0,11.4l-32,32a8.1,8.1,0,0,1-11.4,0l-32-32a8.1,8.1,0,0,1,11.4-11.4L128,164.7Zm0-56a8.1,8.1,0,0,1,11.4,0,8.2,8.2,0,0,1,0,11.4l-32,32a8.1,8.1,0,0,1-11.4,0l-32-32a8.1,8.1,0,0,1,11.4-11.4L128,108.7Z" />
    </_Svg>
  )
}

Icon.displayName = 'CaretCircleDoubleDownFill'

export const CaretCircleDoubleDownFill = memo<IconProps>(themed(Icon))
