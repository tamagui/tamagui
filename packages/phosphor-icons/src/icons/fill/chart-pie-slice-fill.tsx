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
      <_Path d="M100,116.5a8.1,8.1,0,0,0,4-7v-72a8,8,0,0,0-10.7-7.6A104.3,104.3,0,0,0,24,128a109.1,109.1,0,0,0,1.7,19,8.1,8.1,0,0,0,4.5,5.8,8.4,8.4,0,0,0,3.4.8,8,8,0,0,0,4-1.1ZM88,49.6v55.3L40.1,132.6c-.1-1.6-.1-3.1-.1-4.6A88.3,88.3,0,0,1,88,49.6Z" />
      <_Path d="M218.3,76.4a.8.8,0,0,1-.2-.4l-.4-.5A103.9,103.9,0,0,0,128,24a8,8,0,0,0-8,8v91.4L40.9,169.1a7.9,7.9,0,0,0-3,10.9v.2l.3.5A104,104,0,0,0,232,128,103.5,103.5,0,0,0,218.3,76.4Z" />
    </_Svg>
  )
}

Icon.displayName = 'ChartPieSliceFill'

export const ChartPieSliceFill = memo<IconProps>(themed(Icon))
