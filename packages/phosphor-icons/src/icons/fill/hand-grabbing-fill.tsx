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
      <_Path d="M188,80a27.8,27.8,0,0,0-13.4,3.4,28,28,0,0,0-46.6-11A28,28,0,0,0,80,92v16H68a28.1,28.1,0,0,0-28,28v16a88,88,0,0,0,176,0V108A28.1,28.1,0,0,0,188,80Zm12,72a72,72,0,0,1-144,0V136a12,12,0,0,1,12-12H80v24a8,8,0,0,0,16,0V92a12,12,0,0,1,24,0v32a8,8,0,0,0,16,0V92a12,12,0,0,1,24,0v32a8,8,0,0,0,16,0V108a12,12,0,0,1,24,0Z" />
    </_Svg>
  )
}

Icon.displayName = 'HandGrabbingFill'

export const HandGrabbingFill = memo<IconProps>(themed(Icon))
