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
      <_Circle cx="212" cy="108" r="20" opacity="0.2" />
      <_Circle cx="44" cy="108" r="20" opacity="0.2" />
      <_Circle cx="92" cy="60" r="20" opacity="0.2" />
      <_Circle cx="164" cy="60" r="20" opacity="0.2" />
      <_Path
        d="M183.2,155.9a43.6,43.6,0,0,1-20.6-26h0a36,36,0,0,0-69.2,0h0a43.6,43.6,0,0,1-20.6,26A32,32,0,0,0,88,216a32.4,32.4,0,0,0,12.5-2.5,71.8,71.8,0,0,1,55,0A32.4,32.4,0,0,0,168,216a32,32,0,0,0,15.2-60.1Z"
        opacity="0.2"
      />
      <_Circle
        cx="212"
        cy="108"
        r="20"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Circle
        cx="44"
        cy="108"
        r="20"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Circle
        cx="92"
        cy="60"
        r="20"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Circle
        cx="164"
        cy="60"
        r="20"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Path
        d="M183.2,155.9a43.6,43.6,0,0,1-20.6-26h0a36,36,0,0,0-69.2,0h0a43.6,43.6,0,0,1-20.6,26A32,32,0,0,0,88,216a32.4,32.4,0,0,0,12.5-2.5,71.8,71.8,0,0,1,55,0A32.4,32.4,0,0,0,168,216a32,32,0,0,0,15.2-60.1Z"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </_Svg>
  )
}

Icon.displayName = 'PawPrintDuotone'

export const PawPrintDuotone = memo<IconProps>(themed(Icon))
