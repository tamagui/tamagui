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
      <_Path d="M208.4,132.8a56.9,56.9,0,0,0-11.5-4.8,56.9,56.9,0,0,0,11.5-4.8,36,36,0,0,0-36-62.4,58.7,58.7,0,0,0-9.9,7.5A58.6,58.6,0,0,0,164,56a36,36,0,0,0-72,0,58.6,58.6,0,0,0,1.5,12.3,58.7,58.7,0,0,0-9.9-7.5,36,36,0,0,0-36,62.4A56.9,56.9,0,0,0,59.1,128a56.9,56.9,0,0,0-11.5,4.8,36,36,0,0,0,36,62.4,58.7,58.7,0,0,0,9.9-7.5A58.6,58.6,0,0,0,92,200a36,36,0,0,0,72,0,58.6,58.6,0,0,0-1.5-12.3,58.7,58.7,0,0,0,9.9,7.5,36,36,0,0,0,36-62.4ZM128,152a24,24,0,1,1,24-24A24.1,24.1,0,0,1,128,152Z" />
    </_Svg>
  )
}

Icon.displayName = 'FlowerFill'

export const FlowerFill = memo<IconProps>(themed(Icon))
