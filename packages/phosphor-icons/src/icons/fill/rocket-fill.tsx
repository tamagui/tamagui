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
      <_Path d="M144,216H112a8,8,0,0,0,0,16h32a8,8,0,0,0,0-16Z" />
      <_Path d="M219.6,143.9l-30.2-36.3a125.4,125.4,0,0,0-8-34.9c-11.6-30.2-32.1-50-43.4-59.1a15.9,15.9,0,0,0-20-.1c-11.4,9.1-32.2,28.9-43.9,59.1A121.5,121.5,0,0,0,66,108.3L36.4,143.9A16.1,16.1,0,0,0,33,157.6l12.4,55.6a15.9,15.9,0,0,0,10.3,11.6,17,17,0,0,0,5.4.9,16,16,0,0,0,9.9-3.5L98.8,200h58.4L185,222.2a16,16,0,0,0,9.9,3.5,17,17,0,0,0,5.4-.9,15.9,15.9,0,0,0,10.3-11.6L223,157.6A16.1,16.1,0,0,0,219.6,143.9ZM61,209.7,48.7,154.1l17.9-21.5q3.5,28.1,19.1,57.4ZM128,108a12,12,0,1,1,12-12A12,12,0,0,1,128,108Zm67,101.7-24.8-19.8c10.4-19.7,16.6-39,18.8-57.8l18.3,22Z" />
    </_Svg>
  )
}

Icon.displayName = 'RocketFill'

export const RocketFill = memo<IconProps>(themed(Icon))
