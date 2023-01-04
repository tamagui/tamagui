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
      <_Path d="M80,56V48A16,16,0,0,1,96,32h8a8,8,0,0,1,0,16H96v8a8,8,0,0,1-16,0Zm64-8h16a8,8,0,0,0,0-16H144a8,8,0,0,0,0,16Zm64-16h-8a8,8,0,0,0,0,16h8v8a8,8,0,0,0,16,0V48A16,16,0,0,0,208,32Zm8,56a8,8,0,0,0-8,8v16a8,8,0,0,0,16,0V96A8,8,0,0,0,216,88Zm-40,8V208a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V96A16,16,0,0,1,48,80H160A16,16,0,0,1,176,96Zm-16,0H48V208H160Zm56,48a8,8,0,0,0-8,8v8h-8a8,8,0,0,0,0,16h8a16,16,0,0,0,16-16v-8A8,8,0,0,0,216,144Z" />
    </_Svg>
  )
}

Icon.displayName = 'SelectionBackgroundFill'

export const SelectionBackgroundFill = memo<IconProps>(themed(Icon))
