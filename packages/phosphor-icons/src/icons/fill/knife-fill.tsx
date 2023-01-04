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
      <_Path d="M231.8,32.2a28.1,28.1,0,0,0-39.7.1L18.3,210.4a8,8,0,0,0,3.9,13.4,154.1,154.1,0,0,0,35,4c33.4,0,66.8-10.9,98.3-32.2a232,232,0,0,0,50.9-46.8,8.1,8.1,0,0,0-.7-10.5l-18.8-18.7,45-47.9A28,28,0,0,0,231.8,32.2ZM189.2,144.5a227,227,0,0,1-43.1,38.2c-34.5,23.2-70,32.6-105.8,28.1L146.6,101.9l23.3,23.3c.1.1.2.3.4.4h.1Z" />
    </_Svg>
  )
}

Icon.displayName = 'KnifeFill'

export const KnifeFill = memo<IconProps>(themed(Icon))
