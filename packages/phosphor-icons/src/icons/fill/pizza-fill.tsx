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
      <_Path d="M239.3,80a16,16,0,0,0-4.2-21.6,183.9,183.9,0,0,0-214.2,0A16,16,0,0,0,16.7,80h0l97.8,153.7a16,16,0,0,0,27,0l58.4-91.8h.1ZM23.4,75.7ZM128,225.1l-32.5-51A36,36,0,0,0,84,104a35.6,35.6,0,0,0-26,11.1L47.4,98.5a135.8,135.8,0,0,1,161.2,0l-17.3,27.1a36,36,0,0,0-38.6,60.8Z" />
    </_Svg>
  )
}

Icon.displayName = 'PizzaFill'

export const PizzaFill = memo<IconProps>(themed(Icon))
