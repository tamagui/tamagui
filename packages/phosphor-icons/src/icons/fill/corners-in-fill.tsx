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
      <_Path d="M152,96V48a8,8,0,0,1,4.9-7.4,8.4,8.4,0,0,1,8.8,1.7l48,48a8.4,8.4,0,0,1,1.7,8.8A8,8,0,0,1,208,104H160A8,8,0,0,1,152,96ZM96,152H48a8,8,0,0,0-7.4,4.9,8.4,8.4,0,0,0,1.7,8.8l48,48A8.3,8.3,0,0,0,96,216a8.5,8.5,0,0,0,3.1-.6A8,8,0,0,0,104,208V160A8,8,0,0,0,96,152ZM99.1,40.6a8.4,8.4,0,0,0-8.8,1.7l-48,48a8.4,8.4,0,0,0-1.7,8.8A8,8,0,0,0,48,104H96a8,8,0,0,0,8-8V48A8,8,0,0,0,99.1,40.6ZM208,152H160a8,8,0,0,0-8,8v48a8,8,0,0,0,4.9,7.4,8.5,8.5,0,0,0,3.1.6,8.3,8.3,0,0,0,5.7-2.3l48-48a8.4,8.4,0,0,0,1.7-8.8A8,8,0,0,0,208,152Z" />
    </_Svg>
  )
}

Icon.displayName = 'CornersInFill'

export const CornersInFill = memo<IconProps>(themed(Icon))
