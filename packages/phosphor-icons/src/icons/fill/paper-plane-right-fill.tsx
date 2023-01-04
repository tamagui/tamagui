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
      <_Path d="M223.4,114,54.9,19.7a16.3,16.3,0,0,0-18.2,1.2,15.9,15.9,0,0,0-5.1,17.9l28.1,78.5a4.1,4.1,0,0,0,3.8,2.7h72.2a8.2,8.2,0,0,1,8.3,7.5,8,8,0,0,1-8,8.5H63.5a4.1,4.1,0,0,0-3.8,2.7L31.6,217.2a16.1,16.1,0,0,0,15.1,21.4,16.5,16.5,0,0,0,7.8-2L223.4,142a16.1,16.1,0,0,0,0-28Z" />
    </_Svg>
  )
}

Icon.displayName = 'PaperPlaneRightFill'

export const PaperPlaneRightFill = memo<IconProps>(themed(Icon))
