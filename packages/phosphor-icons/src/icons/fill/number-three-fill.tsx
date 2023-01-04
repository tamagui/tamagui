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
      <_Path d="M184,168A64,64,0,0,1,74.8,213.3a8,8,0,0,1,11.3-11.4A47.9,47.9,0,1,0,120,120a8.1,8.1,0,0,1-7.1-4.3,7.8,7.8,0,0,1,.6-8.3L160.6,40H80a8,8,0,0,1,0-16h96a8.1,8.1,0,0,1,7.1,4.3,7.8,7.8,0,0,1-.6,8.3l-48.2,69A64.1,64.1,0,0,1,184,168Z" />
    </_Svg>
  )
}

Icon.displayName = 'NumberThreeFill'

export const NumberThreeFill = memo<IconProps>(themed(Icon))
