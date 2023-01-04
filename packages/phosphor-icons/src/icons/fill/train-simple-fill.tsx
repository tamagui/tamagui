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
      <_Path d="M188,24H68A32.1,32.1,0,0,0,36,56V184a32.1,32.1,0,0,0,32,32H80L65.6,235.2a8,8,0,0,0,1.6,11.2A7.7,7.7,0,0,0,72,248a8,8,0,0,0,6.4-3.2L100,216h56l21.6,28.8A8,8,0,0,0,184,248a7.7,7.7,0,0,0,4.8-1.6,8,8,0,0,0,1.6-11.2L176,216h12a32.1,32.1,0,0,0,32-32V56A32.1,32.1,0,0,0,188,24Zm0,176H68a16,16,0,0,1-16-16V136H204v48A16,16,0,0,1,188,200Z" />
      <_Circle cx="84" cy="172" r="12" />
      <_Circle cx="172" cy="172" r="12" />
    </_Svg>
  )
}

Icon.displayName = 'TrainSimpleFill'

export const TrainSimpleFill = memo<IconProps>(themed(Icon))
