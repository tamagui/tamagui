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
      <_Path d="M160.9,204.4l-26.2,40A8.2,8.2,0,0,1,128,248a8,8,0,0,1-6.7-12.4l26.3-40a8,8,0,1,1,13.3,8.8ZM159.3,16.1A76.1,76.1,0,0,0,85,64.8h0a74.8,74.8,0,0,0-5,26.9,8.3,8.3,0,0,1-7.4,8.3A8,8,0,0,1,64,92a91.6,91.6,0,0,1,2.4-21.1,4,4,0,0,0-5-4.8A52.1,52.1,0,0,0,24,116.3C24.2,145,48.1,168,76.8,168h38.6L92.2,203.4A8,8,0,0,0,98.7,216a8,8,0,0,0,6.7-3.6L134.6,168H156a76,76,0,0,0,3.3-151.9Z" />
    </_Svg>
  )
}

Icon.displayName = 'CloudRainFill'

export const CloudRainFill = memo<IconProps>(themed(Icon))
