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
      <_Path d="M128,24A104,104,0,1,0,232,128,104.2,104.2,0,0,0,128,24Zm36,72a12,12,0,1,1-12,12A12,12,0,0,1,164,96ZM92,96a12,12,0,1,1-12,12A12,12,0,0,1,92,96Zm89,82.2a7.9,7.9,0,0,1-5,1.8,7.8,7.8,0,0,1-6.2-3L160,164.8,150.2,177a7.9,7.9,0,0,1-12.4,0L128,164.8,118.2,177a7.9,7.9,0,0,1-12.4,0L96,164.8,86.2,177a8,8,0,0,1-12.4-10l16-20a7.9,7.9,0,0,1,12.4,0l9.8,12.2,9.8-12.2a7.9,7.9,0,0,1,12.4,0l9.8,12.2,9.8-12.2a7.9,7.9,0,0,1,12.4,0l16,20A7.9,7.9,0,0,1,181,178.2Z" />
    </_Svg>
  )
}

Icon.displayName = 'SmileyNervousFill'

export const SmileyNervousFill = memo<IconProps>(themed(Icon))
