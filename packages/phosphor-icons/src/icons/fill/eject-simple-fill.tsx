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
      <_Path d="M26.4,158.9a15.9,15.9,0,0,1,2-17L115.6,34.6a16,16,0,0,1,24.8,0l87.2,107.3A16,16,0,0,1,215.2,168H40.8A15.8,15.8,0,0,1,26.4,158.9ZM224,200H32a8,8,0,0,0,0,16H224a8,8,0,0,0,0-16Z" />
    </_Svg>
  )
}

Icon.displayName = 'EjectSimpleFill'

export const EjectSimpleFill = memo<IconProps>(themed(Icon))
