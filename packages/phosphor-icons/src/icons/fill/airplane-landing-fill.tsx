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
      <_Path d="M248,216a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16H240A8,8,0,0,1,248,216Zm-24-28a4.1,4.1,0,0,0,2.4-.8A4,4,0,0,0,228,184V148.3a36.1,36.1,0,0,0-26.4-34.7l-46.9-13L123.5,46a4.3,4.3,0,0,0-2.2-1.8l-13.5-4.5A11.9,11.9,0,0,0,97,41.4a11.6,11.6,0,0,0-5,9.7V82.6L66.8,74.7,51.5,46.1a4.1,4.1,0,0,0-2.2-1.9L35.8,39.7A11.9,11.9,0,0,0,25,41.4a11.6,11.6,0,0,0-5,9.7v52.6a36.1,36.1,0,0,0,26.3,34.7l176.6,49.5Z" />
    </_Svg>
  )
}

Icon.displayName = 'AirplaneLandingFill'

export const AirplaneLandingFill = memo<IconProps>(themed(Icon))
