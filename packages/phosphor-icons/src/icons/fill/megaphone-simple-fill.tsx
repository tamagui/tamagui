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
      <_Path d="M220.5,86.6,138.4,62.7h-.1L44.5,35.3a15.8,15.8,0,0,0-14.1,2.6A15.7,15.7,0,0,0,24,50.7V189.3a16,16,0,0,0,15.9,16,17.6,17.6,0,0,0,4.6-.6L128,180.3V192a16,16,0,0,0,16,16h32a16,16,0,0,0,16-16V161.7l28.5-8.3A16.1,16.1,0,0,0,232,138V102A16.1,16.1,0,0,0,220.5,86.6ZM176,192H144V175.7l32-9.4Zm40-54-34.4,10h0L144,159V81l72,21Z" />
    </_Svg>
  )
}

Icon.displayName = 'MegaphoneSimpleFill'

export const MegaphoneSimpleFill = memo<IconProps>(themed(Icon))
