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
      <_Path d="M160,112a24,24,0,1,1-24-24A24.1,24.1,0,0,1,160,112Zm64-72V216a16,16,0,0,1-16,16H64a16,16,0,0,1-16-16V196H32a8,8,0,0,1,0-16H48V156H32a8,8,0,0,1,0-16H48V116H32a8,8,0,0,1,0-16H48V76H32a8,8,0,0,1,0-16H48V40A16,16,0,0,1,64,24H208A16,16,0,0,1,224,40ZM190.4,163.2A67.8,67.8,0,0,0,163,141.5a40,40,0,1,0-54,0,67.8,67.8,0,0,0-27.4,21.7,8,8,0,0,0,1.6,11.2A7.7,7.7,0,0,0,88,176a8,8,0,0,0,6.4-3.2,52,52,0,0,1,83.2,0,8.1,8.1,0,0,0,11.2,1.6A8,8,0,0,0,190.4,163.2Z" />
    </_Svg>
  )
}

Icon.displayName = 'AddressBookFill'

export const AddressBookFill = memo<IconProps>(themed(Icon))
