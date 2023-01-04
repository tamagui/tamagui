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
      <_Path d="M64.3,204.1l-9.4,16A8.1,8.1,0,0,1,48,224a8.7,8.7,0,0,1-4.1-1.1,8.1,8.1,0,0,1-2.8-11l9.5-16a8,8,0,1,1,13.7,8.2ZM232,160H184.2l-30.7-52a8,8,0,0,0-11-2.8,7.9,7.9,0,0,0-2.8,10.9l61.4,104A8.1,8.1,0,0,0,208,224a8.7,8.7,0,0,0,4.1-1.1,8.1,8.1,0,0,0,2.8-11L193.7,176H232a8,8,0,0,0,0-16Zm-89.5,0H90.4l44.4-75.2h.1l24-40.6a8,8,0,0,0-13.8-8.2L128,64.9l-17.1-29a8,8,0,1,0-13.8,8.2l21.6,36.5L71.8,160H24a8,8,0,0,0,0,16H142.5a8,8,0,0,0,0-16Z" />
    </_Svg>
  )
}

Icon.displayName = 'AppStoreLogoFill'

export const AppStoreLogoFill = memo<IconProps>(themed(Icon))
