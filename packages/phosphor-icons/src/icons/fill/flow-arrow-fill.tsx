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
      <_Path d="M245.7,85.7l-40,40a8.2,8.2,0,0,1-11.4,0,8.1,8.1,0,0,1,0-11.4L220.7,88H176a40,40,0,0,0-40,40,56,56,0,0,1-56,56h-.9a36,36,0,1,1,0-16H80a40,40,0,0,0,40-40,56,56,0,0,1,56-56h44.7L194.3,45.7a8.1,8.1,0,0,1,11.4-11.4l40,40A8.1,8.1,0,0,1,245.7,85.7Z" />
    </_Svg>
  )
}

Icon.displayName = 'FlowArrowFill'

export const FlowArrowFill = memo<IconProps>(themed(Icon))
