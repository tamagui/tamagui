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
      <_Path d="M232,120A104.2,104.2,0,0,0,128,16h0A104.2,104.2,0,0,0,24,120a8.2,8.2,0,0,0,3.2,6.4h0L120,196v20h-8a8,8,0,0,0,0,16h32a8,8,0,0,0,0-16h-8V196l92.8-69.6h0A8.2,8.2,0,0,0,232,120Zm-16.4-8H175.8c-1.5-37.9-13.9-62.4-25.1-77A88.1,88.1,0,0,1,215.6,112Zm-61.2,16L128,175.5,101.6,128Zm-71.1,0,19.5,35.1L56,128Zm89.4,0H200l-46.8,35.1ZM105.3,35C94.1,49.6,81.7,74.1,80.2,112H40.4A88.1,88.1,0,0,1,105.3,35Z" />
    </_Svg>
  )
}

Icon.displayName = 'ParachuteFill'

export const ParachuteFill = memo<IconProps>(themed(Icon))
