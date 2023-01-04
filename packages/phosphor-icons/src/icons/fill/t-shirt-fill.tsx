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
      <_Path d="M245.4,61.3,196,33.1h0a8,8,0,0,0-4-1.1H160a8,8,0,0,0-8,8,24,24,0,0,1-48,0,8,8,0,0,0-8-8H64a8,8,0,0,0-4,1.1h0L10.6,61.3a15.9,15.9,0,0,0-6.4,21l18.4,36.9A16,16,0,0,0,36.9,128H56v80a16,16,0,0,0,16,16H184a16,16,0,0,0,16-16V128h19.1a16,16,0,0,0,14.3-8.8l18.4-36.9A15.9,15.9,0,0,0,245.4,61.3ZM36.9,112,18.5,75.2,56,53.8V112Zm182.2,0H200V53.8l37.5,21.4Z" />
    </_Svg>
  )
}

Icon.displayName = 'TShirtFill'

export const TShirtFill = memo<IconProps>(themed(Icon))
