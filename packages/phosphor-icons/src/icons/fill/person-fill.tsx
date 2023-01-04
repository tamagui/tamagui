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
      <_Circle cx="127.9" cy="44" r="36" />
      <_Path d="M211.7,139.5,172.3,88.9l-.6-.7A27.8,27.8,0,0,0,151.9,80h-48a27.8,27.8,0,0,0-19.8,8.2l-.7.7L44.1,139.5a20,20,0,0,0,28.3,28.3l14.1-11L66.6,219.5a20.2,20.2,0,0,0-.4,14.7,19.9,19.9,0,0,0,10.4,11.3,19.6,19.6,0,0,0,15.2.7,20.2,20.2,0,0,0,11.1-9.8l25-39.4,25,39.4a20.4,20.4,0,0,0,11,9.8,20.9,20.9,0,0,0,6.9,1.2,19.1,19.1,0,0,0,8.4-1.9,20.2,20.2,0,0,0,10.4-11.3,19.7,19.7,0,0,0-.5-14.7l-19.8-62.7,14.1,11a20,20,0,0,0,27.9-.4,19.7,19.7,0,0,0,5.8-14.1A19.9,19.9,0,0,0,211.7,139.5Z" />
    </_Svg>
  )
}

Icon.displayName = 'PersonFill'

export const PersonFill = memo<IconProps>(themed(Icon))
