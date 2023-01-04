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
      <_Path d="M136,65.4V40a8,8,0,0,0-16,0V65.4a24,24,0,0,0,0,45.2V216a8,8,0,0,0,16,0V110.6a24,24,0,0,0,0-45.2Z" />
      <_Path d="M224,168a24,24,0,0,0-16-22.6V40a8,8,0,0,0-16,0V145.4a24,24,0,0,0,0,45.2V216a8,8,0,0,0,16,0V190.6A24,24,0,0,0,224,168Z" />
      <_Path d="M64,113.4V40a8,8,0,0,0-16,0v73.4a24,24,0,0,0,0,45.2V216a8,8,0,0,0,16,0V158.6a24,24,0,0,0,0-45.2Z" />
    </_Svg>
  )
}

Icon.displayName = 'SlidersFill'

export const SlidersFill = memo<IconProps>(themed(Icon))
