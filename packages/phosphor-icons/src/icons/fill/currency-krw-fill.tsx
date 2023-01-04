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
      <_Path d="M240,128H217.9l21.5-53a8,8,0,1,0-14.8-6l-24,59H159.4l-24-59a8,8,0,0,0-14.8,0l-24,59H55.4l-24-59a8,8,0,1,0-14.8,6l21.5,53H16a8,8,0,0,0,0,16H44.6l24,59a8,8,0,0,0,14.8,0l24-59h41.2l24,59a8,8,0,0,0,14.8,0l24-59H240a8,8,0,0,0,0-16ZM76,178.7,61.9,144H90.1ZM113.9,128,128,93.3,142.1,128ZM180,178.7,165.9,144h28.2Z" />
    </_Svg>
  )
}

Icon.displayName = 'CurrencyKrwFill'

export const CurrencyKrwFill = memo<IconProps>(themed(Icon))
