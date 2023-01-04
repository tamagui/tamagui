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
      <_Path d="M198.1,28.5A15.9,15.9,0,0,0,180.7,32L114.3,98.3h0L16,196.7a15.7,15.7,0,0,0-4.7,11.6,4.9,4.9,0,0,0,.1,1.2,14.7,14.7,0,0,0,1.1,4.6,16,16,0,0,0,6.9,7.8l1,.6,2.2.8a14.9,14.9,0,0,0,4.7.7H192a16,16,0,0,0,16-16V43.3A16,16,0,0,0,198.1,28.5ZM192,208H128V107.3l64-64Z" />
    </_Svg>
  )
}

Icon.displayName = 'CellSignalMediumFill'

export const CellSignalMediumFill = memo<IconProps>(themed(Icon))
