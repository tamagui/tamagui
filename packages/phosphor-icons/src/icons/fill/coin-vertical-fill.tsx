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
      <_Path d="M198.5,56.1C186.4,35.4,169.9,24,152,24H104C86.1,24,69.6,35.4,57.5,56.1S40,101,40,128s6.2,52.6,17.5,71.9S86.1,232,104,232h48c17.9,0,34.4-11.4,46.5-32.1S216,155,216,128,209.8,75.4,198.5,56.1Zm1.3,63.9h-32c-.8-17.2-4.1-33.7-9.7-48h30.6C194.8,85.4,198.9,102,199.8,120ZM179.2,56H150.5a89,89,0,0,0-12-16H152C162,40,171.4,46,179.2,56ZM152,216H138.5a89,89,0,0,0,12-16h28.7C171.4,210,162,216,152,216Zm36.7-32H158.1c5.6-14.3,8.9-30.8,9.7-48h32C198.9,154,194.8,170.6,188.7,184Z" />
    </_Svg>
  )
}

Icon.displayName = 'CoinVerticalFill'

export const CoinVerticalFill = memo<IconProps>(themed(Icon))
