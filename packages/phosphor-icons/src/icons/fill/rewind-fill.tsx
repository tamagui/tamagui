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
      <_Path d="M10.1,114.5,99.3,57.2A16,16,0,0,1,124,70.7v42.6l87.3-56.1A16,16,0,0,1,236,70.7V185.3a16.1,16.1,0,0,1-8.3,14.1,16.5,16.5,0,0,1-16.4-.6L124,142.7v42.6a16.1,16.1,0,0,1-8.3,14.1,16.5,16.5,0,0,1-16.4-.6L10.1,141.5a16.1,16.1,0,0,1,0-27Z" />
    </_Svg>
  )
}

Icon.displayName = 'RewindFill'

export const RewindFill = memo<IconProps>(themed(Icon))
