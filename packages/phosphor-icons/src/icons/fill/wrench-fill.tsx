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
      <_Path d="M210.9,146.9A72.6,72.6,0,0,1,131,162L79,222.2c-.1.2-.3.3-.4.4a31.9,31.9,0,0,1-45.2,0,31.9,31.9,0,0,1,0-45.2l.4-.4L94,125a72,72,0,0,1,94.1-95.2,7.9,7.9,0,0,1,4.7,5.8,8,8,0,0,1-2.2,7.2L151.7,81.7l3.7,18.9,18.9,3.7,38.9-38.9a8,8,0,0,1,7.2-2.2,7.9,7.9,0,0,1,5.8,4.7A71.7,71.7,0,0,1,210.9,146.9Z" />
    </_Svg>
  )
}

Icon.displayName = 'WrenchFill'

export const WrenchFill = memo<IconProps>(themed(Icon))
