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
      <_Path d="M120.9,108.3h-.1L89.8,74h-.1L53.9,34.6A8,8,0,0,0,42.1,45.4L70,76.1a143.9,143.9,0,0,0-43.8,30.1,56.1,56.1,0,0,0-4.7,73.9,16.2,16.2,0,0,0,12.6,6.1,17.1,17.1,0,0,0,5.9-1.1l47.4-19a16,16,0,0,0,9.7-11.7l5.9-29.5a72.1,72.1,0,0,1,9.1-2.5l90,99A8,8,0,0,0,208,224a8.2,8.2,0,0,0,5.4-2.1,7.9,7.9,0,0,0,.5-11.3Z" />
      <_Path d="M229.8,106.2a144.4,144.4,0,0,0-109.7-42,8,8,0,0,0-5.5,13.4L209,181.4a7.2,7.2,0,0,0,2.9,2l4.1,1.7a17.1,17.1,0,0,0,5.9,1.1,16.2,16.2,0,0,0,12.6-6.1A56.1,56.1,0,0,0,229.8,106.2Z" />
    </_Svg>
  )
}

Icon.displayName = 'PhoneSlashFill'

export const PhoneSlashFill = memo<IconProps>(themed(Icon))
