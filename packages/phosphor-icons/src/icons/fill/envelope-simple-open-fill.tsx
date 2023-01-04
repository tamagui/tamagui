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
      <_Path d="M228.4,89.3l-96-64a8.2,8.2,0,0,0-8.8,0l-96,64A7.9,7.9,0,0,0,24,96V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V96A7.9,7.9,0,0,0,228.4,89.3ZM40,200V111.5l65.9,47a7.9,7.9,0,0,0,4.6,1.5h35a7.9,7.9,0,0,0,4.6-1.5l65.9-47V200Z" />
    </_Svg>
  )
}

Icon.displayName = 'EnvelopeSimpleOpenFill'

export const EnvelopeSimpleOpenFill = memo<IconProps>(themed(Icon))
