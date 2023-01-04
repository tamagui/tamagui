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
      <_Path d="M208,56H180.3L166.7,35.6A7.9,7.9,0,0,0,160,32H96a7.9,7.9,0,0,0-6.7,3.6L75.7,56H48A24.1,24.1,0,0,0,24,80V192a24.1,24.1,0,0,0,24,24H208a24.1,24.1,0,0,0,24-24V80A24.1,24.1,0,0,0,208,56Zm-44,76a36,36,0,1,1-36-36A36,36,0,0,1,164,132Z" />
    </_Svg>
  )
}

Icon.displayName = 'CameraFill'

export const CameraFill = memo<IconProps>(themed(Icon))
