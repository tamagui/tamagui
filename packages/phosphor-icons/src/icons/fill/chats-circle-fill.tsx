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
      <_Path d="M230.5,189.8A80,80,0,0,0,169.6,72.6,80,80,0,1,0,25.5,141.8l-6.2,21.6a13.9,13.9,0,0,0,17.3,17.3l21.6-6.2a80.8,80.8,0,0,0,28.2,8.9,80,80,0,0,0,111.4,39.1l21.6,6.2a13.9,13.9,0,0,0,17.3-17.3Zm-15.4-5.1a7.6,7.6,0,0,0-.9,6.2l6.2,21.5-21.5-6.2a7.6,7.6,0,0,0-6.2.9,64.2,64.2,0,0,1-88.4-23.5A80.2,80.2,0,0,0,176,104a83.6,83.6,0,0,0-1.3-14.3A64,64,0,0,1,224,152,64.8,64.8,0,0,1,215.1,184.7Z" />
    </_Svg>
  )
}

Icon.displayName = 'ChatsCircleFill'

export const ChatsCircleFill = memo<IconProps>(themed(Icon))
