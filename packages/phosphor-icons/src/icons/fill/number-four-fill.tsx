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
      <_Path d="M180,96V224a8,8,0,0,1-16,0V168H76a8,8,0,0,1-6.5-3.4,7.9,7.9,0,0,1-1-7.3l48-136a8,8,0,0,1,15,5.4L87.3,152H164V96a8,8,0,0,1,16,0Z" />
    </_Svg>
  )
}

Icon.displayName = 'NumberFourFill'

export const NumberFourFill = memo<IconProps>(themed(Icon))
