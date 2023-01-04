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
      <_Circle cx="128" cy="96" r="80" />
      <_Path d="M207.2,175.2a8,8,0,0,0-11.3-11.3A96,96,0,0,1,60.1,28.1,8,8,0,1,0,48.8,16.8,112,112,0,0,0,120,207.7V224H96a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16H136V207.7A111.6,111.6,0,0,0,207.2,175.2Z" />
    </_Svg>
  )
}

Icon.displayName = 'GlobeStandFill'

export const GlobeStandFill = memo<IconProps>(themed(Icon))
