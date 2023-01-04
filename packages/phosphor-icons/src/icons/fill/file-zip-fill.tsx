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
      <_Path d="M184,160H168a8,8,0,0,0-8,8v48a8,8,0,0,0,16,0v-8h8a24,24,0,0,0,0-48Zm0,32h-8V176h8a8,8,0,0,1,0,16ZM96,216a8,8,0,0,1-8,8H56a8,8,0,0,1-7.1-4.2,8.3,8.3,0,0,1,.4-8.2L73.1,176H56a8,8,0,0,1,0-16H88a8,8,0,0,1,7.1,4.2,8.3,8.3,0,0,1-.4,8.2L70.9,208H88A8,8,0,0,1,96,216Zm40-48v48a8,8,0,0,1-16,0V168a8,8,0,0,1,16,0Zm77.7-85.7-56-56A8.1,8.1,0,0,0,152,24H56A16,16,0,0,0,40,40v88a8,8,0,0,0,8,8H208a8,8,0,0,0,8-8V88A8.1,8.1,0,0,0,213.7,82.3ZM152,88V44l44,44Z" />
    </_Svg>
  )
}

Icon.displayName = 'FileZipFill'

export const FileZipFill = memo<IconProps>(themed(Icon))
