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
      <_Path d="M56,64a8,8,0,0,1,8-8H192a8,8,0,0,1,0,16H64A8,8,0,0,1,56,64ZM216,168a8,8,0,0,0-8,8v16H176a16,16,0,0,1-16-16V128h48a8,8,0,0,0,0-16H48a8,8,0,0,0,0,16H96v8a56,56,0,0,1-56,56,8,8,0,0,0,0,16,72.1,72.1,0,0,0,72-72v-8h32v48a32.1,32.1,0,0,0,32,32h40a8,8,0,0,0,8-8V176A8,8,0,0,0,216,168Z" />
    </_Svg>
  )
}

Icon.displayName = 'CurrencyCnyFill'

export const CurrencyCnyFill = memo<IconProps>(themed(Icon))
