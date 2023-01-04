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
      <_Path d="M200,75.6V40a16,16,0,0,0-16-16H72A16,16,0,0,0,56,40V76a16.1,16.1,0,0,0,6.4,12.8L114.7,128,62.4,167.2A16.1,16.1,0,0,0,56,180v36a16,16,0,0,0,16,16H184a16,16,0,0,0,16-16V180.4a16.1,16.1,0,0,0-6.4-12.8L141.3,128l52.3-39.6A16.1,16.1,0,0,0,200,75.6ZM184,40V64H72V40Zm0,176H72V180l56-42,56,42.4Z" />
    </_Svg>
  )
}

Icon.displayName = 'HourglassHighFill'

export const HourglassHighFill = memo<IconProps>(themed(Icon))
