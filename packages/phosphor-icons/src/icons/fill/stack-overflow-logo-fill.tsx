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
      <_Path d="M216,152v64a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V152a8,8,0,0,1,16,0v56H200V152a8,8,0,0,1,16,0ZM88,184h80a8,8,0,0,0,0-16H88a8,8,0,0,0,0,16Zm4.9-53.1,77.3,20.7a6.4,6.4,0,0,0,2,.3,8,8,0,0,0,2.1-15.7L97,115.5a8,8,0,1,0-4.1,15.4Zm18.4-50,69.3,40a7.3,7.3,0,0,0,4,1.1,7.7,7.7,0,0,0,6.9-4,7.9,7.9,0,0,0-2.9-10.9l-69.3-40a8,8,0,0,0-8,13.8ZM198.7,94a8,8,0,0,0,5.6,2.3A8.3,8.3,0,0,0,210,94a8,8,0,0,0,0-11.3L153.4,26.1a8,8,0,0,0-11.3,11.3Z" />
    </_Svg>
  )
}

Icon.displayName = 'StackOverflowLogoFill'

export const StackOverflowLogoFill = memo<IconProps>(themed(Icon))
