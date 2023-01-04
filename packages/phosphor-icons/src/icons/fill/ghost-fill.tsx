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
      <_Path d="M128,24a96.2,96.2,0,0,0-96,96v96a8.1,8.1,0,0,0,13.1,6.2l24.2-19.9,24.3,19.9a8,8,0,0,0,10.1,0L128,202.3l24.3,19.9a8,8,0,0,0,10.1,0l24.3-19.9,24.2,19.9a7.9,7.9,0,0,0,8.5,1A7.9,7.9,0,0,0,224,216V120A96.2,96.2,0,0,0,128,24ZM100,128a12,12,0,1,1,12-12A12,12,0,0,1,100,128Zm56,0a12,12,0,1,1,12-12A12,12,0,0,1,156,128Z" />
    </_Svg>
  )
}

Icon.displayName = 'GhostFill'

export const GhostFill = memo<IconProps>(themed(Icon))
