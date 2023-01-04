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
        x="99.7"
        y="35.7"
        width="56.6"
        height="56.57"
        rx="8"
        transform="translate(-7.8 109.3) rotate(-45)"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="12"
      />
      <_Rect
        x="163.7"
        y="99.7"
        width="56.6"
        height="56.57"
        rx="8"
        transform="translate(-34.3 173.3) rotate(-45)"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="12"
      />
      <_Rect
        x="35.7"
        y="99.7"
        width="56.6"
        height="56.57"
        rx="8"
        transform="translate(-71.8 82.7) rotate(-45)"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="12"
      />
      <_Rect
        x="99.7"
        y="163.7"
        width="56.6"
        height="56.57"
        rx="8"
        transform="translate(-98.3 146.7) rotate(-45)"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="12"
      />
    </_Svg>
  )
}

Icon.displayName = 'DiamondsFourLight'

export const DiamondsFourLight = memo<IconProps>(themed(Icon))
