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
      <_Path d="M176,16H80A24.1,24.1,0,0,0,56,40V216a24.1,24.1,0,0,0,24,24h96a24.1,24.1,0,0,0,24-24V40A24.1,24.1,0,0,0,176,16ZM160,64H96a8,8,0,0,1,0-16h64a8,8,0,0,1,0,16Z" />
    </_Svg>
  )
}

Icon.displayName = 'DeviceMobileSpeakerFill'

export const DeviceMobileSpeakerFill = memo<IconProps>(themed(Icon))
