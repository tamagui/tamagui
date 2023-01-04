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
      <_Path d="M178,200.7c-25.1,0-40.7-33.7-57.3-69.3-13-28.2-27.8-60.1-42.7-60.1s-36.3,37.6-46.7,60.1a8.1,8.1,0,1,1-14.6-6.8C38.7,77.4,58.1,55.3,78,55.3c25.1,0,40.7,33.7,57.3,69.3,13,28.2,27.8,60.1,42.7,60.1,16.4,0,36.3-37.6,46.7-60.1a8.1,8.1,0,0,1,14.6,6.8C217.3,178.6,197.9,200.7,178,200.7Z" />
    </_Svg>
  )
}

Icon.displayName = 'WaveSineFill'

export const WaveSineFill = memo<IconProps>(themed(Icon))
