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
      <_Path d="M43.2,128a30.4,30.4,0,0,1,8,10.3c4.8,9.9,4.8,22,4.8,33.7,0,24.3,1,36,24,36a8,8,0,0,1,0,16c-17.5,0-29.3-6.1-35.2-18.3C40,195.8,40,183.7,40,172c0-24.3-1-36-24-36a8,8,0,0,1,0-16c23,0,24-11.7,24-36,0-11.7,0-23.8,4.8-33.7C50.7,38.1,62.5,32,80,32a8,8,0,0,1,0,16C57,48,56,59.7,56,84c0,11.7,0,23.8-4.8,33.7A30.4,30.4,0,0,1,43.2,128ZM240,120c-23,0-24-11.7-24-36,0-11.7,0-23.8-4.8-33.7C205.3,38.1,193.5,32,176,32a8,8,0,0,0,0,16c23,0,24,11.7,24,36,0,11.7,0,23.8,4.8,33.7a30.4,30.4,0,0,0,8,10.3,30.4,30.4,0,0,0-8,10.3c-4.8,9.9-4.8,22-4.8,33.7,0,24.3-1,36-24,36a8,8,0,0,0,0,16c17.5,0,29.3-6.1,35.2-18.3,4.8-9.9,4.8-22,4.8-33.7,0-24.3,1-36,24-36a8,8,0,0,0,0-16Z" />
    </_Svg>
  )
}

Icon.displayName = 'BracketsCurlyFill'

export const BracketsCurlyFill = memo<IconProps>(themed(Icon))
