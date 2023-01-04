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
      <_Path d="M192,184H46c-21.6,0-39.2-17.9-39.2-40S24.4,104,46,104H190a24,24,0,0,1,0,48H78a8,8,0,0,1,0-16H190a8,8,0,0,0,0-16H46c-12.8,0-23.2,10.8-23.2,24S33.2,168,46,168H192a40,40,0,0,0,0-80H80a8,8,0,0,1,0-16H192a56,56,0,0,1,0,112Z" />
    </_Svg>
  )
}

Icon.displayName = 'PaperclipHorizontalFill'

export const PaperclipHorizontalFill = memo<IconProps>(themed(Icon))
