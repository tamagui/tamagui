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
      <_Path d="M192.6,189.3a8,8,0,0,1,0,11.3A80,80,0,0,1,56.4,152H40a8,8,0,0,1,0-16H56V120H40a8,8,0,0,1,0-16H56.4A80,80,0,0,1,192.6,55.4a8,8,0,0,1,0,11.3,7.9,7.9,0,0,1-11.3,0A64.1,64.1,0,0,0,72.5,104H136a8,8,0,0,1,0,16H72v16h48a8,8,0,0,1,0,16H72.5a64.1,64.1,0,0,0,108.8,37.3A7.9,7.9,0,0,1,192.6,189.3Z" />
    </_Svg>
  )
}

Icon.displayName = 'CurrencyEurFill'

export const CurrencyEurFill = memo<IconProps>(themed(Icon))
