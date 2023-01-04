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
      <_Path d="M212.9,25.7a8,8,0,0,0-6.8-1.5l-128,32A8,8,0,0,0,72,64V174.1A36,36,0,1,0,88,204V110.2l112-28v59.9A36,36,0,1,0,216,172V32A7.8,7.8,0,0,0,212.9,25.7Z" />
    </_Svg>
  )
}

Icon.displayName = 'MusicNotesFill'

export const MusicNotesFill = memo<IconProps>(themed(Icon))
