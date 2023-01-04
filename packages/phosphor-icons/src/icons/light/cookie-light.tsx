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
    <_Svg viewBox="0 0 256 256" {...otherProps} height={size} width={size}>
      <_Rect width="256" height="256" fill="none" />
      <_Path
        d="M224,127.4a95.6,95.6,0,0,1-28.2,68.5c-36.9,36.9-97.3,37.3-134.7.9A96,96,0,0,1,128.6,32a8.1,8.1,0,0,1,7.8,9.8,32,32,0,0,0,30.8,39,8,8,0,0,1,8,8,32,32,0,0,0,39,30.8A8.1,8.1,0,0,1,224,127.4Z"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="12"
      />
      <_Circle cx="156" cy="172" r="10" />
      <_Circle cx="92" cy="164" r="10" />
      <_Circle cx="84" cy="108" r="10" />
      <_Circle cx="136" cy="124" r="10" />
    </_Svg>
  )
}

Icon.displayName = 'CookieLight'

export const CookieLight = memo<IconProps>(themed(Icon))
