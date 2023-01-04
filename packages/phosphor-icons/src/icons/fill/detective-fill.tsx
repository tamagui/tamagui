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
      <_Path d="M216,180a36,36,0,0,1-71.1,8H111.1a36,36,0,1,1,0-16h33.8a36,36,0,0,1,71.1,8Zm32-68H220.2L173.3,45a16.1,16.1,0,0,0-26.5.3L128,73.6,109.2,45.3A16.1,16.1,0,0,0,82.7,45L35.8,112H8a8,8,0,0,0,0,16H248a8,8,0,0,0,0-16Z" />
    </_Svg>
  )
}

Icon.displayName = 'DetectiveFill'

export const DetectiveFill = memo<IconProps>(themed(Icon))
