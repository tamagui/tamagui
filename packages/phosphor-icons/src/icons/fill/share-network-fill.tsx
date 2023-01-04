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
      <_Path d="M176,160a39.7,39.7,0,0,0-28.6,12.1l-46.1-29.6a40.3,40.3,0,0,0,0-29l46.1-29.6A40,40,0,1,0,136,56a41,41,0,0,0,2.7,14.5L92.6,100.1a40,40,0,1,0,0,55.8l46.1,29.6A41,41,0,0,0,136,200a40,40,0,1,0,40-40Z" />
    </_Svg>
  )
}

Icon.displayName = 'ShareNetworkFill'

export const ShareNetworkFill = memo<IconProps>(themed(Icon))
