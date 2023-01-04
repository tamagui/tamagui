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
      <_Path d="M132.9,231.4A8,8,0,0,1,128,224V184H104a8,8,0,0,1-8-8V80a8,8,0,0,1,8-8h24V32a8,8,0,0,1,4.9-7.4,8.4,8.4,0,0,1,8.8,1.7l96,96a8.1,8.1,0,0,1,0,11.4l-96,96A8.4,8.4,0,0,1,132.9,231.4ZM48,176V80a8,8,0,0,0-16,0v96a8,8,0,0,0,16,0Zm32,0V80a8,8,0,0,0-16,0v96a8,8,0,0,0,16,0Z" />
    </_Svg>
  )
}

Icon.displayName = 'ArrowFatLinesRightFill'

export const ArrowFatLinesRightFill = memo<IconProps>(themed(Icon))
