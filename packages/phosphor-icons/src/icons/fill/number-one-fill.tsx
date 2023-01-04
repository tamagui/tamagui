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
      <_Path d="M132,232a8,8,0,0,1-8-8V47L88.4,70.6a8,8,0,0,1-11.1-2.2,8.1,8.1,0,0,1,2.3-11.1l48-32a8.3,8.3,0,0,1,8.2-.4A8,8,0,0,1,140,32V224A8,8,0,0,1,132,232Z" />
    </_Svg>
  )
}

Icon.displayName = 'NumberOneFill'

export const NumberOneFill = memo<IconProps>(themed(Icon))
