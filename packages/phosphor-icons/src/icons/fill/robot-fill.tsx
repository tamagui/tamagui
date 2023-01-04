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
      <_Path d="M200,48H136V16a8,8,0,0,0-16,0V48H56A32.1,32.1,0,0,0,24,80V192a32.1,32.1,0,0,0,32,32H200a32.1,32.1,0,0,0,32-32V80A32.1,32.1,0,0,0,200,48ZM72,108a12,12,0,1,1,12,12A12,12,0,0,1,72,108Zm28,76H92a16,16,0,0,1,0-32h8Zm40,0H116V152h24Zm24,0h-8V152h8a16,16,0,0,1,0,32Zm8-64a12,12,0,1,1,12-12A12,12,0,0,1,172,120Z" />
    </_Svg>
  )
}

Icon.displayName = 'RobotFill'

export const RobotFill = memo<IconProps>(themed(Icon))
