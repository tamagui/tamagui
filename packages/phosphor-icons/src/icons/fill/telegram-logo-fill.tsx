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
      <_Path d="M231.3,31.7A16.1,16.1,0,0,0,215,29L30.4,101.5a15.8,15.8,0,0,0-10.1,16.3,16,16,0,0,0,12.8,14.3L80,141.4V200a16,16,0,0,0,9.9,14.8A16.6,16.6,0,0,0,96,216a15.8,15.8,0,0,0,11.3-4.7l26-25.9L172.6,220a16,16,0,0,0,10.5,4,14.2,14.2,0,0,0,5-.8,15.9,15.9,0,0,0,10.7-11.6L236.4,47.4A16,16,0,0,0,231.3,31.7ZM183.2,208l-82.4-72.5L219.5,49.8Z" />
    </_Svg>
  )
}

Icon.displayName = 'TelegramLogoFill'

export const TelegramLogoFill = memo<IconProps>(themed(Icon))
