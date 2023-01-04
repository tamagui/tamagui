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
      <_Path d="M224,128a8,8,0,0,1-8,8H120a8,8,0,0,1,0-16h96A8,8,0,0,1,224,128ZM120,72h96a8,8,0,0,0,0-16H120a8,8,0,0,0,0,16Zm96,112H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16ZM72,144a8.5,8.5,0,0,0,3.1-.6A8,8,0,0,0,80,136V56a8,8,0,0,0-4.9-7.4,8.4,8.4,0,0,0-8.8,1.7l-40,40a8.1,8.1,0,0,0,0,11.4l40,40A8.3,8.3,0,0,0,72,144Z" />
    </_Svg>
  )
}

Icon.displayName = 'TextOutdentFill'

export const TextOutdentFill = memo<IconProps>(themed(Icon))
