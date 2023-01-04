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
      <_Path d="M193.6,88.4A16.1,16.1,0,0,0,200,75.6V40a16,16,0,0,0-16-16H72A16,16,0,0,0,56,40V76a16.1,16.1,0,0,0,6.4,12.8l18.1,13.6h0L114.7,128,62.4,167.2A16.1,16.1,0,0,0,56,180v36a16,16,0,0,0,16,16H184a16,16,0,0,0,16-16V180.4a16.1,16.1,0,0,0-6.4-12.8L141.3,128,164,110.8ZM72,40H184V75.6L178.2,80H77.3L72,76ZM184,180.4V216H72V180l48-36v24a8,8,0,0,0,16,0V144.1Z" />
    </_Svg>
  )
}

Icon.displayName = 'HourglassMediumFill'

export const HourglassMediumFill = memo<IconProps>(themed(Icon))
