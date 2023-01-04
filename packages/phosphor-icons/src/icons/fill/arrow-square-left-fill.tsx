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
      <_Path d="M224,208V48a16,16,0,0,0-16-16H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208A16,16,0,0,0,224,208ZM116.3,167.6,82.4,133.7a8,8,0,0,1-1.8-2.7,7.7,7.7,0,0,1-.6-3,8.5,8.5,0,0,1,.6-3.1,8.7,8.7,0,0,1,1.8-2.6l33.9-33.9a8,8,0,0,1,11.3,11.3L107.3,120H168a8,8,0,0,1,0,16H107.3l20.3,20.3a8,8,0,0,1-11.3,11.3Z" />
    </_Svg>
  )
}

Icon.displayName = 'ArrowSquareLeftFill'

export const ArrowSquareLeftFill = memo<IconProps>(themed(Icon))
