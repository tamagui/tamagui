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
      <_Path d="M207.1,88.7l-2.3-2.2,24.9-24.8a8.1,8.1,0,0,0-11.4-11.4l-25.9,26a111.5,111.5,0,0,0-128.6.2L37.7,50.3A8.1,8.1,0,0,0,26.3,61.7l25.1,25A113.4,113.4,0,0,0,16,169.1V192a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V168A111.2,111.2,0,0,0,207.1,88.7ZM92,168a12,12,0,1,1,12-12A12,12,0,0,1,92,168Zm72,0a12,12,0,1,1,12-12A12,12,0,0,1,164,168Z" />
    </_Svg>
  )
}

Icon.displayName = 'AndroidLogoFill'

export const AndroidLogoFill = memo<IconProps>(themed(Icon))
