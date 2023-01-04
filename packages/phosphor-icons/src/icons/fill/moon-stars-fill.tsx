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
      <_Path d="M240,80H224V64a8,8,0,0,0-16,0V80H192a8,8,0,0,0,0,16h16v16a8,8,0,0,0,16,0V96h16a8,8,0,0,0,0-16Z" />
      <_Path d="M152,48h8v8a8,8,0,0,0,16,0V48h8a8,8,0,0,0,0-16h-8V24a8,8,0,0,0-16,0v8h-8a8,8,0,0,0,0,16Z" />
      <_Path d="M216.5,144.6l-2.2.4A84,84,0,0,1,111,41.6a5.7,5.7,0,0,0,.3-1.8,8,8,0,0,0-5-7.9,7.8,7.8,0,0,0-5.2-.2A100,100,0,1,0,224.3,154.9a7.9,7.9,0,0,0,0-4.8A8.2,8.2,0,0,0,216.5,144.6Z" />
    </_Svg>
  )
}

Icon.displayName = 'MoonStarsFill'

export const MoonStarsFill = memo<IconProps>(themed(Icon))
