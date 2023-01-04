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
      <_Path d="M205.7,61.7l-144,144a8.2,8.2,0,0,1-11.4,0,8.1,8.1,0,0,1,0-11.4l144-144a8.1,8.1,0,0,1,11.4,11.4ZM50.5,101.5a36.2,36.2,0,0,1,0-51,36.2,36.2,0,0,1,51,0,36.1,36.1,0,0,1-51,51ZM56,76a19.7,19.7,0,0,0,5.9,14.1,19.9,19.9,0,0,0,28.2,0,19.8,19.8,0,0,0,0-28.2h0a19.8,19.8,0,0,0-28.2,0A19.7,19.7,0,0,0,56,76ZM216,180a36,36,0,1,1-61.5-25.5,36.2,36.2,0,0,1,51,0A35.9,35.9,0,0,1,216,180Zm-16,0a19.7,19.7,0,0,0-5.9-14.1,19.8,19.8,0,0,0-28.2,0A19.9,19.9,0,1,0,200,180Z" />
    </_Svg>
  )
}

Icon.displayName = 'PercentFill'

export const PercentFill = memo<IconProps>(themed(Icon))
