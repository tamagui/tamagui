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
      <_Path d="M120,48a32,32,0,1,1,32,32A32.1,32.1,0,0,1,120,48Zm88,88c-28.5,0-41.7-14.1-55.6-29.1-3.5-3.8-7.2-7.7-11-11.2-37.2-34.4-96.5,24.1-99.1,26.6a8.1,8.1,0,1,0,11.4,11.4,157.3,157.3,0,0,1,30.5-23.2c14.3-8.2,26.3-11.1,35.7-8.8l-17.7,40.7h0L64.7,228.8a7.9,7.9,0,0,0,4.1,10.5,7.1,7.1,0,0,0,3.2.7,7.9,7.9,0,0,0,7.3-4.8l33.6-77.3L144,180.1V232a8,8,0,0,0,16,0V176a7.8,7.8,0,0,0-3.4-6.5l-37.1-26.6,14.1-32.5,7.1,7.4C154.9,133,172.5,152,208,152a8,8,0,0,0,0-16Z" />
    </_Svg>
  )
}

Icon.displayName = 'PersonSimpleWalkFill'

export const PersonSimpleWalkFill = memo<IconProps>(themed(Icon))
