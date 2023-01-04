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
      <_Path d="M188.3,43.3l-.6-.5-.8-.4A102.9,102.9,0,0,0,128,24a104.1,104.1,0,1,0,60.3,19.3ZM128,152a24,24,0,1,1,24-24A24.1,24.1,0,0,1,128,152Zm88-24c0,2.5-.1,4.9-.3,7.3L168,126.9a39.8,39.8,0,0,0-11-26.4l27.8-39.7A87.9,87.9,0,0,1,216,128Z" />
    </_Svg>
  )
}

Icon.displayName = 'DiscFill'

export const DiscFill = memo<IconProps>(themed(Icon))
