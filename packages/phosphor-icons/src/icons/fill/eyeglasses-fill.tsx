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
      <_Path d="M232,72v92a44,44,0,0,1-87.8,4H111.8A44,44,0,0,1,24,164V72A32.1,32.1,0,0,1,56,40a8,8,0,0,1,0,16A16,16,0,0,0,40,72v58.1A43.9,43.9,0,0,1,110.3,152h35.4A43.9,43.9,0,0,1,216,130.1V72a16,16,0,0,0-16-16,8,8,0,0,1,0-16A32.1,32.1,0,0,1,232,72Z" />
    </_Svg>
  )
}

Icon.displayName = 'EyeglassesFill'

export const EyeglassesFill = memo<IconProps>(themed(Icon))
