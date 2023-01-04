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
      <_Path d="M152,56V176a8,8,0,0,1-16,0V124H48v52a8,8,0,0,1-16,0V56a8,8,0,0,1,16,0v52h88V56a8,8,0,0,1,16,0Zm59.9,84a37.3,37.3,0,0,0-9.4,1.2l4.1-25.2H240a8,8,0,0,0,0-16H199.8a8,8,0,0,0-7.9,6.7l-7.8,48.2a8,8,0,0,0,13.5,7,20.1,20.1,0,0,1,14.3-5.9,19.9,19.9,0,0,1,14.2,5.9,19.8,19.8,0,0,1,0,28.2,19.9,19.9,0,0,1-14.2,5.9,20.1,20.1,0,0,1-14.3-5.9,8,8,0,1,0-11.2,11.4A36.1,36.1,0,1,0,211.9,140Z" />
    </_Svg>
  )
}

Icon.displayName = 'TextHFiveFill'

export const TextHFiveFill = memo<IconProps>(themed(Icon))
