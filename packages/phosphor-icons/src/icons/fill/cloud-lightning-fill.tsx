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
      <_Path d="M134.6,168l-15.8,24H154a8,8,0,0,1,6.2,2.7,7.8,7.8,0,0,1,.7,9.7l-26.2,40A8.2,8.2,0,0,1,128,248a8.4,8.4,0,0,1-5.1-1.8,8.3,8.3,0,0,1-1.5-10.8l18-27.4H104.2a8.3,8.3,0,0,1-6.2-2.7,8.1,8.1,0,0,1-.7-9.7L115.4,168H76.8c-28.7,0-52.6-23-52.8-51.7A52,52,0,0,1,61.5,66.1a4,4,0,0,1,5,4.7,91.4,91.4,0,0,0-2.5,21,8.3,8.3,0,0,0,7.5,8.2A8,8,0,0,0,80,92a76.4,76.4,0,0,1,5-27.2h0A76,76,0,1,1,156,168Z" />
    </_Svg>
  )
}

Icon.displayName = 'CloudLightningFill'

export const CloudLightningFill = memo<IconProps>(themed(Icon))
