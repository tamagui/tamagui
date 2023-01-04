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
      <_Path d="M48,56V200a8,8,0,0,1-16,0V56a8,8,0,0,1,16,0Zm84,54.5L112,117V96a8,8,0,0,0-16,0v21l-20-6.5a7.8,7.8,0,0,0-10,5.1,7.9,7.9,0,0,0,5.1,10.1l20,6.5-12.4,17a8,8,0,0,0,1.8,11.2,8.1,8.1,0,0,0,11.2-1.8l12.3-17,12.3,17a8.1,8.1,0,0,0,11.2,1.8,8,8,0,0,0,1.8-11.2l-12.4-17,20-6.5a7.9,7.9,0,0,0,5.1-10.1A7.8,7.8,0,0,0,132,110.5Zm106,5.1a7.8,7.8,0,0,0-10-5.1L208,117V96a8,8,0,0,0-16,0v21l-20-6.5a7.8,7.8,0,0,0-10,5.1,7.9,7.9,0,0,0,5.1,10.1l20,6.5-12.4,17a8,8,0,0,0,1.8,11.2,8.1,8.1,0,0,0,11.2-1.8l12.3-17,12.3,17a8.1,8.1,0,0,0,11.2,1.8,8,8,0,0,0,1.8-11.2l-12.4-17,20-6.5A7.9,7.9,0,0,0,238,115.6Z" />
    </_Svg>
  )
}

Icon.displayName = 'PasswordFill'

export const PasswordFill = memo<IconProps>(themed(Icon))
