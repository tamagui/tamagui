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
      <_Path d="M232,140a56,56,0,0,1-56,56,55.2,55.2,0,0,1-25.9-6.4L162,225.5a7.8,7.8,0,0,1-1.1,7.2,7.9,7.9,0,0,1-6.4,3.3h-53a7.9,7.9,0,0,1-6.4-3.3,7.8,7.8,0,0,1-1.1-7.2l11.9-35.9A55.2,55.2,0,0,1,80,196a56,56,0,0,1-56-56C24,86.4,121.7,23.3,125.8,20.6a4.3,4.3,0,0,1,4.4,0C134.3,23.3,232,86.4,232,140Z" />
    </_Svg>
  )
}

Icon.displayName = 'SpadeFill'

export const SpadeFill = memo<IconProps>(themed(Icon))
