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
      <_Path d="M200,128a71.3,71.3,0,0,1-15.8,44.9L83.1,71.8A71.3,71.3,0,0,1,128,56,72.1,72.1,0,0,1,200,128ZM56,128a72.1,72.1,0,0,0,72,72,71.3,71.3,0,0,0,44.9-15.8L71.8,83.1A71.3,71.3,0,0,0,56,128Zm180,0A108,108,0,1,1,128,20,108.1,108.1,0,0,1,236,128Zm-20,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z" />
    </_Svg>
  )
}

Icon.displayName = 'ProhibitFill'

export const ProhibitFill = memo<IconProps>(themed(Icon))
