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
      <_Path d="M128,16C87.6,16,56,34.4,56,58V198c0,23.6,31.6,42,72,42s72-18.4,72-42V58C200,34.4,168.4,16,128,16Zm0,208c-33,0-56-13.7-56-26V84.7c13.1,9.4,33.1,15.3,56,15.3s42.9-5.9,56-15.3V198C184,210.3,161,224,128,224Z" />
    </_Svg>
  )
}

Icon.displayName = 'CylinderFill'

export const CylinderFill = memo<IconProps>(themed(Icon))
