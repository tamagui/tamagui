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
      <_Path d="M235.4,138.8a15.9,15.9,0,0,1-11.7,5.2H136v56a16,16,0,0,0,32,0,8,8,0,0,1,16,0,32,32,0,0,1-64,0V144H32.3a15.9,15.9,0,0,1-11.7-5.2,15.7,15.7,0,0,1-4.2-12.2A111.9,111.9,0,0,1,204,53.8a110.9,110.9,0,0,1,35.6,72.8A15.7,15.7,0,0,1,235.4,138.8Z" />
    </_Svg>
  )
}

Icon.displayName = 'UmbrellaSimpleFill'

export const UmbrellaSimpleFill = memo<IconProps>(themed(Icon))
