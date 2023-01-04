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
      <_Path d="M136,32V64a8,8,0,0,1-16,0V32a8,8,0,0,1,16,0Zm37.3,58.7a7.8,7.8,0,0,0,5.6-2.3l22.6-22.6a8,8,0,1,0-11.3-11.3L167.6,77.1a8,8,0,0,0,0,11.3A7.8,7.8,0,0,0,173.3,90.7ZM224,120H192a8,8,0,0,0,0,16h32a8,8,0,0,0,0-16Zm-45.1,47.6a8,8,0,0,0-11.3,11.3l22.6,22.6a8,8,0,0,0,5.7,2.4,7.7,7.7,0,0,0,5.6-2.4,7.9,7.9,0,0,0,0-11.3ZM128,184a8,8,0,0,0-8,8v32a8,8,0,0,0,16,0V192A8,8,0,0,0,128,184ZM77.1,167.6,54.5,190.2a7.9,7.9,0,0,0,0,11.3,7.7,7.7,0,0,0,5.6,2.4,8,8,0,0,0,5.7-2.4l22.6-22.6a8,8,0,0,0-11.3-11.3ZM72,128a8,8,0,0,0-8-8H32a8,8,0,0,0,0,16H64A8,8,0,0,0,72,128ZM65.8,54.5A8,8,0,0,0,54.5,65.8L77.1,88.4a8.1,8.1,0,0,0,11.3,0,8,8,0,0,0,0-11.3Z" />
    </_Svg>
  )
}

Icon.displayName = 'SpinnerFill'

export const SpinnerFill = memo<IconProps>(themed(Icon))
