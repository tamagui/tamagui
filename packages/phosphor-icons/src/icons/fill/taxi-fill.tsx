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
      <_Path d="M240,112H228.6L201.2,64.1A15.9,15.9,0,0,0,187.4,56h-22l-12-29.9A15.7,15.7,0,0,0,138.6,16H117.4a15.7,15.7,0,0,0-14.8,10.1L90.6,56h-22a15.9,15.9,0,0,0-13.8,8.1L27.4,112H16a8,8,0,0,0,0,16h8v80a16,16,0,0,0,16,16H64a16,16,0,0,0,16-16V192h96v16a16,16,0,0,0,16,16h24a16,16,0,0,0,16-16V128h8a8,8,0,0,0,0-16ZM117.4,32h21.2l9.6,24H107.8ZM80,160H64a8,8,0,0,1,0-16H80a8,8,0,0,1,0,16Zm112,0H176a8,8,0,0,1,0-16h16a8,8,0,0,1,0,16Z" />
    </_Svg>
  )
}

Icon.displayName = 'TaxiFill'

export const TaxiFill = memo<IconProps>(themed(Icon))
