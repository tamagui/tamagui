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
      <_Path d="M200,16a8,8,0,0,0-8,8V40H160V24a8,8,0,0,0-16,0V40H112V24a8,8,0,0,0-16,0V40H64V24a8,8,0,0,0-16,0V232a8,8,0,0,0,16,0V216H96v16a8,8,0,0,0,16,0V216h32v16a8,8,0,0,0,16,0V216h32v16a8,8,0,0,0,16,0V24A8,8,0,0,0,200,16ZM64,56H192V200H64Zm57.1,116.1-24-40a8,8,0,0,1,0-8.2l24-40a8.1,8.1,0,0,1,13.8,0l24,40a8,8,0,0,1,0,8.2l-24,40a8.1,8.1,0,0,1-13.8,0Z" />
    </_Svg>
  )
}

Icon.displayName = 'RugFill'

export const RugFill = memo<IconProps>(themed(Icon))
