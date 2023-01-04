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
        d="M178.8,71.7a46.3,46.3,0,0,1-14.9,33.7,53.3,53.3,0,0,1-71.8,0,45.6,45.6,0,0,1,0-67.4,53,53,0,0,1,71.8,0A46,46,0,0,1,178.8,71.7Z"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Path
        d="M188,175.7a54.4,54.4,0,0,1-17.6,39.8,62.7,62.7,0,0,1-84.8,0,53.9,53.9,0,0,1,0-79.7,62.7,62.7,0,0,1,84.8,0A54.4,54.4,0,0,1,188,175.7Z"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </_Svg>
  )
}

Icon.displayName = 'NumberEightRegular'

export const NumberEightRegular = memo<IconProps>(themed(Icon))
