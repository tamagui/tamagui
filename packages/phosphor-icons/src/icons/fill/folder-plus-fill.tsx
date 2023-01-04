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
      <_Path d="M216,72H131.3L104,44.7A16.1,16.1,0,0,0,92.7,40H40A16,16,0,0,0,24,56V200.6A15.4,15.4,0,0,0,39.4,216H216.9A15.2,15.2,0,0,0,232,200.9V88A16,16,0,0,0,216,72ZM40,56H92.7l16,16H40Zm112,96H136v16a8,8,0,0,1-16,0V152H104a8,8,0,0,1,0-16h16V120a8,8,0,0,1,16,0v16h16a8,8,0,0,1,0,16Z" />
    </_Svg>
  )
}

Icon.displayName = 'FolderPlusFill'

export const FolderPlusFill = memo<IconProps>(themed(Icon))
