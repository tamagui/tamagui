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
    <_Svg viewBox="0 0 256 256" {...otherProps} height={size} width={size}>
      <_Rect width="256" height="256" fill="none" />
      <_Path
        d="M183.2,155.9a43.6,43.6,0,0,1-20.6-26h0a36,36,0,0,0-69.2,0h0a43.6,43.6,0,0,1-20.6,26A32,32,0,0,0,88,216a32.4,32.4,0,0,0,12.5-2.5,71.8,71.8,0,0,1,55,0A32.4,32.4,0,0,0,168,216a32,32,0,0,0,15.2-60.1Z"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      />
      <_Circle cx="208" cy="104" r="24" />
      <_Circle cx="48" cy="104" r="24" />
      <_Circle cx="96" cy="56" r="24" />
      <_Circle cx="160" cy="56" r="24" />
    </_Svg>
  )
}

Icon.displayName = 'PawPrintBold'

export const PawPrintBold = memo<IconProps>(themed(Icon))
