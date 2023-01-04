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
      <_Path d="M213.7,85.7l-48,48A8.3,8.3,0,0,1,160,136a8.5,8.5,0,0,1-3.1-.6A8,8,0,0,1,152,128V88H72V224a8,8,0,0,1-16,0V80a8,8,0,0,1,8-8h88V32a8,8,0,0,1,4.9-7.4,8.4,8.4,0,0,1,8.8,1.7l48,48A8.1,8.1,0,0,1,213.7,85.7Z" />
    </_Svg>
  )
}

Icon.displayName = 'ArrowElbowUpRightFill'

export const ArrowElbowUpRightFill = memo<IconProps>(themed(Icon))
