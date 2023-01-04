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
      <_Path d="M128,24A104,104,0,1,0,232,128,104.2,104.2,0,0,0,128,24Zm21.4,134.1a8,8,0,0,1,.5,11.3A7.9,7.9,0,0,1,144,172a8.2,8.2,0,0,1-5.4-2.1l-40-36a8,8,0,0,1,0-11.8l40-36a8,8,0,1,1,10.8,11.8L116,128Z" />
    </_Svg>
  )
}

Icon.displayName = 'CaretCircleLeftFill'

export const CaretCircleLeftFill = memo<IconProps>(themed(Icon))
