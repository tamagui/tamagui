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
      <_Path d="M197.7,69.7,127.3,140l46.4,46.3a8.4,8.4,0,0,1,1.7,8.8A8,8,0,0,1,168,200H64a8,8,0,0,1-8-8V88a8,8,0,0,1,4.9-7.4,8.4,8.4,0,0,1,8.8,1.7L116,128.7l70.3-70.4a8.1,8.1,0,0,1,11.4,11.4Z" />
    </_Svg>
  )
}

Icon.displayName = 'ArrowDownLeftFill'

export const ArrowDownLeftFill = memo<IconProps>(themed(Icon))
