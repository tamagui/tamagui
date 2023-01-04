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
      <_Path d="M228.9,49.7a8,8,0,0,0-6.8-1.5L160.9,63.5,99.6,32.8h-.1l-.8-.3h-.2l-.7-.2h-.3l-.7-.2H94.1l-64,16A8,8,0,0,0,24,56V200a7.8,7.8,0,0,0,3.1,6.3A7.9,7.9,0,0,0,32,208l1.9-.2,61.2-15.3,61.3,30.7h.1l.7.3h.1l.8.3h3.8l64-16A8,8,0,0,0,232,200V56A7.8,7.8,0,0,0,228.9,49.7ZM152,203.1l-48-24V52.9l48,24Z" />
    </_Svg>
  )
}

Icon.displayName = 'MapTrifoldFill'

export const MapTrifoldFill = memo<IconProps>(themed(Icon))
