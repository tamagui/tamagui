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
      <_Path d="M192,88a64,64,0,1,0-64,64,65.1,65.1,0,0,0,19.4-3l-42.5,70.9a8,8,0,0,0,2.7,11,8.7,8.7,0,0,0,4.1,1.1,8,8,0,0,0,6.9-3.9l64.7-108A63.5,63.5,0,0,0,192,88ZM80,88a48,48,0,1,1,48,48A48,48,0,0,1,80,88Z" />
    </_Svg>
  )
}

Icon.displayName = 'NumberNineFill'

export const NumberNineFill = memo<IconProps>(themed(Icon))
