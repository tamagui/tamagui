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
      <_Path d="M128,24A104,104,0,1,0,232,128,104.2,104.2,0,0,0,128,24Zm36,132a8.5,8.5,0,0,1-.6,3.1,8.2,8.2,0,0,1-4.3,4.3,8.5,8.5,0,0,1-3.1.6H108a8,8,0,0,1,0-16h28.7L94.3,105.7a8.1,8.1,0,0,1,11.4-11.4L148,136.7V108a8,8,0,0,1,16,0Z" />
    </_Svg>
  )
}

Icon.displayName = 'ArrowCircleDownRightFill'

export const ArrowCircleDownRightFill = memo<IconProps>(themed(Icon))
