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
      <_Path d="M203.1,40.6a8.4,8.4,0,0,0-8.8,1.7L128,108.7V48a8,8,0,0,0-4.9-7.4,8.4,8.4,0,0,0-8.8,1.7l-80,80a8.1,8.1,0,0,0,0,11.4l80,80A8.3,8.3,0,0,0,120,216a8.5,8.5,0,0,0,3.1-.6A8,8,0,0,0,128,208V147.3l66.3,66.4A8.3,8.3,0,0,0,200,216a8.5,8.5,0,0,0,3.1-.6A8,8,0,0,0,208,208V48A8,8,0,0,0,203.1,40.6Z" />
    </_Svg>
  )
}

Icon.displayName = 'CaretDoubleLeftFill'

export const CaretDoubleLeftFill = memo<IconProps>(themed(Icon))
