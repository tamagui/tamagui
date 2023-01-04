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
      <_Path d="M128,24A104,104,0,0,0,36.8,178l-8.5,30A15.9,15.9,0,0,0,48,227.7l30-8.5A104,104,0,1,0,128,24Zm53.7,93.7-32,32a8.2,8.2,0,0,1-11.4,0L112,123.3,85.7,149.7a8.1,8.1,0,0,1-11.4-11.4l32-32a8.1,8.1,0,0,1,11.4,0L144,132.7l26.3-26.4a8.1,8.1,0,0,1,11.4,11.4Z" />
    </_Svg>
  )
}

Icon.displayName = 'MessengerLogoFill'

export const MessengerLogoFill = memo<IconProps>(themed(Icon))
