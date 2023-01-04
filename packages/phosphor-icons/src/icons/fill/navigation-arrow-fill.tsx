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
      <_Path d="M219.5,88.4,50.2,29.8A16,16,0,0,0,29.8,50.2L88.4,219.5a15.8,15.8,0,0,0,15.1,10.8h.3a15.6,15.6,0,0,0,15-11.2l23.6-76.6L219,118.8a15.8,15.8,0,0,0,11.3-15A15.9,15.9,0,0,0,219.5,88.4Z" />
    </_Svg>
  )
}

Icon.displayName = 'NavigationArrowFill'

export const NavigationArrowFill = memo<IconProps>(themed(Icon))
