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
      <_Path d="M240,126.9,135.5,22.4A15.9,15.9,0,0,0,121.1,18L40.4,34.2a7.9,7.9,0,0,0-6.2,6.2L18,121.1a15.9,15.9,0,0,0,4.4,14.4L126.9,240a15.9,15.9,0,0,0,22.6,0L240,149.5a15.9,15.9,0,0,0,0-22.6ZM84,96A12,12,0,1,1,96,84,12,12,0,0,1,84,96Z" />
    </_Svg>
  )
}

Icon.displayName = 'TagFill'

export const TagFill = memo<IconProps>(themed(Icon))
