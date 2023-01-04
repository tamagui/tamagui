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
      <_Path d="M220.8,175.9c-5.9-10.2-13-29.6-13-63.9v-7.1c0-44.3-35.5-80.6-79.2-80.9H128a79.9,79.9,0,0,0-79.8,80v8c0,34.3-7.1,53.7-13,63.9A16,16,0,0,0,49,200H88a40,40,0,0,0,80,0h39a15.9,15.9,0,0,0,13.9-8A16.2,16.2,0,0,0,220.8,175.9ZM128,224a24.1,24.1,0,0,1-24-24h48A24.1,24.1,0,0,1,128,224Z" />
    </_Svg>
  )
}

Icon.displayName = 'BellFill'

export const BellFill = memo<IconProps>(themed(Icon))
