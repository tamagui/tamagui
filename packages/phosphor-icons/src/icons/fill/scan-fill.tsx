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
      <_Path d="M224,40V80a8,8,0,0,1-16,0V48H176a8,8,0,0,1,0-16h40A8,8,0,0,1,224,40ZM80,208H48V176a8,8,0,0,0-16,0v40a8,8,0,0,0,8,8H80a8,8,0,0,0,0-16Zm136-40a8,8,0,0,0-8,8v32H176a8,8,0,0,0,0,16h40a8,8,0,0,0,8-8V176A8,8,0,0,0,216,168ZM40,88a8,8,0,0,0,8-8V48H80a8,8,0,0,0,0-16H40a8,8,0,0,0-8,8V80A8,8,0,0,0,40,88Zm144,80V88a16,16,0,0,0-16-16H88A16,16,0,0,0,72,88v80a16,16,0,0,0,16,16h80A16,16,0,0,0,184,168Z" />
    </_Svg>
  )
}

Icon.displayName = 'ScanFill'

export const ScanFill = memo<IconProps>(themed(Icon))
