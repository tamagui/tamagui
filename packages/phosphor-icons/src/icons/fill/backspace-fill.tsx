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
      <_Path d="M216,40H68.5a16.2,16.2,0,0,0-13.7,7.8L9.1,123.9a8,8,0,0,0,0,8.2l45.7,76.1h0A16.1,16.1,0,0,0,68.5,216H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM165.7,146.3a8.1,8.1,0,0,1,0,11.4A8.5,8.5,0,0,1,160,160a8.3,8.3,0,0,1-5.7-2.3L136,139.3l-18.3,18.4A8.5,8.5,0,0,1,112,160a8.3,8.3,0,0,1-5.7-2.3,8.1,8.1,0,0,1,0-11.4L124.7,128l-18.4-18.3a8.1,8.1,0,0,1,11.4-11.4L136,116.7l18.3-18.4a8.1,8.1,0,0,1,11.4,11.4L147.3,128Z" />
    </_Svg>
  )
}

Icon.displayName = 'BackspaceFill'

export const BackspaceFill = memo<IconProps>(themed(Icon))
