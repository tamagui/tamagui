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
      <_Path d="M175.9,130a68.8,68.8,0,0,0-16.4-11.4,59.4,59.4,0,0,0,9.9-7.4,53.6,53.6,0,0,0,0-79.1,61.3,61.3,0,0,0-82.8,0,53.6,53.6,0,0,0,0,79.1,59.4,59.4,0,0,0,9.9,7.4A68.8,68.8,0,0,0,80.1,130a61.9,61.9,0,0,0,0,91.3,70.7,70.7,0,0,0,95.8,0,61.9,61.9,0,0,0,0-91.3ZM97.6,99.5a37.5,37.5,0,0,1,0-55.7,45.1,45.1,0,0,1,60.8,0,37.5,37.5,0,0,1,0,55.7,45.1,45.1,0,0,1-60.8,0ZM165,209.7a55,55,0,0,1-74,0,46,46,0,0,1,0-68,54.7,54.7,0,0,1,74,0,46,46,0,0,1,0,68Z" />
    </_Svg>
  )
}

Icon.displayName = 'NumberEightFill'

export const NumberEightFill = memo<IconProps>(themed(Icon))
