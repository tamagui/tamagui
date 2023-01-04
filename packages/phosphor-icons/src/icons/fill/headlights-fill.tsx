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
      <_Path d="M160,80a8,8,0,0,1,8-8h72a8,8,0,0,1,0,16H168A8,8,0,0,1,160,80Zm80,88H168a8,8,0,0,0,0,16h72a8,8,0,0,0,0-16Zm0-64H168a8,8,0,0,0,0,16h72a8,8,0,0,0,0-16Zm0,32H168a8,8,0,0,0,0,16h72a8,8,0,0,0,0-16ZM128,48H88.9C44.6,48,8.3,83.6,8,127.4A79.9,79.9,0,0,0,88,208h40a16,16,0,0,0,16-16V64A16,16,0,0,0,128,48Z" />
    </_Svg>
  )
}

Icon.displayName = 'HeadlightsFill'

export const HeadlightsFill = memo<IconProps>(themed(Icon))
