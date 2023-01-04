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
      <_Path d="M232,80V200a16,16,0,0,1-16,16H40a16,16,0,0,1-16-16V80A16,16,0,0,1,40,64h68.7L74.3,29.7A8.1,8.1,0,0,1,85.7,18.3L128,60.7l42.3-42.4a8.1,8.1,0,0,1,11.4,11.4L147.3,64H216A16,16,0,0,1,232,80Z" />
    </_Svg>
  )
}

Icon.displayName = 'TelevisionSimpleFill'

export const TelevisionSimpleFill = memo<IconProps>(themed(Icon))
