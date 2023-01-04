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
      <_Path d="M128,76a44,44,0,1,1-44,44A44,44,0,0,1,128,76Zm48-12h48a8,8,0,0,0,0-16H176a8,8,0,0,0,0,16Zm39.9,24.5A7.9,7.9,0,0,0,211,98.7a88,88,0,0,1-17.2,87.7,81.3,81.3,0,0,0-24.5-23,59.7,59.7,0,0,1-82.6,0,81.3,81.3,0,0,0-24.5,23A88,88,0,0,1,128,40a92,92,0,0,1,13.9,1.1,8,8,0,0,0,2.5-15.8A99.8,99.8,0,0,0,128,24,104,104,0,0,0,57.8,204.7l1.3,1.2a104,104,0,0,0,137.8,0l1.3-1.2A104.2,104.2,0,0,0,226.1,93.3,8,8,0,0,0,215.9,88.5Z" />
    </_Svg>
  )
}

Icon.displayName = 'UserCircleMinusFill'

export const UserCircleMinusFill = memo<IconProps>(themed(Icon))
