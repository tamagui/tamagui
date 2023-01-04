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
      <_Path d="M221,175.9c-5.9-10.2-13-29.6-13-63.9v-7.1c0-44.3-35.6-80.6-79.4-80.9H128a79.9,79.9,0,0,0-80,80v8c0,34.3-7.1,53.7-13,63.9a15.8,15.8,0,0,0-.1,16.1,15.9,15.9,0,0,0,13.9,8H207.2a15.9,15.9,0,0,0,13.9-8A15.8,15.8,0,0,0,221,175.9Z" />
      <_Path d="M159.9,216h-64a8,8,0,1,0,0,16h64a8,8,0,0,0,0-16Z" />
    </_Svg>
  )
}

Icon.displayName = 'BellSimpleFill'

export const BellSimpleFill = memo<IconProps>(themed(Icon))
