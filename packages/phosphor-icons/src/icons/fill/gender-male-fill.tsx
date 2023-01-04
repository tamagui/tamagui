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
      <_Path d="M216,32H168a8,8,0,0,0,0,16h28.7L154.6,90.1a80,80,0,1,0,11.3,11.3L208,59.3V88a8,8,0,0,0,16,0V40A8,8,0,0,0,216,32ZM149.3,197.3a64,64,0,1,1,0-90.6A64.3,64.3,0,0,1,149.3,197.3Z" />
    </_Svg>
  )
}

Icon.displayName = 'GenderMaleFill'

export const GenderMaleFill = memo<IconProps>(themed(Icon))
