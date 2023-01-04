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
      <_Path d="M222.3,123.1l-88-112a8,8,0,0,0-12.6,0l-88,112a7.8,7.8,0,0,0,0,9.8l88,112a8,8,0,0,0,12.6,0l88-112A7.8,7.8,0,0,0,222.3,123.1ZM136,155.6V39.1l67.4,85.8Zm-16,0L52.6,124.9,120,39.1Zm0,17.6v43.7l-53.4-68Z" />
    </_Svg>
  )
}

Icon.displayName = 'CurrencyEthFill'

export const CurrencyEthFill = memo<IconProps>(themed(Icon))
