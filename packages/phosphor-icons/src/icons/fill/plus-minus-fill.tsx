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
      <_Path d="M205.7,50.3a8.1,8.1,0,0,0-11.4,0l-144,144a8.1,8.1,0,0,0,0,11.4,8.2,8.2,0,0,0,11.4,0l144-144A8.1,8.1,0,0,0,205.7,50.3Z" />
      <_Path d="M64,112a8,8,0,0,0,16,0V80h32a8,8,0,0,0,0-16H80V32a8,8,0,0,0-16,0V64H32a8,8,0,0,0,0,16H64Z" />
      <_Path d="M224,176H144a8,8,0,0,0,0,16h80a8,8,0,0,0,0-16Z" />
    </_Svg>
  )
}

Icon.displayName = 'PlusMinusFill'

export const PlusMinusFill = memo<IconProps>(themed(Icon))
