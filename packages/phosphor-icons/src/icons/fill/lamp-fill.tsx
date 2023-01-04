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
      <_Path d="M241.2,152.8a15.8,15.8,0,0,1-13.3,7.2H208v32a8,8,0,0,1-16,0V160H136v48h24a8,8,0,0,1,0,16H96a8,8,0,0,1,0-16h24V160H28.1a16.1,16.1,0,0,1-14.7-22.3l41.2-96A15.9,15.9,0,0,1,69.3,32H186.7a15.9,15.9,0,0,1,14.7,9.7l41.2,96A15.9,15.9,0,0,1,241.2,152.8Z" />
    </_Svg>
  )
}

Icon.displayName = 'LampFill'

export const LampFill = memo<IconProps>(themed(Icon))
