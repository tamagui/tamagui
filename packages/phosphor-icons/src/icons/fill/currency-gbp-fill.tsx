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
      <_Path d="M192,208a8,8,0,0,1-8,8H56a8,8,0,0,1,0-16,28.1,28.1,0,0,0,28-28V140H56a8,8,0,0,1,0-16H84V84a52,52,0,0,1,88.8-36.8,8,8,0,0,1,0,11.3,7.9,7.9,0,0,1-11.3,0A36.1,36.1,0,0,0,100,84v40h36a8,8,0,0,1,0,16H100v32a43.8,43.8,0,0,1-10.1,28H184A8,8,0,0,1,192,208Z" />
    </_Svg>
  )
}

Icon.displayName = 'CurrencyGbpFill'

export const CurrencyGbpFill = memo<IconProps>(themed(Icon))
