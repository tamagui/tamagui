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
      <_Path d="M227.1,64.6l-96-40a8.3,8.3,0,0,0-6.2,0l-96,40a8.1,8.1,0,0,0-4.8,8.5l16,120a8.1,8.1,0,0,0,4.3,6.1l80,40a8.5,8.5,0,0,0,7.2,0l80-40a8.1,8.1,0,0,0,4.3-6.1l16-120A8.1,8.1,0,0,0,227.1,64.6ZM167.6,167.2a9.4,9.4,0,0,1-3.6.8,8.1,8.1,0,0,1-7.2-4.4l-8.4-16.9H107.6l-8.4,16.9a8,8,0,0,1-14.4-7.2l36-72a8.1,8.1,0,0,1,14.4,0l36,72A8.2,8.2,0,0,1,167.6,167.2ZM128,105.9l12.4,24.8H115.6Z" />
    </_Svg>
  )
}

Icon.displayName = 'AngularLogoFill'

export const AngularLogoFill = memo<IconProps>(themed(Icon))
