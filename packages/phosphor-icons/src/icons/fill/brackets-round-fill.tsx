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
      <_Path d="M40,128c0,58.3,34.7,80.3,36.2,81.2A8,8,0,0,1,72,224a8.7,8.7,0,0,1-4.1-1.1C66.1,221.8,24,195.8,24,128S66.1,34.2,67.9,33.1a8.1,8.1,0,0,1,11,2.8,8,8,0,0,1-2.8,10.9C74.5,47.8,40,69.8,40,128ZM188.1,33.1a8,8,0,0,0-8.3,13.7c1.5.9,36.2,22.9,36.2,81.2s-34.7,80.3-36.1,81.1A8,8,0,0,0,184,224a8.7,8.7,0,0,0,4.1-1.1c1.8-1.1,43.9-27.1,43.9-94.9S189.9,34.2,188.1,33.1Z" />
    </_Svg>
  )
}

Icon.displayName = 'BracketsRoundFill'

export const BracketsRoundFill = memo<IconProps>(themed(Icon))
