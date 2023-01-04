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
      <_Path d="M213.6,186.9A102.9,102.9,0,0,0,232,128a104,104,0,0,0-208,0,102.9,102.9,0,0,0,18.4,58.9l.4.8.4.4a103.9,103.9,0,0,0,169.6,0l.4-.4A3,3,0,0,0,213.6,186.9ZM216,128a87.5,87.5,0,0,1-11.6,43.7L136,123.8V40.4A88.1,88.1,0,0,1,216,128ZM120,40.4v83.4L51.6,171.7A88,88,0,0,1,120,40.4ZM60.8,184.8,120,143.4v72.2A87.9,87.9,0,0,1,60.8,184.8ZM136,215.6V143.4l59.2,41.4A87.9,87.9,0,0,1,136,215.6Z" />
    </_Svg>
  )
}

Icon.displayName = 'PeaceFill'

export const PeaceFill = memo<IconProps>(themed(Icon))
