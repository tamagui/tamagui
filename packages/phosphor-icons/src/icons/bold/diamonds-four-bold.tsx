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
      <_Rect
        x="101.1"
        y="35.1"
        width="53.7"
        height="53.74"
        rx="8"
        transform="translate(-6.4 108.7) rotate(-45)"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      />
      <_Rect
        x="167.1"
        y="101.1"
        width="53.7"
        height="53.74"
        rx="8"
        transform="translate(-33.7 174.7) rotate(-45)"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      />
      <_Rect
        x="35.1"
        y="101.1"
        width="53.7"
        height="53.74"
        rx="8"
        transform="translate(-72.4 81.3) rotate(-45)"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      />
      <_Rect
        x="101.1"
        y="167.1"
        width="53.7"
        height="53.74"
        rx="8"
        transform="translate(-99.7 147.3) rotate(-45)"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      />
    </_Svg>
  )
}

Icon.displayName = 'DiamondsFourBold'

export const DiamondsFourBold = memo<IconProps>(themed(Icon))
