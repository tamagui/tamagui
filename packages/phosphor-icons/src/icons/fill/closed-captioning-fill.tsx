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
      <_Path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM96,148a19.8,19.8,0,0,0,14.3-6,8,8,0,0,1,11.4,11.2A35.4,35.4,0,0,1,96,164a36,36,0,0,1,0-72,35.4,35.4,0,0,1,25.7,10.8A8,8,0,0,1,110.3,114,19.8,19.8,0,0,0,96,108a20,20,0,0,0,0,40Zm72,0a19.8,19.8,0,0,0,14.3-6,8,8,0,0,1,11.4,11.2A35.4,35.4,0,0,1,168,164a36,36,0,0,1,0-72,35.4,35.4,0,0,1,25.7,10.8A8,8,0,0,1,182.3,114a19.8,19.8,0,0,0-14.3-6,20,20,0,0,0,0,40Z" />
    </_Svg>
  )
}

Icon.displayName = 'ClosedCaptioningFill'

export const ClosedCaptioningFill = memo<IconProps>(themed(Icon))
