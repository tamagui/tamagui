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
      <_Path d="M156,128a28,28,0,1,1-28-28A28.1,28.1,0,0,1,156,128ZM48,100a28,28,0,1,0,28,28A28.1,28.1,0,0,0,48,100Zm160,0a28,28,0,1,0,28,28A28.1,28.1,0,0,0,208,100Z" />
    </_Svg>
  )
}

Icon.displayName = 'DotsThreeOutlineFill'

export const DotsThreeOutlineFill = memo<IconProps>(themed(Icon))
