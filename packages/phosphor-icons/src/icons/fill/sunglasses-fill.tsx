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
      <_Path d="M200,40a8,8,0,0,0,0,16,16,16,0,0,1,16,16v60H40V72A16,16,0,0,1,56,56a8,8,0,0,0,0-16A32.1,32.1,0,0,0,24,72v92a44,44,0,0,0,88,0V148h32v16a44,44,0,0,0,88,0V72A32.1,32.1,0,0,0,200,40ZM85,177a7.7,7.7,0,0,1-5.6,2.4,8,8,0,0,1-5.7-2.4L58.3,161.7a8.1,8.1,0,0,1,11.4-11.4L85,165.7A7.9,7.9,0,0,1,85,177Zm120,0a7.7,7.7,0,0,1-5.6,2.4,8,8,0,0,1-5.7-2.4l-15.4-15.3a8.1,8.1,0,0,1,11.4-11.4L205,165.7A7.9,7.9,0,0,1,205,177Z" />
    </_Svg>
  )
}

Icon.displayName = 'SunglassesFill'

export const SunglassesFill = memo<IconProps>(themed(Icon))
