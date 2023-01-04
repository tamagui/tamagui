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
      <_Circle cx="128" cy="128" r="12" />
      <_Path d="M184.6,128l27.7-27.7a40,40,0,0,0-56.6-56.6L128,71.4,100.3,43.7a40,40,0,0,0-56.6,56.6L71.4,128,43.7,155.7a40,40,0,0,0,56.6,56.6L128,184.6l27.7,27.7a40,40,0,0,0,56.6-56.6ZM128,94.1,161.9,128,128,161.9,94.1,128ZM167,55a24,24,0,0,1,34,34l-27.7,27.7-34-34ZM89,201a24,24,0,0,1-34-34l27.7-27.7,34,34Z" />
    </_Svg>
  )
}

Icon.displayName = 'BandaidsFill'

export const BandaidsFill = memo<IconProps>(themed(Icon))
