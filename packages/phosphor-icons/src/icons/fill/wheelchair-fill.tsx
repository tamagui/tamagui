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
      <_Path d="M247.5,185.5a8,8,0,0,0-10.1-5.1l-17.5,5.8L191,128.4a7.9,7.9,0,0,0-7.1-4.4h-80V104h56a8,8,0,0,0,0-16h-56V62.6a24,24,0,1,0-16,0V89.8a72,72,0,1,0,87.8,74.7,8,8,0,1,0-15.9-1,56,56,0,1,1-71.9-57.2V132a8,8,0,0,0,8,8h83l29.8,59.6a8,8,0,0,0,7.2,4.4,7.3,7.3,0,0,0,2.5-.4l24-8A8,8,0,0,0,247.5,185.5Z" />
    </_Svg>
  )
}

Icon.displayName = 'WheelchairFill'

export const WheelchairFill = memo<IconProps>(themed(Icon))
