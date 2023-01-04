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
      <_Path d="M224,40V216a8,8,0,0,1-16,0V40a8,8,0,0,1,16,0Zm-48,8H80A16,16,0,0,0,64,64v40a16,16,0,0,0,16,16h96a16,16,0,0,0,16-16V64A16,16,0,0,0,176,48Zm0,88H40a16,16,0,0,0-16,16v40a16,16,0,0,0,16,16H176a16,16,0,0,0,16-16V152A16,16,0,0,0,176,136Z" />
    </_Svg>
  )
}

Icon.displayName = 'AlignRightFill'

export const AlignRightFill = memo<IconProps>(themed(Icon))
