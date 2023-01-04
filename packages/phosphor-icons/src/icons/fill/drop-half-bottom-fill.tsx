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
      <_Path d="M174,47.8A259.4,259.4,0,0,0,132.6,9.4a8.1,8.1,0,0,0-9.2,0A259.4,259.4,0,0,0,82,47.8C54.5,79.3,40,112.6,40,144a88,88,0,0,0,176,0C216,112.6,201.5,79.3,174,47.8ZM128,26c14.2,11.1,56.9,47.8,68.8,94H59.2C71.1,73.8,113.8,37.1,128,26Z" />
    </_Svg>
  )
}

Icon.displayName = 'DropHalfBottomFill'

export const DropHalfBottomFill = memo<IconProps>(themed(Icon))
