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
      <_Path d="M128,16a96.2,96.2,0,0,0-96,96c0,24,12.6,55.1,33.6,83s44.5,45,62.4,45,41.2-16.8,62.4-45S224,136,224,112A96.2,96.2,0,0,0,128,16ZM64,116v-4a12,12,0,0,1,12-12,36,36,0,0,1,36,36v4a12,12,0,0,1-12,12A36,36,0,0,1,64,116Zm80,84H112a8,8,0,0,1,0-16h32a8,8,0,0,1,0,16Zm48-84a36,36,0,0,1-36,36,12,12,0,0,1-12-12v-4a36,36,0,0,1,36-36,12,12,0,0,1,12,12Z" />
    </_Svg>
  )
}

Icon.displayName = 'AlienFill'

export const AlienFill = memo<IconProps>(themed(Icon))
