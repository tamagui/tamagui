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
      <_Path d="M128,104a66.3,66.3,0,0,0-19.5,3l42.4-70.9a8,8,0,0,0-13.8-8.2l-64.5,108-.2.5A63,63,0,0,0,64,168a64,64,0,1,0,64-64Zm0,112a48.1,48.1,0,0,1-41.2-72.7l.2-.3a48,48,0,1,1,41,73Z" />
    </_Svg>
  )
}

Icon.displayName = 'NumberSixFill'

export const NumberSixFill = memo<IconProps>(themed(Icon))
