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
      <_Path d="M168,32H88A56,56,0,0,0,32,88v80a56,56,0,0,0,56,56h48a6.9,6.9,0,0,0,2.5-.4c26.3-8.8,76.3-58.8,85.1-85.1a6.9,6.9,0,0,0,.4-2.5V88A56,56,0,0,0,168,32ZM136,207.4V176a40,40,0,0,1,40-40h31.4C198.2,157.6,157.6,198.2,136,207.4Z" />
    </_Svg>
  )
}

Icon.displayName = 'StickerFill'

export const StickerFill = memo<IconProps>(themed(Icon))
