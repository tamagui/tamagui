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
      <_Path d="M208,40H48A16,16,0,0,0,32,56v58.7c0,89.4,75.8,119.1,91,124.1a14.3,14.3,0,0,0,10,0c15.2-5,91-34.7,91-124.1V56A16,16,0,0,0,208,40Zm-39.5,91.2-27.6,9L158,163.7a7.9,7.9,0,0,1-1.8,11.1,7.6,7.6,0,0,1-4.7,1.6,8.2,8.2,0,0,1-6.5-3.3l-17-23.5-17,23.5a8.2,8.2,0,0,1-6.5,3.3,7.6,7.6,0,0,1-4.7-1.6A7.9,7.9,0,0,1,98,163.7l17.1-23.5-27.6-9a8,8,0,0,1-5.2-10A8.1,8.1,0,0,1,92.4,116l27.6,9V96a8,8,0,0,1,16,0v29l27.6-9a8.1,8.1,0,0,1,10.1,5.2A8,8,0,0,1,168.5,131.2Z" />
    </_Svg>
  )
}

Icon.displayName = 'ShieldStarFill'

export const ShieldStarFill = memo<IconProps>(themed(Icon))
