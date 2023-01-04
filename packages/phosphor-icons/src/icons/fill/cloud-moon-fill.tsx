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
      <_Path d="M156,72a85.2,85.2,0,0,0-12.4,1A71.8,71.8,0,0,0,88.2,9.8a8,8,0,0,0-9.6,9.6A58.6,58.6,0,0,1,80,32,56,56,0,0,1,24,88a58.6,58.6,0,0,1-12.6-1.4,8,8,0,0,0-9.6,9.6,71.9,71.9,0,0,0,32.3,45A52,52,0,0,0,76,224h80a76,76,0,0,0,0-152ZM21.4,104H24A72.1,72.1,0,0,0,96,32V29.3a55.6,55.6,0,0,1,31.9,48.1A76.3,76.3,0,0,0,85,120.8a53.8,53.8,0,0,0-9-.8,51.8,51.8,0,0,0-30,9.6A55.9,55.9,0,0,1,21.4,104Z" />
    </_Svg>
  )
}

Icon.displayName = 'CloudMoonFill'

export const CloudMoonFill = memo<IconProps>(themed(Icon))
