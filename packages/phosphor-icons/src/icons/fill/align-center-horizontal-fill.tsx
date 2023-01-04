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
      <_Path d="M224,152v40a16,16,0,0,1-16,16H136v16a8,8,0,0,1-16,0V208H48a16,16,0,0,1-16-16V152a16,16,0,0,1,16-16h72V120H72a16,16,0,0,1-16-16V64A16,16,0,0,1,72,48h48V32a8,8,0,0,1,16,0V48h48a16,16,0,0,1,16,16v40a16,16,0,0,1-16,16H136v16h72A16,16,0,0,1,224,152Z" />
    </_Svg>
  )
}

Icon.displayName = 'AlignCenterHorizontalFill'

export const AlignCenterHorizontalFill = memo<IconProps>(themed(Icon))
