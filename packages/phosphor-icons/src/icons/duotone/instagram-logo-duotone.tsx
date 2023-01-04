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
      <_Path
        d="M172,36H84A48,48,0,0,0,36,84v88a48,48,0,0,0,48,48h88a48,48,0,0,0,48-48V84A48,48,0,0,0,172,36ZM128,168a40,40,0,1,1,40-40A40,40,0,0,1,128,168Z"
        opacity="0.2"
      />
      <_Circle
        cx="128"
        cy="128"
        r="40"
        fill="none"
        stroke={`${color}`}
        strokeMiterlimit="10"
        strokeWidth="16"
      />
      <_Rect
        x="36"
        y="36"
        width="184"
        height="184"
        rx="48"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Circle cx="180" cy="76" r="12" />
    </_Svg>
  )
}

Icon.displayName = 'InstagramLogoDuotone'

export const InstagramLogoDuotone = memo<IconProps>(themed(Icon))
