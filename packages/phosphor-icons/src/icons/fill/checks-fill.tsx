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
      <_Path d="M153.7,89.7l-88,88a8.2,8.2,0,0,1-11.4,0l-44-44a8.1,8.1,0,0,1,11.4-11.4L60,160.7l82.3-82.4a8.1,8.1,0,0,1,11.4,11.4Zm92-11.4a8.1,8.1,0,0,0-11.4,0L152,160.7,134.3,143A8,8,0,0,0,123,154.3l23.3,23.4a8.2,8.2,0,0,0,11.4,0l88-88A8.1,8.1,0,0,0,245.7,78.3Z" />
    </_Svg>
  )
}

Icon.displayName = 'ChecksFill'

export const ChecksFill = memo<IconProps>(themed(Icon))
