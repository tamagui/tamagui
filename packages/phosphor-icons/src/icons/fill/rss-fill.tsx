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
      <_Path d="M98.9,157.1A71.6,71.6,0,0,1,120,208a8,8,0,0,1-16,0,56,56,0,0,0-56-56,8,8,0,0,1,0-16A71.6,71.6,0,0,1,98.9,157.1ZM48,88a8,8,0,0,0,0,16,102.9,102.9,0,0,1,73.5,30.5A102.9,102.9,0,0,1,152,208a8,8,0,0,0,16,0,119.2,119.2,0,0,0-35.2-84.9A119.3,119.3,0,0,0,48,88Zm118.8,1.2A166.9,166.9,0,0,0,48,40a8,8,0,0,0,0,16,151.1,151.1,0,0,1,107.5,44.5A151.1,151.1,0,0,1,200,208a8,8,0,0,0,16,0A166.9,166.9,0,0,0,166.8,89.2ZM52,192a12,12,0,1,0,12,12A12,12,0,0,0,52,192Z" />
    </_Svg>
  )
}

Icon.displayName = 'RssFill'

export const RssFill = memo<IconProps>(themed(Icon))
