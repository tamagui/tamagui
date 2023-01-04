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
      <_Path d="M224,88H175.4l8.5-46.6a8,8,0,0,0-15.8-2.8l-9,49.4H111.4l8.5-46.6a8,8,0,1,0-15.8-2.8L95.1,88H43.6a8,8,0,1,0,0,16H92.2l-8.7,48H32a8,8,0,0,0,0,16H80.6l-8.5,46.6a8,8,0,0,0,6.5,9.3H80a8,8,0,0,0,7.9-6.6l9-49.4h47.7l-8.5,46.6a8,8,0,0,0,6.5,9.3H144a8,8,0,0,0,7.9-6.6l9-49.4h51.5a8,8,0,0,0,0-16H163.8l8.7-48H224a8,8,0,0,0,0-16Zm-76.5,64H99.8l8.7-48h47.7Z" />
    </_Svg>
  )
}

Icon.displayName = 'HashFill'

export const HashFill = memo<IconProps>(themed(Icon))
