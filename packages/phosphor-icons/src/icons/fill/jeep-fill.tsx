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
      <_Path d="M239.7,88H226.9l-6-42.3A16,16,0,0,0,205.1,32H50.9A16,16,0,0,0,35.1,45.7L29.1,88H16.3A8.2,8.2,0,0,0,8,95.5a8,8,0,0,0,8,8.5H28V208a16,16,0,0,0,16,16H68a16,16,0,0,0,16-16V184h16a4,4,0,0,0,4-4V128.3a8.2,8.2,0,0,1,7.5-8.3,8,8,0,0,1,8.5,8v52a4,4,0,0,0,4,4h8a4,4,0,0,0,4-4V128.3a8.2,8.2,0,0,1,7.5-8.3,8,8,0,0,1,8.5,8v52a4,4,0,0,0,4,4h16v24a16,16,0,0,0,16,16h24a16,16,0,0,0,16-16V104h12a8,8,0,0,0,8-8.5A8.2,8.2,0,0,0,239.7,88ZM72,144a12,12,0,1,1,12-12A12,12,0,0,1,72,144Zm112,0a12,12,0,1,1,12-12A12,12,0,0,1,184,144Z" />
    </_Svg>
  )
}

Icon.displayName = 'JeepFill'

export const JeepFill = memo<IconProps>(themed(Icon))
