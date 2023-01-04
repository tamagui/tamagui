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
      <_Path d="M240,120a48,48,0,0,0-48-48H152c-.5,0-52.4-.7-101.7-42.1a15.9,15.9,0,0,0-17.1-2.2A15.7,15.7,0,0,0,24,42.2V197.8a15.7,15.7,0,0,0,9.2,14.5,16.4,16.4,0,0,0,6.8,1.5,15.9,15.9,0,0,0,10.3-3.7c37.9-31.8,77.2-39.6,93.7-41.5v35.1a15.9,15.9,0,0,0,7.1,13.3l11,7.4a16.8,16.8,0,0,0,14.7,1.6,15.9,15.9,0,0,0,9.7-11.1l11.9-47.3A48.2,48.2,0,0,0,240,120Zm-69,91-11-7.3V168h21.8Zm21-59H160V88h32a32,32,0,0,1,0,64Z" />
    </_Svg>
  )
}

Icon.displayName = 'MegaphoneFill'

export const MegaphoneFill = memo<IconProps>(themed(Icon))
