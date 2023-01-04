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
      <_Path d="M78.6,85a8.2,8.2,0,0,1,1.7-8.7l42-42a8.1,8.1,0,0,1,11.4,0l42,42a8.2,8.2,0,0,1,1.7,8.7,8,8,0,0,1-7.4,5H136v62a8,8,0,0,1-16,0V90H86A8,8,0,0,1,78.6,85ZM216,144a8,8,0,0,0-8,8v56H48V152a8,8,0,0,0-16,0v56a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V152A8,8,0,0,0,216,144Z" />
    </_Svg>
  )
}

Icon.displayName = 'UploadSimpleFill'

export const UploadSimpleFill = memo<IconProps>(themed(Icon))
