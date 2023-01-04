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
      <_Path d="M136,87.5V56a8,8,0,0,0-16,0V87.5a98.7,98.7,0,0,1,8,12.7A98.7,98.7,0,0,1,136,87.5Z" />
      <_Path d="M231.4,50.4C227.7,45.6,220.7,40,208,40c-16.7,0-38.1,11.3-57.2,30.3A144.2,144.2,0,0,0,136,87.5V172a8,8,0,0,1-16,0V87.5a144.2,144.2,0,0,0-14.8-17.2C86.1,51.3,64.7,40,48,40c-12.7,0-19.7,5.6-23.4,10.4-6.8,8.7-12.2,24.1-.4,71.5,6.6,26.3,22,34.9,33.5,37.5a40,40,0,1,0,70.3,38,40,40,0,1,0,70.3-38c11.5-2.6,26.9-11.2,33.5-37.5S243.6,66,231.4,50.4Z" />
    </_Svg>
  )
}

Icon.displayName = 'ButterflyFill'

export const ButterflyFill = memo<IconProps>(themed(Icon))
