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
      <_Path d="M236,139.3,139.3,236a15.9,15.9,0,0,1-22.6,0L20,139.3a16.1,16.1,0,0,1,0-22.6L116.7,20a16.1,16.1,0,0,1,22.6,0L236,116.7A16.1,16.1,0,0,1,236,139.3Z" />
    </_Svg>
  )
}

Icon.displayName = 'DiamondFill'

export const DiamondFill = memo<IconProps>(themed(Icon))
