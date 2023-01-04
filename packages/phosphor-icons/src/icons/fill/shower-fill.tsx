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
      <_Path d="M72,228a12,12,0,1,1-12-12A12,12,0,0,1,72,228Zm16-40a12,12,0,1,0,12,12A12,12,0,0,0,88,188Zm-60-4a12,12,0,1,0,12,12A12,12,0,0,0,28,184Zm40-16a12,12,0,1,0-12,12A12,12,0,0,0,68,168ZM248,32H219.3A15.9,15.9,0,0,0,208,36.7L180.2,64.5,54,85.6A15.7,15.7,0,0,0,41.4,96.5a16,16,0,0,0,3.9,16.1l98.1,98.1a16,16,0,0,0,11.2,4.7,16.2,16.2,0,0,0,4.9-.8A15.7,15.7,0,0,0,170.4,202L191.5,75.8h0L219.3,48H248a8,8,0,0,0,0-16Z" />
    </_Svg>
  )
}

Icon.displayName = 'ShowerFill'

export const ShowerFill = memo<IconProps>(themed(Icon))
