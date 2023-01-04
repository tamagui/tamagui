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
      <_Path d="M176,232a8,8,0,0,1-8,8H88a8,8,0,0,1,0-16h80A8,8,0,0,1,176,232Zm40-128a87.7,87.7,0,0,1-33.6,69.2A16.1,16.1,0,0,0,176,186v6a16,16,0,0,1-16,16H96a16,16,0,0,1-16-16v-6a16.2,16.2,0,0,0-6.2-12.7A87.8,87.8,0,0,1,40,104.5C39.7,56.8,78.3,17.1,125.9,16A87.9,87.9,0,0,1,216,104Zm-32.8-9.4a55.8,55.8,0,0,0-45.8-45.7,8,8,0,1,0-2.6,15.8,39.7,39.7,0,0,1,32.6,32.6,8,8,0,0,0,7.9,6.6h1.4A7.9,7.9,0,0,0,183.2,94.6Z" />
    </_Svg>
  )
}

Icon.displayName = 'LightbulbFill'

export const LightbulbFill = memo<IconProps>(themed(Icon))
