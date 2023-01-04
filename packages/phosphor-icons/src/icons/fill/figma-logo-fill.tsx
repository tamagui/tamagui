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
      <_Path d="M186.6,94A42,42,0,0,0,162,18H94A42,42,0,0,0,69.4,94a41.9,41.9,0,0,0,0,68A42,42,0,1,0,136,196V160.9A42,42,0,1,0,186.6,94ZM188,60a26.1,26.1,0,0,1-26,26H136V34h26A26.1,26.1,0,0,1,188,60Zm-26,94a26,26,0,0,1,0-52h0a26,26,0,0,1,0,52Z" />
    </_Svg>
  )
}

Icon.displayName = 'FigmaLogoFill'

export const FigmaLogoFill = memo<IconProps>(themed(Icon))
