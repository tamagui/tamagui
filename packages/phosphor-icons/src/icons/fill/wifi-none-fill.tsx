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
      <_Path d="M128,219.7a16,16,0,0,1-12.1-5.6L12.9,92.7A15.8,15.8,0,0,1,9.2,80.5a16.3,16.3,0,0,1,6.2-11c66.3-50,158.9-50,225.2,0a16.3,16.3,0,0,1,6.2,11,16,16,0,0,1-3.7,12.2l-103,121.4A16,16,0,0,1,128,219.7ZM25.1,82.3h0L128,203.6,230.9,82.4v-.2C170.4,36.6,85.7,36.6,25.1,82.3Zm-.1,0Zm-4.8-6.4Z" />
    </_Svg>
  )
}

Icon.displayName = 'WifiNoneFill'

export const WifiNoneFill = memo<IconProps>(themed(Icon))
