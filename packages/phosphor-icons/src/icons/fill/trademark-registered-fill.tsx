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
      <_Path d="M128,56a72,72,0,1,0,72,72A72.1,72.1,0,0,0,128,56Zm28.5,110.6A8.2,8.2,0,0,1,152,168a8,8,0,0,1-6.6-3.5L131.3,144H116v16a8,8,0,0,1-16,0V96a8,8,0,0,1,8-8h24a28,28,0,0,1,15.5,51.3l11.1,16.2A7.9,7.9,0,0,1,156.5,166.6ZM144,116a12,12,0,0,1-12,12H116V104h16A12,12,0,0,1,144,116ZM128,20A108,108,0,1,0,236,128,108.1,108.1,0,0,0,128,20Zm0,196a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Z" />
    </_Svg>
  )
}

Icon.displayName = 'TrademarkRegisteredFill'

export const TrademarkRegisteredFill = memo<IconProps>(themed(Icon))
