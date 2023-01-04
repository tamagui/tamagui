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
      <_Path d="M182.1,210.8A8,8,0,0,1,176,224H80a8,8,0,0,1-6.1-13.2l48-56a8,8,0,0,1,12.2,0ZM208,40H48A23.9,23.9,0,0,0,24,64V176a23.9,23.9,0,0,0,24,24H60.3a4.1,4.1,0,0,0,3-1.4l46.5-54.2a23.9,23.9,0,0,1,36.4,0l46.5,54.2a4.1,4.1,0,0,0,3,1.4H208a23.9,23.9,0,0,0,24-24V64A23.9,23.9,0,0,0,208,40Z" />
    </_Svg>
  )
}

Icon.displayName = 'AirplayFill'

export const AirplayFill = memo<IconProps>(themed(Icon))
