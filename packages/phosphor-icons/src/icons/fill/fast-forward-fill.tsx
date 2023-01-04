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
      <_Path d="M253.2,128a16,16,0,0,1-7.3,13.5l-89.2,57.3A16,16,0,0,1,132,185.3V142.7L44.7,198.8A16,16,0,0,1,20,185.3V70.7A16,16,0,0,1,44.7,57.2L132,113.3V70.7a16,16,0,0,1,24.7-13.5l89.2,57.3A16,16,0,0,1,253.2,128Z" />
    </_Svg>
  )
}

Icon.displayName = 'FastForwardFill'

export const FastForwardFill = memo<IconProps>(themed(Icon))
