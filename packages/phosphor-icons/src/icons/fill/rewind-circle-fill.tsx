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
      <_Path d="M24,128A104,104,0,1,0,128,24,104.2,104.2,0,0,0,24,128Zm44,0a8.2,8.2,0,0,1,3.4-6.6l40-28a8,8,0,0,1,8.3-.5A8.1,8.1,0,0,1,124,100v28a8.2,8.2,0,0,1,3.4-6.6l40-28a8,8,0,0,1,8.3-.5A8.1,8.1,0,0,1,180,100v56a8,8,0,0,1-8,8,8.6,8.6,0,0,1-4.6-1.4l-40-28A8.2,8.2,0,0,1,124,128v28a8,8,0,0,1-8,8,8.6,8.6,0,0,1-4.6-1.4l-40-28A8.2,8.2,0,0,1,68,128Z" />
    </_Svg>
  )
}

Icon.displayName = 'RewindCircleFill'

export const RewindCircleFill = memo<IconProps>(themed(Icon))
