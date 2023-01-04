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
      <_Path d="M232,84v40a8,8,0,0,1-8,8,103.2,103.2,0,0,1-48-11.7V156A76,76,0,1,1,86.6,81.2a8,8,0,0,1,6.5,1.7A7.8,7.8,0,0,1,96,89.1v41.6a7.9,7.9,0,0,1-4.6,7.2A20,20,0,1,0,120,156V28a8,8,0,0,1,8-8h40a8,8,0,0,1,8,8,48,48,0,0,0,48,48A8,8,0,0,1,232,84Z" />
    </_Svg>
  )
}

Icon.displayName = 'TiktokLogoFill'

export const TiktokLogoFill = memo<IconProps>(themed(Icon))
