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
      <_Path d="M128,24A104,104,0,1,0,232,128,104.2,104.2,0,0,0,128,24Zm56.6,110.6-40,28A8.6,8.6,0,0,1,140,164a8,8,0,0,1-8-8V128a8.2,8.2,0,0,1-3.4,6.6l-40,28A8.6,8.6,0,0,1,84,164a8,8,0,0,1-8-8V100a8.1,8.1,0,0,1,4.3-7.1,8,8,0,0,1,8.3.5l40,28A8.2,8.2,0,0,1,132,128V100a8.1,8.1,0,0,1,4.3-7.1,8,8,0,0,1,8.3.5l40,28a8.1,8.1,0,0,1,0,13.2Z" />
    </_Svg>
  )
}

Icon.displayName = 'FastForwardCircleFill'

export const FastForwardCircleFill = memo<IconProps>(themed(Icon))
