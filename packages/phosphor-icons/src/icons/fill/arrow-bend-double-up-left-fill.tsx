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
      <_Path d="M85.7,146.3a8.1,8.1,0,0,1,0,11.4,8.2,8.2,0,0,1-11.4,0l-48-48a8.1,8.1,0,0,1,0-11.4l48-48A8.1,8.1,0,0,1,85.7,61.7L43.3,104Zm50.3-50V56a8,8,0,0,0-4.9-7.4,8.4,8.4,0,0,0-8.8,1.7l-48,48a8.1,8.1,0,0,0,0,11.4l48,48A8.3,8.3,0,0,0,128,160a8.5,8.5,0,0,0,3.1-.6A8,8,0,0,0,136,152V112.4A88.1,88.1,0,0,1,216,200a8,8,0,0,0,16,0A104.1,104.1,0,0,0,136,96.3Z" />
    </_Svg>
  )
}

Icon.displayName = 'ArrowBendDoubleUpLeftFill'

export const ArrowBendDoubleUpLeftFill = memo<IconProps>(themed(Icon))
