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
      <_Path d="M229.9,70.8h0a.1.1,0,0,1-.1-.1,16.2,16.2,0,0,0-6-5.9l-88-49.5a16,16,0,0,0-15.6,0l-88,49.5a16.2,16.2,0,0,0-6,5.9.1.1,0,0,1-.1.1v.2A15,15,0,0,0,24,78.7v98.6a16.1,16.1,0,0,0,8.2,14l88,49.5a16.5,16.5,0,0,0,7.2,2h1.4a15.7,15.7,0,0,0,7-2l88-49.5a16.1,16.1,0,0,0,8.2-14V78.7A15.6,15.6,0,0,0,229.9,70.8ZM128,29.2,207.7,74,177.1,91.4,96.4,46.9Zm.9,89.6L48.4,74,80,56.2l80.8,44.5Zm7.2,103.5.8-89.6L169,114.4v38.1a8,8,0,0,0,16,0V105.3l31-17.6v89.6Z" />
    </_Svg>
  )
}

Icon.displayName = 'PackageFill'

export const PackageFill = memo<IconProps>(themed(Icon))
