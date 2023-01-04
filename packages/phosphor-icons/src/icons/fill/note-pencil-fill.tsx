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
      <_Path d="M224,120v88a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32h88a8,8,0,0,1,0,16H48V208H208V120a8,8,0,0,1,16,0Zm5.7-50.3-96,96A8.1,8.1,0,0,1,128,168H96a8,8,0,0,1-8-8V128a8.1,8.1,0,0,1,2.3-5.7l96-96a8.1,8.1,0,0,1,11.4,0l32,32A8.1,8.1,0,0,1,229.7,69.7Zm-17-5.7L192,43.3,179.3,56,200,76.7Z" />
    </_Svg>
  )
}

Icon.displayName = 'NotePencilFill'

export const NotePencilFill = memo<IconProps>(themed(Icon))
