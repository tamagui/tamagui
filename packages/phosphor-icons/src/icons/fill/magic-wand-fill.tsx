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
      <_Path d="M248,152a8,8,0,0,1-8,8H224v16a8,8,0,0,1-16,0V160H192a8,8,0,0,1,0-16h16V128a8,8,0,0,1,16,0v16h16A8,8,0,0,1,248,152ZM64,68H76V80a8,8,0,0,0,16,0V68h12a8,8,0,0,0,0-16H92V40a8,8,0,0,0-16,0V52H64a8,8,0,0,0,0,16ZM184,192h-8v-8a8,8,0,0,0-16,0v8h-8a8,8,0,0,0,0,16h8v8a8,8,0,0,0,16,0v-8h8a8,8,0,0,0,0-16Zm-2.3-74.3L75.3,224a15.9,15.9,0,0,1-22.6,0L32,203.3a15.9,15.9,0,0,1,0-22.6L180.7,32a16.1,16.1,0,0,1,22.6,0L224,52.7a15.9,15.9,0,0,1,0,22.6l-42.3,42.4ZM155.3,80,176,100.7,212.7,64h0L192,43.3Z" />
    </_Svg>
  )
}

Icon.displayName = 'MagicWandFill'

export const MagicWandFill = memo<IconProps>(themed(Icon))
