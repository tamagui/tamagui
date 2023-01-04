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
      <_Path d="M218.3,76.4a.8.8,0,0,1-.2-.4l-.4-.5a104,104,0,0,0-180,104.1l.2.4.3.4a104,104,0,0,0,180.1-104Zm-18.4.9L136,114.1V40.4A88.2,88.2,0,0,1,199.9,77.3ZM128,216a88,88,0,0,1-71.9-37.3L207.9,91.1A88,88,0,0,1,128,216Z" />
    </_Svg>
  )
}

Icon.displayName = 'ChartPieFill'

export const ChartPieFill = memo<IconProps>(themed(Icon))
