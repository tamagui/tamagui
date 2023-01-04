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
      <_Path d="M128,24A104,104,0,1,0,232,128,104.2,104.2,0,0,0,128,24Zm41.4,125.9A8.2,8.2,0,0,1,164,152a7.9,7.9,0,0,1-5.9-2.6L128,116,97.9,149.4a8,8,0,0,1-11.8-10.8l36-40a8.3,8.3,0,0,1,11.8,0l36,40A8,8,0,0,1,169.4,149.9Z" />
    </_Svg>
  )
}

Icon.displayName = 'CaretCircleUpFill'

export const CaretCircleUpFill = memo<IconProps>(themed(Icon))
