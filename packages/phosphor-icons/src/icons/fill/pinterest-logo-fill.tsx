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
      <_Path d="M232,131.2c-1.7,54.5-45.8,98.9-100.3,100.7a103.7,103.7,0,0,1-28.6-2.9,4.1,4.1,0,0,1-2.9-4.9l8.9-35.4A50.5,50.5,0,0,0,136,196c37,0,66.7-33.5,63.8-73.4-2.6-35.9-32-64.6-68-66.5A72,72,0,0,0,56,128a73.3,73.3,0,0,0,5.2,27,8,8,0,0,0,14.9-6A55.5,55.5,0,0,1,72,128.9a56,56,0,1,1,112-.9c0,28.7-21.5,52-48,52-10.5,0-17.8-3.7-22.8-8l14.6-58.1a8,8,0,1,0-15.6-3.8L85.4,217.5a4,4,0,0,1-5.7,2.6A104,104,0,1,1,232,131.2Z" />
    </_Svg>
  )
}

Icon.displayName = 'PinterestLogoFill'

export const PinterestLogoFill = memo<IconProps>(themed(Icon))
