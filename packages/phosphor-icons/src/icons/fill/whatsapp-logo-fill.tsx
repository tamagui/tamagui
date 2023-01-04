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
      <_Path d="M128,24A104,104,0,0,0,36.8,178l-8.5,30A15.9,15.9,0,0,0,48,227.7l30-8.5A104,104,0,1,0,128,24Zm24.1,168H152a88.1,88.1,0,0,1-88-88.1A36,36,0,0,1,100,68a14.9,14.9,0,0,1,12.9,7.5L124.6,96a15.8,15.8,0,0,1-.2,16.1L117.3,124A41.4,41.4,0,0,0,132,138.7l11.9-7.1a15.8,15.8,0,0,1,16.1-.2l20.5,11.7A14.9,14.9,0,0,1,188,156,36,36,0,0,1,152.1,192Z" />
      <_Path d="M136.5,154.7a8.1,8.1,0,0,1-7.4.4,55.4,55.4,0,0,1-28.2-28.2,8.1,8.1,0,0,1,.4-7.4l9.4-15.6L99.4,84A19.9,19.9,0,0,0,80,103.9,72,72,0,0,0,152,176h.1A19.9,19.9,0,0,0,172,156.6l-19.9-11.3Z" />
    </_Svg>
  )
}

Icon.displayName = 'WhatsappLogoFill'

export const WhatsappLogoFill = memo<IconProps>(themed(Icon))
