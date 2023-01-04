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
      <_Path d="M216,64H176V56a24.1,24.1,0,0,0-24-24H104A24.1,24.1,0,0,0,80,56v8H40A16,16,0,0,0,24,80V208a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V80A16,16,0,0,0,216,64ZM96,56a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm60,96H136v20a8,8,0,0,1-16,0V152H100a8,8,0,0,1,0-16h20V116a8,8,0,0,1,16,0v20h20a8,8,0,0,1,0,16Z" />
    </_Svg>
  )
}

Icon.displayName = 'FirstAidKitFill'

export const FirstAidKitFill = memo<IconProps>(themed(Icon))
