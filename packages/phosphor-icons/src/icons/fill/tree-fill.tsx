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
      <_Path d="M128,187.9h0a91.6,91.6,0,0,1-8,4.6V232a8,8,0,0,0,16,0V192.5a91.6,91.6,0,0,1-8-4.6Z" />
      <_Path d="M198.1,62.6a76,76,0,0,0-140.2,0A72.3,72.3,0,0,0,16,127.8C15.9,166.6,47.4,199,86.1,200a71.9,71.9,0,0,0,33.9-7.5V156.9L76.4,135.2a8,8,0,1,1,7.2-14.4L120,139.1V88a8,8,0,0,1,16,0v27.1l36.4-18.3a8,8,0,0,1,7.2,14.4L136,132.9v59.6a72,72,0,0,0,32,7.5h1.9c38.7-1,70.2-33.4,70.1-72.2A72.3,72.3,0,0,0,198.1,62.6Z" />
    </_Svg>
  )
}

Icon.displayName = 'TreeFill'

export const TreeFill = memo<IconProps>(themed(Icon))
