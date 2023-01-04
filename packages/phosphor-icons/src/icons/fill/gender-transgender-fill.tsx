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
      <_Path d="M216,32H168a8,8,0,0,0,0,16h28.7L168,76.7,149.7,58.3a8.1,8.1,0,0,0-11.4,11.4L156.7,88l-15.8,15.8a72.2,72.2,0,1,0,11.3,11.3L168,99.3l18.3,18.4a8.2,8.2,0,0,0,11.4,0,8.1,8.1,0,0,0,0-11.4L179.3,88,208,59.3V88a8,8,0,0,0,16,0V40A8,8,0,0,0,216,32ZM135.6,199.6a56.1,56.1,0,0,1-79.2,0,56,56,0,0,1,79.2-79.2,56,56,0,0,1,0,79.2Z" />
    </_Svg>
  )
}

Icon.displayName = 'GenderTransgenderFill'

export const GenderTransgenderFill = memo<IconProps>(themed(Icon))
